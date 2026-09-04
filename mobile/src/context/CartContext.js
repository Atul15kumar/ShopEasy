import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from './AuthContext';
import { fetchProductById } from '../services/productService';
import {
  fetchCart,
  addToCart as apiAddToCart,
  updateCartItem as apiUpdateCartItem,
  removeFromCart as apiRemoveFromCart,
  clearCart as apiClearCart,
} from '../services/cartService';

const CART_STORAGE_KEY = '@shopeasy_cart';

export const CartContext = createContext();

/**
 * Calculate financial totals for items in cart
 */
const calculateTotals = (items = []) => {
  let subtotal = 0;
  let totalDiscount = 0;
  let itemCount = 0;

  for (const item of items) {
    const prod = item.product || {};
    const price = Number(prod.price) || 0;
    const discountPrice = Number(prod.discountPrice) || 0;
    const qty = Number(item.quantity) || 1;

    itemCount += qty;
    subtotal += price * qty;
    if (discountPrice > 0 && discountPrice < price) {
      totalDiscount += (price - discountPrice) * qty;
    }
  }

  const itemsTotal = subtotal - totalDiscount;
  const deliveryCharge = itemsTotal > 50 || itemsTotal === 0 ? 0 : 5;
  const totalAmount = Math.max(0, itemsTotal + deliveryCharge);

  return {
    items,
    subtotal: Math.round(subtotal * 100) / 100,
    discount: Math.round(totalDiscount * 100) / 100,
    deliveryCharge,
    totalAmount: Math.round(totalAmount * 100) / 100,
    itemCount,
  };
};

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);

  const [cart, setCart] = useState({
    items: [],
    subtotal: 0,
    discount: 0,
    deliveryCharge: 0,
    totalAmount: 0,
    itemCount: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Load cart on startup and auth changes
  useEffect(() => {
    loadCart();
  }, [isAuthenticated]);

  const saveLocalCart = async (cartData) => {
    try {
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData.items || []));
    } catch (e) {
      console.warn('Could not save cart locally:', e.message);
    }
  };

  const loadCart = async () => {
    try {
      setIsLoading(true);
      // First load from local storage
      const savedJson = await AsyncStorage.getItem(CART_STORAGE_KEY);
      let localItems = savedJson ? JSON.parse(savedJson) : [];
      let updatedCart = calculateTotals(localItems);
      setCart(updatedCart);

      // Attempt to sync with server if authenticated
      if (isAuthenticated) {
        try {
          const res = await fetchCart();
          if (res?.data?.cart?.items?.length > 0) {
            setCart(res.data.cart);
            await saveLocalCart(res.data.cart);
          }
        } catch (serverErr) {
          // Server offline or non-mongo product; local cart remains active
        }
      }
    } catch (error) {
      console.warn('[Cart] Load error:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = async (productIdOrProduct, quantity = 1) => {
    try {
      setIsLoading(true);
      let productObj = null;

      if (typeof productIdOrProduct === 'object' && productIdOrProduct !== null) {
        productObj = productIdOrProduct;
      } else {
        const res = await fetchProductById(productIdOrProduct);
        productObj = res?.data?.product;
      }

      if (!productObj) {
        throw new Error('Product could not be found.');
      }

      const prodId = String(productObj._id || productObj.id);
      const currentItems = [...cart.items];
      const existingIdx = currentItems.findIndex(
        (i) => String(i.product?._id || i.product?.id) === prodId
      );

      if (existingIdx > -1) {
        currentItems[existingIdx].quantity += quantity;
      } else {
        currentItems.push({
          product: productObj,
          quantity,
        });
      }

      const updatedCart = calculateTotals(currentItems);
      setCart(updatedCart);
      await saveLocalCart(updatedCart);

      // Try server sync quietly in background
      if (isAuthenticated) {
        apiAddToCart(prodId, quantity).catch(() => {});
      }

      return { success: true, data: { cart: updatedCart } };
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      setIsLoading(true);
      const prodId = String(productId);
      let currentItems = [...cart.items];

      if (quantity <= 0) {
        currentItems = currentItems.filter(
          (i) => String(i.product?._id || i.product?.id) !== prodId
        );
      } else {
        const item = currentItems.find(
          (i) => String(i.product?._id || i.product?.id) === prodId
        );
        if (item) {
          item.quantity = quantity;
        }
      }

      const updatedCart = calculateTotals(currentItems);
      setCart(updatedCart);
      await saveLocalCart(updatedCart);

      if (isAuthenticated) {
        apiUpdateCartItem(prodId, quantity).catch(() => {});
      }

      return { success: true, data: { cart: updatedCart } };
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (productId) => {
    try {
      setIsLoading(true);
      const prodId = String(productId);
      const currentItems = cart.items.filter(
        (i) => String(i.product?._id || i.product?.id) !== prodId
      );

      const updatedCart = calculateTotals(currentItems);
      setCart(updatedCart);
      await saveLocalCart(updatedCart);

      if (isAuthenticated) {
        apiRemoveFromCart(prodId).catch(() => {});
      }

      return { success: true, data: { cart: updatedCart } };
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const emptyCart = async () => {
    try {
      setIsLoading(true);
      const cleared = calculateTotals([]);
      setCart(cleared);
      await saveLocalCart(cleared);

      if (isAuthenticated) {
        apiClearCart().catch(() => {});
      }

      return { success: true, data: { cart: cleared } };
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const isInCart = (productId) => {
    const prodId = String(productId);
    return cart.items.some(
      (item) => String(item.product?._id || item.product?.id) === prodId
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItems: cart.items,
        cartCount: cart.itemCount || 0,
        subtotal: cart.subtotal || 0,
        discount: cart.discount || 0,
        deliveryCharge: cart.deliveryCharge || 0,
        totalAmount: cart.totalAmount || 0,
        isLoading,
        loadCart,
        addItem,
        updateQuantity,
        removeItem,
        emptyCart,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;

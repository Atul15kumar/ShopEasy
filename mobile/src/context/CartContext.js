import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import {
  fetchCart,
  addToCart as apiAddToCart,
  updateCartItem as apiUpdateCartItem,
  removeFromCart as apiRemoveFromCart,
  clearCart as apiClearCart,
} from '../services/cartService';

export const CartContext = createContext();

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

  // Synchronize cart whenever user logs in or out
  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      setCart({
        items: [],
        subtotal: 0,
        discount: 0,
        deliveryCharge: 0,
        totalAmount: 0,
        itemCount: 0,
      });
    }
  }, [isAuthenticated]);

  const loadCart = async () => {
    try {
      setIsLoading(true);
      const res = await fetchCart();
      if (res?.data?.cart) {
        setCart(res.data.cart);
      }
    } catch (error) {
      console.warn('[Cart] Load notice:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = async (productId, quantity = 1) => {
    try {
      setIsLoading(true);
      const res = await apiAddToCart(productId, quantity);
      if (res?.data?.cart) {
        setCart(res.data.cart);
      }
      return res;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      setIsLoading(true);
      const res = await apiUpdateCartItem(productId, quantity);
      if (res?.data?.cart) {
        setCart(res.data.cart);
      }
      return res;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (productId) => {
    try {
      setIsLoading(true);
      const res = await apiRemoveFromCart(productId);
      if (res?.data?.cart) {
        setCart(res.data.cart);
      }
      return res;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const emptyCart = async () => {
    try {
      setIsLoading(true);
      const res = await apiClearCart();
      if (res?.data?.cart) {
        setCart(res.data.cart);
      }
      return res;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const isInCart = (productId) => {
    return cart.items.some(
      (item) => item.product?._id === productId || item.product === productId
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

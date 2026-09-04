import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from './AuthContext';
import { fetchProductById } from '../services/productService';
import {
  fetchWishlist,
  addToWishlist as apiAddToWishlist,
  removeFromWishlist as apiRemoveFromWishlist,
} from '../services/wishlistService';

const WISHLIST_STORAGE_KEY = '@shopeasy_wishlist';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);

  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadWishlist();
  }, [isAuthenticated]);

  const saveLocalWishlist = async (items) => {
    try {
      await AsyncStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Could not save wishlist locally:', e.message);
    }
  };

  const loadWishlist = async () => {
    try {
      setIsLoading(true);
      const savedJson = await AsyncStorage.getItem(WISHLIST_STORAGE_KEY);
      let localItems = savedJson ? JSON.parse(savedJson) : [];
      setWishlistItems(localItems);

      if (isAuthenticated) {
        try {
          const res = await fetchWishlist();
          if (res?.data?.wishlist?.products?.length > 0) {
            setWishlistItems(res.data.wishlist.products);
            await saveLocalWishlist(res.data.wishlist.products);
          }
        } catch (serverErr) {
          // Server offline; local wishlist continues working
        }
      }
    } catch (error) {
      console.warn('[Wishlist] Load notice:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = async (productIdOrProduct) => {
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
        throw new Error('Product not found.');
      }

      const prodId = String(productObj._id || productObj.id);
      const exists = wishlistItems.some(
        (item) => String(item._id || item.id) === prodId
      );

      if (!exists) {
        const updated = [...wishlistItems, productObj];
        setWishlistItems(updated);
        await saveLocalWishlist(updated);
      }

      if (isAuthenticated) {
        apiAddToWishlist(prodId).catch(() => {});
      }

      return { success: true };
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
      const updated = wishlistItems.filter(
        (item) => String(item._id || item.id) !== prodId
      );
      setWishlistItems(updated);
      await saveLocalWishlist(updated);

      if (isAuthenticated) {
        apiRemoveFromWishlist(prodId).catch(() => {});
      }

      return { success: true };
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const isInWishlist = (productId) => {
    const prodId = String(productId);
    return wishlistItems.some(
      (item) => String(item._id || item.id) === prodId
    );
  };

  const toggleWishlist = async (productIdOrProduct) => {
    const prodId =
      typeof productIdOrProduct === 'object' && productIdOrProduct !== null
        ? String(productIdOrProduct._id || productIdOrProduct.id)
        : String(productIdOrProduct);

    if (isInWishlist(prodId)) {
      await removeItem(prodId);
    } else {
      await addItem(productIdOrProduct);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        wishlistCount: wishlistItems.length,
        isLoading,
        loadWishlist,
        addItem,
        removeItem,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;

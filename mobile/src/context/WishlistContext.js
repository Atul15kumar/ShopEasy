import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import {
  fetchWishlist,
  addToWishlist as apiAddToWishlist,
  removeFromWishlist as apiRemoveFromWishlist,
} from '../services/wishlistService';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);

  const [wishlistItems, setWishlistItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadWishlist();
    } else {
      setWishlistItems([]);
    }
  }, [isAuthenticated]);

  const loadWishlist = async () => {
    try {
      setIsLoading(true);
      const res = await fetchWishlist();
      if (res?.data?.wishlist?.products) {
        setWishlistItems(res.data.wishlist.products);
      }
    } catch (error) {
      console.warn('[Wishlist] Load notice:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = async (productId) => {
    try {
      setIsLoading(true);
      const res = await apiAddToWishlist(productId);
      await loadWishlist();
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
      const res = await apiRemoveFromWishlist(productId);
      setWishlistItems((prev) =>
        prev.filter((item) => (item._id || item) !== productId)
      );
      return res;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(
      (item) => (item._id || item) === productId
    );
  };

  const toggleWishlist = async (productId) => {
    if (isInWishlist(productId)) {
      await removeItem(productId);
    } else {
      await addItem(productId);
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

import React, { createContext, useState, useEffect } from 'react';
import {
  getToken,
  setToken as storeToken,
  getUser,
  setUser as storeUser,
  clearAuthStorage,
} from '../utils/storage';
import { loginUser, registerUser, fetchProfile } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load persisted session on initial startup
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedToken = await getToken();
        const savedUser = await getUser();

        if (savedToken) {
          setToken(savedToken);
          if (savedUser) {
            setUser(savedUser);
          }

          // Verify with backend
          try {
            const profileRes = await fetchProfile();
            if (profileRes?.data?.user) {
              setUser(profileRes.data.user);
              await storeUser(profileRes.data.user);
            }
          } catch (e) {
            // If token expired or network unavailable, retain local user if valid
            console.log('[Auth] Profile sync notice:', e.message);
          }
        }
      } catch (error) {
        console.error('[Auth Init Error]', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const res = await loginUser(email, password);
    if (res?.success && res?.data) {
      const { user: userData, token: userToken } = res.data;
      setUser(userData);
      setToken(userToken);
      await storeToken(userToken);
      await storeUser(userData);
      return res;
    }
    throw new Error(res?.message || 'Login failed');
  };

  const register = async (userData) => {
    const res = await registerUser(userData);
    if (res?.success && res?.data) {
      const { user: newUser, token: userToken } = res.data;
      setUser(newUser);
      setToken(userToken);
      await storeToken(userToken);
      await storeUser(newUser);
      return res;
    }
    throw new Error(res?.message || 'Registration failed');
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await clearAuthStorage();
  };

  const refreshProfile = async () => {
    try {
      const res = await fetchProfile();
      if (res?.data?.user) {
        setUser(res.data.user);
        await storeUser(res.data.user);
      }
    } catch (error) {
      console.warn('Could not refresh profile:', error.message);
    }
  };

  const updateUserData = (updatedUser) => {
    setUser(updatedUser);
    storeUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token,
        login,
        register,
        logout,
        refreshProfile,
        updateUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

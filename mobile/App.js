import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import { WishlistProvider } from './src/context/WishlistContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <StatusBar style="dark" />
              <AppNavigator />
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

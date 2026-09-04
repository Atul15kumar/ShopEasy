import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import { WishlistProvider } from './src/context/WishlistContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  const appContent = (
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

  if (Platform.OS === 'web') {
    return (
      <View style={styles.webRoot}>
        <View style={styles.webContainer}>
          {appContent}
        </View>
      </View>
    );
  }

  return appContent;
}

const styles = StyleSheet.create({
  webRoot: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#F1F5F9',
  },
  webContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 1200,
    marginHorizontal: 'auto',
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
});

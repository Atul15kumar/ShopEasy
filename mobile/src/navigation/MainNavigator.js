import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import ProductListScreen from '../screens/products/ProductListScreen';
import ProductDetailsScreen from '../screens/products/ProductDetailsScreen';
import SearchScreen from '../screens/products/SearchScreen';
import CheckoutScreen from '../screens/cart/CheckoutScreen';
import OrdersScreen from '../screens/orders/OrdersScreen';
import OrderDetailsScreen from '../screens/orders/OrderDetailsScreen';
import OrderSuccessScreen from '../screens/orders/OrderSuccessScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import AddressScreen from '../screens/profile/AddressScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="TabRoot"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="TabRoot" component={TabNavigator} />
      <Stack.Screen name="ProductList" component={ProductListScreen} />
      <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />
      <Stack.Screen name="Search" component={SearchScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="Orders" component={OrdersScreen} />
      <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} />
      <Stack.Screen
        name="OrderSuccess"
        component={OrderSuccessScreen}
        options={{ gestureEnabled: false }}
      />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="AddressScreen" component={AddressScreen} />
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

export default MainNavigator;

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';
import HomeScreen from '../screens/home/HomeScreen';
import CategoriesScreen from '../screens/home/CategoriesScreen';
import WishlistScreen from '../screens/wishlist/WishlistScreen';
import CartScreen from '../screens/cart/CartScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Categories') {
            iconName = focused ? 'grid' : 'grid-outline';
          } else if (route.name === 'Wishlist') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Cart') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size || 22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Categories" component={CategoriesScreen} />
      <Tab.Screen
        name="Wishlist"
        component={WishlistScreen}
        options={{
          tabBarBadge: wishlistCount > 0 ? wishlistCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: colors.danger,
            color: colors.white,
            fontSize: 10,
            minWidth: 16,
            height: 16,
            borderRadius: 8,
            lineHeight: 16,
          },
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarBadge: cartCount > 0 ? (cartCount > 99 ? '99+' : cartCount) : undefined,
          tabBarBadgeStyle: {
            backgroundColor: colors.badge,
            color: colors.white,
            fontSize: 10,
            minWidth: 16,
            height: 16,
            borderRadius: 8,
            lineHeight: 16,
          },
        }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;

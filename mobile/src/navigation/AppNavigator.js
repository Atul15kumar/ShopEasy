import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';
import sizes from '../constants/sizes';
import { useAuth } from '../hooks/useAuth';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

const SplashScreen = () => (
  <View style={styles.splashContainer}>
    <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
    <View style={styles.splashLogoCircle}>
      <Ionicons name="bag-handle" size={50} color={colors.primary} />
    </View>
    <Text style={styles.splashTitle}>ShopEasy</Text>
    <Text style={styles.splashSubtitle}>Smart Shopping Everywhere</Text>
    <ActivityIndicator size="large" color={colors.white} style={styles.splashLoader} />
  </View>
);

const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <SplashScreen />;
  }

  return isAuthenticated ? <MainNavigator /> : <AuthNavigator />;
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: sizes.xl,
  },
  splashLogoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: sizes.base,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  splashTitle: {
    fontSize: sizes.fontXxl + 4,
    fontWeight: '900',
    color: colors.white,
    letterSpacing: -0.5,
  },
  splashSubtitle: {
    fontSize: sizes.fontBase,
    color: colors.primaryLight,
    marginTop: sizes.xs,
  },
  splashLoader: {
    marginTop: sizes.xxl,
  },
});

export default AppNavigator;

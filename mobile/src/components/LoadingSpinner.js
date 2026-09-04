import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import colors from '../constants/colors';
import sizes from '../constants/sizes';

const LoadingSpinner = ({ message = 'Loading...', size = 'large', fullScreen = false }) => {
  return (
    <View style={[styles.container, fullScreen && styles.fullScreen]}>
      <ActivityIndicator size={size} color={colors.primary} />
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: sizes.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  message: {
    marginTop: sizes.md,
    fontSize: sizes.fontSm,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});

export default LoadingSpinner;

import React, { useState } from 'react';
import { Image, View, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';

const fallbackImage = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80';

const ProductImage = ({ uri, style, resizeMode = 'cover' }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const imageSource = !hasError && uri ? { uri } : { uri: fallbackImage };

  return (
    <View style={[styles.container, style]}>
      <Image
        source={imageSource}
        style={[StyleSheet.absoluteFill, style]}
        resizeMode={resizeMode}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
      />
      {isLoading && (
        <View style={[StyleSheet.absoluteFill, styles.loaderContainer]}>
          <ActivityIndicator size="small" color={colors.primary} />
        </View>
      )}
      {hasError && !isLoading && (
        <View style={[StyleSheet.absoluteFill, styles.errorContainer]}>
          <Ionicons name="image-outline" size={24} color={colors.textMuted} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    backgroundColor: colors.surfaceMuted,
  },
  loaderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceMuted,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceMuted,
  },
});

export default ProductImage;

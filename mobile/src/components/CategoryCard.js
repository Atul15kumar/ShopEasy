import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import colors from '../constants/colors';
import sizes from '../constants/sizes';
import ProductImage from './ProductImage';

const CategoryCard = ({ category, onPress, layout = 'grid' }) => {
  if (layout === 'horizontal') {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onPress && onPress(category)}
        style={styles.horizontalContainer}
      >
        <View style={styles.horizontalImageWrapper}>
          <ProductImage uri={category.image} style={styles.horizontalImage} />
        </View>
        <Text style={styles.horizontalName} numberOfLines={1}>
          {category.name}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => onPress && onPress(category)}
      style={styles.gridContainer}
    >
      <View style={styles.gridImageWrapper}>
        <ProductImage uri={category.image} style={styles.gridImage} />
      </View>
      <View style={styles.gridInfo}>
        <Text style={styles.gridName} numberOfLines={1}>
          {category.name}
        </Text>
        {category.description ? (
          <Text style={styles.gridDesc} numberOfLines={2}>
            {category.description}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Horizontal circle variant
  horizontalContainer: {
    alignItems: 'center',
    marginRight: sizes.base,
    width: 72,
  },
  horizontalImageWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: colors.primaryLight,
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  horizontalImage: {
    width: '100%',
    height: '100%',
  },
  horizontalName: {
    marginTop: sizes.xs,
    fontSize: sizes.fontXs,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },

  // Grid full card variant
  gridContainer: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: sizes.radiusLg,
    borderWidth: 1,
    borderColor: colors.border,
    margin: sizes.xs,
    overflow: 'hidden',
  },
  gridImageWrapper: {
    width: '100%',
    height: 120,
    backgroundColor: colors.surfaceMuted,
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  gridInfo: {
    padding: sizes.md,
  },
  gridName: {
    fontSize: sizes.fontBase,
    fontWeight: '700',
    color: colors.text,
  },
  gridDesc: {
    fontSize: sizes.fontXs,
    color: colors.textSecondary,
    marginTop: sizes.xs,
    lineHeight: 16,
  },
});

export default CategoryCard;

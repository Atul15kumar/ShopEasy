import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';
import sizes from '../constants/sizes';
import { formatPrice } from '../utils/priceCalculator';
import ProductImage from './ProductImage';
import CustomButton from './CustomButton';

const WishlistItem = ({ item, onRemove, onMoveToCart, onPressProduct }) => {
  const product = item || {};
  const effectivePrice = product.discountPrice > 0 ? product.discountPrice : product.price;

  return (
    <View style={styles.card}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onPressProduct && onPressProduct(product)}
        style={styles.imageContainer}
      >
        <ProductImage
          uri={product.images && product.images.length > 0 ? product.images[0] : null}
          style={styles.image}
        />
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={styles.titleContainer}>
            {product.brand ? (
              <Text style={styles.brandText}>{product.brand}</Text>
            ) : null}
            <Text style={styles.nameText} numberOfLines={1}>
              {product.name}
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => onRemove && onRemove(product._id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.removeBtn}
          >
            <Ionicons name="trash-outline" size={18} color={colors.danger} />
          </TouchableOpacity>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.priceText}>{formatPrice(effectivePrice)}</Text>
          {product.discountPrice > 0 && (
            <Text style={styles.originalPriceText}>{formatPrice(product.price)}</Text>
          )}
        </View>

        <CustomButton
          title="Move to Cart"
          size="sm"
          variant="outline"
          icon={<Ionicons name="cart-outline" size={14} color={colors.primary} />}
          onPress={() => onMoveToCart && onMoveToCart(product._id)}
          style={styles.moveToCartBtn}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: sizes.radiusLg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: sizes.md,
    marginBottom: sizes.md,
  },
  imageContainer: {
    width: 90,
    height: 90,
    borderRadius: sizes.radiusMd,
    overflow: 'hidden',
    backgroundColor: colors.surfaceMuted,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    marginLeft: sizes.md,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  titleContainer: {
    flex: 1,
    paddingRight: sizes.sm,
  },
  brandText: {
    fontSize: sizes.fontXs,
    color: colors.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  nameText: {
    fontSize: sizes.fontBase,
    fontWeight: '700',
    color: colors.text,
    marginTop: 2,
  },
  removeBtn: {
    padding: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: sizes.xs,
  },
  priceText: {
    fontSize: sizes.fontBase,
    fontWeight: '800',
    color: colors.primary,
  },
  originalPriceText: {
    fontSize: sizes.fontXs,
    color: colors.textMuted,
    textDecorationLine: 'line-through',
    marginLeft: sizes.sm,
  },
  moveToCartBtn: {
    marginTop: sizes.xs,
    height: 34,
  },
});

export default WishlistItem;

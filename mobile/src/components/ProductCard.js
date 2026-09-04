import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';
import sizes from '../constants/sizes';
import { formatPrice, formatDiscountBadge } from '../utils/priceCalculator';
import ProductImage from './ProductImage';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/useCart';

const ProductCard = ({ product, onPress, style }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const isFavorited = isInWishlist(product._id);
  const discountBadge = formatDiscountBadge(product.price, product.discountPrice);
  const displayPrice = product.discountPrice > 0 ? product.discountPrice : product.price;

  const handleAddToCart = async (e) => {
    e?.stopPropagation();
    try {
      setIsAdding(true);
      await addItem(product._id, 1);
    } catch (err) {
      console.warn('Could not add to cart:', err.message);
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleWishlist = async (e) => {
    e?.stopPropagation();
    try {
      await toggleWishlist(product._id);
    } catch (err) {
      console.warn('Could not toggle wishlist:', err.message);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={() => onPress && onPress(product)}
      style={[styles.card, style]}
    >
      {/* Product Image Container */}
      <View style={styles.imageContainer}>
        <ProductImage
          uri={product.images && product.images.length > 0 ? product.images[0] : null}
          style={styles.image}
        />

        {/* Discount Badge */}
        {discountBadge && (
          <View style={styles.discountTag}>
            <Text style={styles.discountTagText}>{discountBadge}</Text>
          </View>
        )}

        {/* Wishlist Button */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleToggleWishlist}
          style={styles.wishlistBtn}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name={isFavorited ? 'heart' : 'heart-outline'}
            size={18}
            color={isFavorited ? colors.danger : colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {/* Info Container */}
      <View style={styles.infoContainer}>
        {product.brand ? (
          <Text style={styles.brandText} numberOfLines={1}>
            {product.brand}
          </Text>
        ) : null}

        <Text style={styles.titleText} numberOfLines={2}>
          {product.name}
        </Text>

        {/* Rating Row */}
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={13} color={colors.star} />
          <Text style={styles.ratingText}>{Number(product.rating || 4.5).toFixed(1)}</Text>
          {product.numReviews ? (
            <Text style={styles.reviewCountText}>({product.numReviews})</Text>
          ) : null}
        </View>

        {/* Price and Cart Row */}
        <View style={styles.bottomRow}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>{formatPrice(displayPrice)}</Text>
            {product.discountPrice > 0 && (
              <Text style={styles.originalPriceText}>{formatPrice(product.price)}</Text>
            )}
          </View>

          <TouchableOpacity
            activeOpacity={0.75}
            onPress={handleAddToCart}
            disabled={isAdding || product.stock === 0}
            style={[styles.cartBtn, product.stock === 0 && styles.disabledCartBtn]}
          >
            <Ionicons
              name={product.stock === 0 ? 'close' : 'cart-outline'}
              size={18}
              color={colors.white}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: sizes.cardWidth,
    backgroundColor: colors.surface,
    borderRadius: sizes.radiusLg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: sizes.base,
  },
  imageContainer: {
    width: '100%',
    height: 155,
    backgroundColor: colors.surfaceMuted,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  discountTag: {
    position: 'absolute',
    top: sizes.sm,
    left: sizes.sm,
    backgroundColor: colors.danger,
    paddingHorizontal: sizes.xs * 1.5,
    paddingVertical: 2,
    borderRadius: sizes.radiusSm,
  },
  discountTagText: {
    color: colors.white,
    fontSize: sizes.fontXs - 1,
    fontWeight: '800',
  },
  wishlistBtn: {
    position: 'absolute',
    top: sizes.sm,
    right: sizes.sm,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoContainer: {
    padding: sizes.md,
  },
  brandText: {
    fontSize: sizes.fontXs,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  titleText: {
    fontSize: sizes.fontSm,
    fontWeight: '700',
    color: colors.text,
    marginTop: 2,
    height: 36,
    lineHeight: 18,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: sizes.xs,
  },
  ratingText: {
    fontSize: sizes.fontXs,
    fontWeight: '700',
    color: colors.text,
    marginLeft: 3,
  },
  reviewCountText: {
    fontSize: sizes.fontXs,
    color: colors.textMuted,
    marginLeft: 3,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: sizes.sm,
  },
  priceContainer: {
    flex: 1,
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
    marginTop: -1,
  },
  cartBtn: {
    width: 34,
    height: 34,
    borderRadius: sizes.radiusMd,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledCartBtn: {
    backgroundColor: colors.textMuted,
  },
});

export default ProductCard;

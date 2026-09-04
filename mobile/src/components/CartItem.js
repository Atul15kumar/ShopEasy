import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';
import sizes from '../constants/sizes';
import { formatPrice } from '../utils/priceCalculator';
import ProductImage from './ProductImage';

const CartItem = ({ item, onUpdateQuantity, onRemove, onPressProduct }) => {
  const product = item.product || {};
  const effectivePrice = product.discountPrice > 0 ? product.discountPrice : product.price;

  return (
    <View style={styles.card}>
      {/* Product Image */}
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

      {/* Info & Quantity controls */}
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
            style={styles.deleteBtn}
          >
            <Ionicons name="trash-outline" size={18} color={colors.danger} />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.priceText}>{formatPrice(effectivePrice)}</Text>

          {/* Stepper */}
          <View style={styles.stepperContainer}>
            <TouchableOpacity
              onPress={() => onUpdateQuantity && onUpdateQuantity(product._id, item.quantity - 1)}
              style={styles.stepperBtn}
              activeOpacity={0.7}
            >
              <Ionicons
                name={item.quantity === 1 ? 'trash-outline' : 'remove'}
                size={16}
                color={item.quantity === 1 ? colors.danger : colors.text}
              />
            </TouchableOpacity>

            <Text style={styles.quantityText}>{item.quantity}</Text>

            <TouchableOpacity
              onPress={() => onUpdateQuantity && onUpdateQuantity(product._id, item.quantity + 1)}
              style={styles.stepperBtn}
              activeOpacity={0.7}
              disabled={product.stock !== undefined && item.quantity >= product.stock}
            >
              <Ionicons
                name="add"
                size={16}
                color={
                  product.stock !== undefined && item.quantity >= product.stock
                    ? colors.textMuted
                    : colors.text
                }
              />
            </TouchableOpacity>
          </View>
        </View>
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
    width: 80,
    height: 80,
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
  deleteBtn: {
    padding: 2,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: sizes.xs,
  },
  priceText: {
    fontSize: sizes.fontMd,
    fontWeight: '800',
    color: colors.primary,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderRadius: sizes.radiusMd,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepperBtn: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: sizes.fontSm,
    fontWeight: '700',
    color: colors.text,
    minWidth: 24,
    textAlign: 'center',
  },
});

export default CartItem;

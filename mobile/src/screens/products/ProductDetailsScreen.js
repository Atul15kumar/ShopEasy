import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import sizes from '../../constants/sizes';
import screenStyles from '../../styles/screenStyles';
import ProductImage from '../../components/ProductImage';
import CustomButton from '../../components/CustomButton';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatPrice, formatDiscountBadge } from '../../utils/priceCalculator';
import { fetchProductById } from '../../services/productService';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';

const ProductDetailsScreen = ({ route, navigation }) => {
  const { productId } = route.params;

  const { addItem, cartCount } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const loadDetail = async () => {
      try {
        const res = await fetchProductById(productId);
        if (res?.data?.product) {
          setProduct(res.data.product);
        }
      } catch (error) {
        Alert.alert('Error', error.message || 'Could not load product details.');
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [productId]);

  if (loading || !product) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <LoadingSpinner message="Loading product details..." fullScreen />
      </SafeAreaView>
    );
  }

  const isFavorited = isInWishlist(product._id);
  const discountBadge = formatDiscountBadge(product.price, product.discountPrice);
  const effectivePrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = async () => {
    try {
      setIsAdding(true);
      await addItem(product._id, quantity);
      Alert.alert('Success', 'Product added to your cart!', [
        { text: 'Continue Shopping', style: 'cancel' },
        { text: 'View Cart', onPress: () => navigation.navigate('Cart') },
      ]);
    } catch (error) {
      Alert.alert('Cart Notice', error.message || 'Could not add to cart.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    try {
      setIsAdding(true);
      await addItem(product._id, quantity);
      navigation.navigate('Checkout');
    } catch (error) {
      Alert.alert('Cart Notice', error.message || 'Could not add to cart.');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }}>
      {/* Top Header Bar */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.circleBtn}
        >
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.headerRightActions}>
          <TouchableOpacity
            onPress={() => toggleWishlist(product._id)}
            style={styles.circleBtn}
          >
            <Ionicons
              name={isFavorited ? 'heart' : 'heart-outline'}
              size={22}
              color={isFavorited ? colors.danger : colors.text}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Cart')}
            style={styles.circleBtn}
          >
            <Ionicons name="cart-outline" size={22} color={colors.text} />
            {cartCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Product Image Carousel View */}
        <View style={screenStyles.detailsImageContainer}>
          <ProductImage
            uri={product.images[selectedImageIndex] || product.images[0]}
            style={styles.mainImage}
            resizeMode="contain"
          />
          {discountBadge && (
            <View style={styles.discountTag}>
              <Text style={styles.discountTagText}>{discountBadge}</Text>
            </View>
          )}
        </View>

        {/* Thumbnail Selector */}
        {product.images && product.images.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.thumbnailRow}
          >
            {product.images.map((img, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => setSelectedImageIndex(idx)}
                style={[
                  styles.thumbnailWrapper,
                  selectedImageIndex === idx && styles.activeThumbnail,
                ]}
              >
                <ProductImage uri={img} style={styles.thumbnailImage} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* Product Details Card */}
        <View style={screenStyles.detailsContent}>
          {/* Brand & Stock Status */}
          <View style={styles.topMetaRow}>
            {product.brand ? (
              <Text style={styles.brandText}>{product.brand}</Text>
            ) : <View />}

            <View
              style={[
                styles.stockBadge,
                isOutOfStock ? styles.outOfStockBadge : styles.inStockBadge,
              ]}
            >
              <Text
                style={[
                  styles.stockBadgeText,
                  isOutOfStock ? styles.outOfStockText : styles.inStockText,
                ]}
              >
                {isOutOfStock ? 'Out of Stock' : `In Stock (${product.stock})`}
              </Text>
            </View>
          </View>

          {/* Title */}
          <Text style={styles.productTitle}>{product.name}</Text>

          {/* Rating */}
          <View style={styles.ratingSection}>
            <View style={styles.starsWrapper}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name={star <= Math.round(product.rating || 5) ? 'star' : 'star-outline'}
                  size={16}
                  color={colors.star}
                />
              ))}
            </View>
            <Text style={styles.ratingNumber}>{Number(product.rating || 4.5).toFixed(1)}</Text>
            <Text style={styles.reviewCount}>({product.numReviews || 0} reviews)</Text>
          </View>

          {/* Price */}
          <View style={styles.priceRow}>
            <Text style={styles.currentPrice}>{formatPrice(effectivePrice)}</Text>
            {product.discountPrice > 0 && (
              <Text style={styles.originalPrice}>{formatPrice(product.price)}</Text>
            )}
          </View>

          {/* Quantity Selector */}
          {!isOutOfStock && (
            <View style={styles.quantityRow}>
              <Text style={styles.quantityLabel}>Quantity</Text>
              <View style={styles.stepperWrapper}>
                <TouchableOpacity
                  onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={styles.stepperBtn}
                >
                  <Ionicons name="remove" size={18} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.quantityNumber}>{quantity}</Text>
                <TouchableOpacity
                  onPress={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  style={styles.stepperBtn}
                  disabled={quantity >= product.stock}
                >
                  <Ionicons
                    name="add"
                    size={18}
                    color={quantity >= product.stock ? colors.textMuted : colors.text}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Description */}
          <View style={styles.descSection}>
            <Text style={styles.sectionHeading}>Description</Text>
            <Text style={styles.descriptionText}>{product.description}</Text>
          </View>

          {/* Specifications */}
          {product.specifications && product.specifications.length > 0 && (
            <View style={styles.specsSection}>
              <Text style={styles.sectionHeading}>Specifications</Text>
              {product.specifications.map((spec, i) => (
                <View key={i} style={styles.specRow}>
                  <Text style={styles.specKey}>{spec.key}</Text>
                  <Text style={styles.specValue}>{spec.value}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Fixed Bottom Action Bar */}
      <View style={screenStyles.bottomBar}>
        <CustomButton
          title="Add to Cart"
          variant="outline"
          onPress={handleAddToCart}
          loading={isAdding}
          disabled={isOutOfStock}
          icon={<Ionicons name="cart-outline" size={18} color={colors.primary} />}
          style={{ flex: 1, marginRight: sizes.sm }}
        />
        <CustomButton
          title="Buy Now"
          variant="primary"
          onPress={handleBuyNow}
          loading={isAdding}
          disabled={isOutOfStock}
          style={{ flex: 1 }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: sizes.base,
    paddingVertical: sizes.sm,
    backgroundColor: colors.surface,
  },
  circleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sizes.sm,
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: colors.badge,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: '800',
  },
  mainImage: {
    width: sizes.screenWidth - 40,
    height: 280,
  },
  discountTag: {
    position: 'absolute',
    top: sizes.base,
    left: sizes.base,
    backgroundColor: colors.danger,
    paddingHorizontal: sizes.sm,
    paddingVertical: 4,
    borderRadius: sizes.radiusSm,
  },
  discountTagText: {
    color: colors.white,
    fontSize: sizes.fontXs,
    fontWeight: '800',
  },
  thumbnailRow: {
    paddingHorizontal: sizes.base,
    paddingBottom: sizes.base,
    backgroundColor: colors.surface,
    gap: sizes.sm,
  },
  thumbnailWrapper: {
    width: 60,
    height: 60,
    borderRadius: sizes.radiusMd,
    borderWidth: 2,
    borderColor: colors.border,
    overflow: 'hidden',
    backgroundColor: colors.surfaceMuted,
  },
  activeThumbnail: {
    borderColor: colors.primary,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  topMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandText: {
    fontSize: sizes.fontSm,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  stockBadge: {
    paddingHorizontal: sizes.sm,
    paddingVertical: 3,
    borderRadius: sizes.radiusSm,
  },
  inStockBadge: {
    backgroundColor: colors.successLight,
  },
  outOfStockBadge: {
    backgroundColor: colors.dangerLight,
  },
  stockBadgeText: {
    fontSize: sizes.fontXs,
    fontWeight: '700',
  },
  inStockText: {
    color: colors.success,
  },
  outOfStockText: {
    color: colors.danger,
  },
  productTitle: {
    fontSize: sizes.fontXl,
    fontWeight: '800',
    color: colors.text,
    marginTop: sizes.sm,
    lineHeight: 28,
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: sizes.sm,
  },
  starsWrapper: {
    flexDirection: 'row',
    gap: 2,
  },
  ratingNumber: {
    fontSize: sizes.fontSm,
    fontWeight: '700',
    color: colors.text,
    marginLeft: sizes.xs,
  },
  reviewCount: {
    fontSize: sizes.fontSm,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: sizes.md,
  },
  currentPrice: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary,
  },
  originalPrice: {
    fontSize: sizes.fontMd,
    color: colors.textMuted,
    textDecorationLine: 'line-through',
    marginLeft: sizes.md,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: sizes.lg,
    paddingVertical: sizes.sm,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.borderLight,
  },
  quantityLabel: {
    fontSize: sizes.fontBase,
    fontWeight: '600',
    color: colors.text,
  },
  stepperWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderRadius: sizes.radiusMd,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepperBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityNumber: {
    fontSize: sizes.fontBase,
    fontWeight: '700',
    color: colors.text,
    minWidth: 36,
    textAlign: 'center',
  },
  descSection: {
    marginTop: sizes.lg,
  },
  sectionHeading: {
    fontSize: sizes.fontMd,
    fontWeight: '700',
    color: colors.text,
    marginBottom: sizes.xs,
  },
  descriptionText: {
    fontSize: sizes.fontBase,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  specsSection: {
    marginTop: sizes.lg,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: sizes.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  specKey: {
    fontSize: sizes.fontSm,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  specValue: {
    fontSize: sizes.fontSm,
    color: colors.text,
    fontWeight: '700',
  },
});

export default ProductDetailsScreen;

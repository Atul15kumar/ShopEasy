import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import sizes from '../../constants/sizes';
import CartItem from '../../components/CartItem';
import CustomButton from '../../components/CustomButton';
import EmptyState from '../../components/EmptyState';
import { formatPrice } from '../../utils/priceCalculator';
import { useCart } from '../../hooks/useCart';

const CartScreen = ({ navigation }) => {
  const {
    cartItems,
    subtotal,
    discount,
    deliveryCharge,
    totalAmount,
    updateQuantity,
    removeItem,
    emptyCart,
    isLoading,
  } = useCart();

  const handleClearCart = () => {
    Alert.alert('Clear Cart', 'Are you sure you want to remove all items from your cart?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: emptyCart },
    ]);
  };

  const handleUpdateQuantity = async (productId, newQty) => {
    try {
      await updateQuantity(productId, newQty);
    } catch (error) {
      Alert.alert('Notice', error.message || 'Could not update item quantity.');
    }
  };

  const handleRemove = async (productId) => {
    try {
      await removeItem(productId);
    } catch (error) {
      Alert.alert('Notice', error.message || 'Could not remove item.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
        {cartItems.length > 0 && (
          <TouchableOpacity onPress={handleClearCart}>
            <Text style={styles.clearBtnText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {cartItems.length === 0 ? (
        <EmptyState
          icon="cart-outline"
          title="Your Cart is Empty"
          description="Looks like you haven't added any products to your cart yet."
          buttonTitle="Start Shopping"
          onButtonPress={() => navigation.navigate('Home')}
          style={{ flex: 1 }}
        />
      ) : (
        <View style={{ flex: 1 }}>
          {/* Cart Item List */}
          <FlatList
            data={cartItems}
            keyExtractor={(item) => (item.product?._id || item._id)}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <CartItem
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemove}
                onPressProduct={(prod) =>
                  navigation.navigate('ProductDetails', { productId: prod._id })
                }
              />
            )}
            ListFooterComponent={
              /* Order Cost Breakdown */
              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>Order Summary</Text>

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Subtotal</Text>
                  <Text style={styles.summaryValue}>{formatPrice(subtotal)}</Text>
                </View>

                {discount > 0 && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Discount</Text>
                    <Text style={[styles.summaryValue, styles.discountText]}>
                      -{formatPrice(discount)}
                    </Text>
                  </View>
                )}

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Delivery</Text>
                  <Text style={styles.summaryValue}>
                    {deliveryCharge === 0 ? (
                      <Text style={{ color: colors.success, fontWeight: '700' }}>FREE</Text>
                    ) : (
                      formatPrice(deliveryCharge)
                    )}
                  </Text>
                </View>

                {deliveryCharge > 0 && (
                  <Text style={styles.freeDeliveryHint}>
                    Add items worth {formatPrice(50 - (subtotal - discount))} more for FREE delivery!
                  </Text>
                )}

                <View style={styles.divider} />

                <View style={styles.summaryRow}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>{formatPrice(totalAmount)}</Text>
                </View>
              </View>
            }
          />

          {/* Bottom Checkout Bar */}
          <View style={styles.bottomBar}>
            <View style={styles.bottomBarInfo}>
              <Text style={styles.bottomBarLabel}>Total Amount</Text>
              <Text style={styles.bottomBarPrice}>{formatPrice(totalAmount)}</Text>
            </View>
            <CustomButton
              title="Proceed to Checkout"
              onPress={() => navigation.navigate('Checkout')}
              style={styles.checkoutBtn}
              icon={<Ionicons name="shield-checkmark-outline" size={18} color={colors.white} />}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: sizes.base,
    paddingVertical: sizes.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: sizes.fontXl,
    fontWeight: '800',
    color: colors.text,
  },
  clearBtnText: {
    fontSize: sizes.fontSm,
    fontWeight: '700',
    color: colors.danger,
  },
  listContent: {
    padding: sizes.base,
    paddingBottom: 100,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: sizes.radiusLg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: sizes.base,
    marginTop: sizes.sm,
  },
  summaryTitle: {
    fontSize: sizes.fontMd,
    fontWeight: '700',
    color: colors.text,
    marginBottom: sizes.md,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: sizes.sm,
  },
  summaryLabel: {
    fontSize: sizes.fontBase,
    color: colors.textSecondary,
  },
  summaryValue: {
    fontSize: sizes.fontBase,
    fontWeight: '600',
    color: colors.text,
  },
  discountText: {
    color: colors.success,
  },
  freeDeliveryHint: {
    fontSize: sizes.fontXs,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: sizes.sm,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: sizes.sm,
  },
  totalLabel: {
    fontSize: sizes.fontLg,
    fontWeight: '800',
    color: colors.text,
  },
  totalValue: {
    fontSize: sizes.fontXl,
    fontWeight: '800',
    color: colors.primary,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    paddingHorizontal: sizes.base,
    paddingVertical: sizes.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  bottomBarInfo: {
    flex: 1,
    marginRight: sizes.base,
  },
  bottomBarLabel: {
    fontSize: sizes.fontXs,
    color: colors.textSecondary,
  },
  bottomBarPrice: {
    fontSize: sizes.fontXl,
    fontWeight: '800',
    color: colors.primary,
  },
  checkoutBtn: {
    minWidth: 180,
  },
});

export default CartScreen;

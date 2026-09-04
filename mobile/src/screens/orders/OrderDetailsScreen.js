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
import ProductImage from '../../components/ProductImage';
import CustomButton from '../../components/CustomButton';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatPrice } from '../../utils/priceCalculator';
import { fetchOrderById, cancelOrder } from '../../services/orderService';

const ORDER_STEPS = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'];

const OrderDetailsScreen = ({ route, navigation }) => {
  const { orderId } = route.params;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const loadOrderDetail = async () => {
    try {
      const res = await fetchOrderById(orderId);
      if (res?.data?.order) {
        setOrder(res.data.order);
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Could not load order details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrderDetail();
  }, [orderId]);

  const handleCancelOrder = () => {
    Alert.alert(
      'Cancel Order',
      'Are you sure you want to cancel this order? This action cannot be undone.',
      [
        { text: 'No, Keep Order', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              setCancelling(true);
              const res = await cancelOrder(orderId);
              if (res?.data?.order) {
                setOrder(res.data.order);
                Alert.alert('Order Cancelled', 'Your order has been cancelled successfully.');
              }
            } catch (err) {
              Alert.alert('Error', err.message || 'Could not cancel order.');
            } finally {
              setCancelling(false);
            }
          },
        },
      ]
    );
  };

  if (loading || !order) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <LoadingSpinner message="Loading order details..." fullScreen />
      </SafeAreaView>
    );
  }

  const currentStepIndex = ORDER_STEPS.indexOf(order.orderStatus);
  const isCancelled = order.orderStatus === 'Cancelled';
  const canCancel = ['Pending', 'Confirmed'].includes(order.orderStatus);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order #{order._id.slice(-8).toUpperCase()}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Status Tracker */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Tracking Status</Text>

          {isCancelled ? (
            <View style={styles.cancelledBanner}>
              <Ionicons name="close-circle" size={24} color={colors.danger} />
              <Text style={styles.cancelledText}>This order has been cancelled</Text>
            </View>
          ) : (
            <View style={styles.trackerContainer}>
              {ORDER_STEPS.map((step, idx) => {
                const isPassed = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <View key={step} style={styles.trackerStepRow}>
                    <View style={styles.stepIndicatorColumn}>
                      <View
                        style={[
                          styles.trackerDot,
                          isPassed && styles.activeDot,
                          isCurrent && styles.currentDot,
                        ]}
                      >
                        {isPassed && <Ionicons name="checkmark" size={10} color={colors.white} />}
                      </View>
                      {idx < ORDER_STEPS.length - 1 && (
                        <View
                          style={[
                            styles.trackerLine,
                            idx < currentStepIndex && styles.activeLine,
                          ]}
                        />
                      )}
                    </View>
                    <View style={styles.stepInfoColumn}>
                      <Text
                        style={[
                          styles.stepTitle,
                          isPassed && styles.activeStepTitle,
                          isCurrent && { color: colors.primary, fontWeight: '800' },
                        ]}
                      >
                        {step}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* Ordered Items */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Ordered Items ({order.products.length})</Text>

          {order.products.map((item, idx) => (
            <View key={idx} style={styles.itemRow}>
              <View style={styles.itemImageWrapper}>
                <ProductImage uri={item.image} style={styles.itemImage} />
              </View>
              <View style={styles.itemContent}>
                <Text style={styles.itemName} numberOfLines={2}>
                  {item.name}
                </Text>
                <View style={styles.itemBottom}>
                  <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
                  <Text style={styles.itemPrice}>{formatPrice(item.price * item.quantity)}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Shipping Address */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Delivery Address</Text>
          <View style={styles.addressBox}>
            <Ionicons name="location-outline" size={20} color={colors.primary} style={{ marginRight: 8, marginTop: 2 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.addrName}>{order.shippingAddress?.fullName}</Text>
              <Text style={styles.addrLine}>
                {order.shippingAddress?.houseFlat}, {order.shippingAddress?.street}
              </Text>
              <Text style={styles.addrLine}>
                {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pinCode}
              </Text>
              <Text style={styles.addrPhone}>Contact: {order.shippingAddress?.phone}</Text>
            </View>
          </View>
        </View>

        {/* Payment Summary */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Payment Details</Text>
          <View style={styles.paymentMethodRow}>
            <Ionicons name="card-outline" size={18} color={colors.textSecondary} />
            <Text style={styles.paymentMethodText}>{order.paymentMethod}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{formatPrice(order.subtotal)}</Text>
          </View>

          {order.discount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Discount</Text>
              <Text style={[styles.summaryValue, { color: colors.success }]}>
                -{formatPrice(order.discount)}
              </Text>
            </View>
          )}

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Charge</Text>
            <Text style={styles.summaryValue}>
              {order.deliveryCharge === 0 ? 'FREE' : formatPrice(order.deliveryCharge)}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total Paid / Due</Text>
            <Text style={styles.totalValue}>{formatPrice(order.totalAmount)}</Text>
          </View>
        </View>

        {/* Cancel Order Option */}
        {canCancel && (
          <CustomButton
            title="Cancel Order"
            variant="danger"
            size="md"
            loading={cancelling}
            onPress={handleCancelOrder}
            icon={<Ionicons name="close-circle-outline" size={18} color={colors.white} />}
            style={styles.cancelBtn}
          />
        )}
      </ScrollView>
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
  backBtn: {
    padding: sizes.xs,
  },
  headerTitle: {
    fontSize: sizes.fontLg,
    fontWeight: '700',
    color: colors.text,
  },
  content: {
    padding: sizes.base,
    paddingBottom: sizes.xxl,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: sizes.radiusLg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: sizes.base,
    marginBottom: sizes.base,
  },
  cardTitle: {
    fontSize: sizes.fontBase,
    fontWeight: '700',
    color: colors.text,
    marginBottom: sizes.md,
  },
  cancelledBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.dangerLight,
    padding: sizes.md,
    borderRadius: sizes.radiusMd,
    gap: sizes.sm,
  },
  cancelledText: {
    fontSize: sizes.fontBase,
    fontWeight: '700',
    color: colors.danger,
  },
  trackerContainer: {
    paddingVertical: sizes.xs,
  },
  trackerStepRow: {
    flexDirection: 'row',
    minHeight: 40,
  },
  stepIndicatorColumn: {
    alignItems: 'center',
    width: 24,
  },
  trackerDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDot: {
    backgroundColor: colors.primary,
  },
  currentDot: {
    borderWidth: 3,
    borderColor: colors.primaryLight,
  },
  trackerLine: {
    flex: 1,
    width: 2,
    backgroundColor: colors.border,
    marginVertical: 2,
  },
  activeLine: {
    backgroundColor: colors.primary,
  },
  stepInfoColumn: {
    flex: 1,
    marginLeft: sizes.md,
    justifyContent: 'flex-start',
    paddingTop: 1,
  },
  stepTitle: {
    fontSize: sizes.fontSm,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  activeStepTitle: {
    color: colors.text,
    fontWeight: '700',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: sizes.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  itemImageWrapper: {
    width: 60,
    height: 60,
    borderRadius: sizes.radiusSm,
    overflow: 'hidden',
    backgroundColor: colors.surfaceMuted,
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemContent: {
    flex: 1,
    marginLeft: sizes.md,
  },
  itemName: {
    fontSize: sizes.fontSm,
    fontWeight: '700',
    color: colors.text,
  },
  itemBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  itemQty: {
    fontSize: sizes.fontXs,
    color: colors.textSecondary,
  },
  itemPrice: {
    fontSize: sizes.fontSm,
    fontWeight: '700',
    color: colors.primary,
  },
  addressBox: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceMuted,
    borderRadius: sizes.radiusMd,
    padding: sizes.md,
  },
  addrName: {
    fontSize: sizes.fontBase,
    fontWeight: '700',
    color: colors.text,
  },
  addrLine: {
    fontSize: sizes.fontSm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  addrPhone: {
    fontSize: sizes.fontXs,
    color: colors.textMuted,
    marginTop: 4,
  },
  paymentMethodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sizes.sm,
    marginBottom: sizes.sm,
  },
  paymentMethodText: {
    fontSize: sizes.fontBase,
    fontWeight: '600',
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: sizes.sm,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: sizes.xs,
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
  totalLabel: {
    fontSize: sizes.fontLg,
    fontWeight: '800',
    color: colors.text,
  },
  totalValue: {
    fontSize: sizes.fontLg,
    fontWeight: '800',
    color: colors.primary,
  },
  cancelBtn: {
    marginTop: sizes.sm,
  },
});

export default OrderDetailsScreen;

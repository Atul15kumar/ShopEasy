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
import CustomButton from '../../components/CustomButton';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatPrice } from '../../utils/priceCalculator';
import { useCart } from '../../hooks/useCart';
import { useAuth } from '../../hooks/useAuth';
import { fetchAddresses } from '../../services/authService';
import { createOrder } from '../../services/orderService';

const CheckoutScreen = ({ navigation }) => {
  const { cartItems, subtotal, discount, deliveryCharge, totalAmount, emptyCart } = useCart();
  const { user } = useAuth();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadSavedAddresses = async () => {
      try {
        const res = await fetchAddresses();
        const addrs = res?.data?.addresses || [];
        setAddresses(addrs);

        // Auto select default address
        const defIdx = addrs.findIndex((a) => a.isDefault);
        if (defIdx !== -1) {
          setSelectedAddressIndex(defIdx);
        }
      } catch (error) {
        console.warn('Could not load addresses:', error.message);
      } finally {
        setLoading(false);
      }
    };

    loadSavedAddresses();
  }, []);

  const handlePlaceOrder = async () => {
    if (addresses.length === 0 || !addresses[selectedAddressIndex]) {
      Alert.alert('Address Required', 'Please add or select a shipping address to proceed.', [
        { text: 'Add Address', onPress: () => navigation.navigate('AddressScreen') },
        { text: 'Cancel', style: 'cancel' },
      ]);
      return;
    }

    try {
      setSubmitting(true);
      const selectedAddr = addresses[selectedAddressIndex];

      const res = await createOrder({
        shippingAddress: selectedAddr,
        paymentMethod,
      });

      if (res?.success && res?.data?.order) {
        // Refresh local cart state
        emptyCart();
        navigation.reset({
          index: 0,
          routes: [
            { name: 'TabRoot' },
            {
              name: 'OrderSuccess',
              params: { order: res.data.order },
            },
          ],
        });
      }
    } catch (error) {
      Alert.alert('Checkout Failed', error.message || 'Could not place your order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

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
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <LoadingSpinner message="Preparing checkout..." fullScreen />
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Step 1: Shipping Address */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepNumber}>1</Text>
              </View>
              <Text style={styles.cardTitle}>Shipping Address</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('AddressScreen')}
                style={styles.manageBtn}
              >
                <Text style={styles.manageBtnText}>+ Manage</Text>
              </TouchableOpacity>
            </View>

            {addresses.length === 0 ? (
              <TouchableOpacity
                style={styles.emptyAddressBox}
                onPress={() => navigation.navigate('AddressScreen')}
              >
                <Ionicons name="add-circle-outline" size={24} color={colors.primary} />
                <Text style={styles.emptyAddressText}>Add a new shipping address</Text>
              </TouchableOpacity>
            ) : (
              addresses.map((addr, idx) => (
                <TouchableOpacity
                  key={addr._id || idx}
                  onPress={() => setSelectedAddressIndex(idx)}
                  style={[
                    styles.addressOption,
                    selectedAddressIndex === idx && styles.selectedAddressOption,
                  ]}
                >
                  <View style={styles.radioCircle}>
                    {selectedAddressIndex === idx && <View style={styles.radioDot} />}
                  </View>
                  <View style={styles.addressInfo}>
                    <Text style={styles.addressName}>{addr.fullName}</Text>
                    <Text style={styles.addressLine}>
                      {addr.houseFlat}, {addr.street}
                    </Text>
                    <Text style={styles.addressLine}>
                      {addr.city}, {addr.state} {addr.pinCode}
                    </Text>
                    <Text style={styles.addressPhone}>Phone: {addr.phone}</Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>

          {/* Step 2: Payment Method */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepNumber}>2</Text>
              </View>
              <Text style={styles.cardTitle}>Payment Method</Text>
            </View>

            {/* COD Option */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setPaymentMethod('Cash on Delivery')}
              style={[
                styles.paymentOption,
                paymentMethod === 'Cash on Delivery' && styles.selectedPaymentOption,
              ]}
            >
              <View style={styles.radioCircle}>
                {paymentMethod === 'Cash on Delivery' && <View style={styles.radioDot} />}
              </View>
              <View style={styles.paymentInfo}>
                <View style={styles.paymentTitleRow}>
                  <Ionicons name="cash-outline" size={20} color={colors.primary} />
                  <Text style={styles.paymentTitle}>Cash on Delivery (COD)</Text>
                </View>
                <Text style={styles.paymentDesc}>
                  Pay with physical cash or card directly to delivery executive.
                </Text>
              </View>
            </TouchableOpacity>

            {/* Extensible placeholder for Online Card */}
            <View style={[styles.paymentOption, styles.disabledPaymentOption]}>
              <View style={styles.disabledRadio} />
              <View style={styles.paymentInfo}>
                <View style={styles.paymentTitleRow}>
                  <Ionicons name="card-outline" size={20} color={colors.textMuted} />
                  <Text style={[styles.paymentTitle, { color: colors.textMuted }]}>
                    Credit / Debit Card (Coming Soon)
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Step 3: Order Items & Breakdown */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepNumber}>3</Text>
              </View>
              <Text style={styles.cardTitle}>Order Summary ({cartItems.length} items)</Text>
            </View>

            <View style={styles.summaryBreakdown}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>{formatPrice(subtotal)}</Text>
              </View>

              {discount > 0 && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Savings</Text>
                  <Text style={[styles.summaryValue, { color: colors.success }]}>
                    -{formatPrice(discount)}
                  </Text>
                </View>
              )}

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery</Text>
                <Text style={styles.summaryValue}>
                  {deliveryCharge === 0 ? 'FREE' : formatPrice(deliveryCharge)}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Grand Total</Text>
                <Text style={styles.totalValue}>{formatPrice(totalAmount)}</Text>
              </View>
            </View>
          </View>

          {/* Place Order Button */}
          <CustomButton
            title="Place Order"
            size="lg"
            variant="primary"
            loading={submitting}
            onPress={handlePlaceOrder}
            icon={<Ionicons name="checkmark-done" size={20} color={colors.white} />}
            style={styles.placeOrderBtn}
          />
        </ScrollView>
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
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: sizes.md,
  },
  stepBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: sizes.sm,
  },
  stepNumber: {
    color: colors.white,
    fontSize: sizes.fontXs,
    fontWeight: '800',
  },
  cardTitle: {
    flex: 1,
    fontSize: sizes.fontBase,
    fontWeight: '700',
    color: colors.text,
  },
  manageBtn: {
    paddingHorizontal: sizes.sm,
    paddingVertical: 4,
  },
  manageBtnText: {
    fontSize: sizes.fontSm,
    fontWeight: '700',
    color: colors.primary,
  },
  emptyAddressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.primary,
    borderRadius: sizes.radiusMd,
    padding: sizes.lg,
    gap: sizes.sm,
  },
  emptyAddressText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: sizes.fontBase,
  },
  addressOption: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: sizes.md,
    borderRadius: sizes.radiusMd,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: sizes.sm,
    backgroundColor: colors.surfaceMuted,
  },
  selectedAddressOption: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: sizes.md,
    marginTop: 2,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  addressInfo: {
    flex: 1,
  },
  addressName: {
    fontSize: sizes.fontBase,
    fontWeight: '700',
    color: colors.text,
  },
  addressLine: {
    fontSize: sizes.fontSm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  addressPhone: {
    fontSize: sizes.fontXs,
    color: colors.textMuted,
    marginTop: 4,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: sizes.md,
    borderRadius: sizes.radiusMd,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: sizes.sm,
    backgroundColor: colors.surfaceMuted,
  },
  selectedPaymentOption: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sizes.xs,
  },
  paymentTitle: {
    fontSize: sizes.fontBase,
    fontWeight: '700',
    color: colors.text,
  },
  paymentDesc: {
    fontSize: sizes.fontXs,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 16,
  },
  disabledPaymentOption: {
    opacity: 0.6,
  },
  disabledRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.textMuted,
    marginRight: sizes.md,
  },
  summaryBreakdown: {
    marginTop: sizes.xs,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  placeOrderBtn: {
    marginTop: sizes.md,
  },
});

export default CheckoutScreen;

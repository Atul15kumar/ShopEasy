import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import sizes from '../../constants/sizes';
import CustomButton from '../../components/CustomButton';
import { formatPrice } from '../../utils/priceCalculator';

const OrderSuccessScreen = ({ route, navigation }) => {
  const { order } = route.params || {};

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.container}>
        {/* Animated-feel checkmark icon */}
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark" size={56} color={colors.white} />
        </View>

        <Text style={styles.title}>Order Placed Successfully!</Text>
        <Text style={styles.subtitle}>
          Thank you for your purchase. We are processing your package right away.
        </Text>

        {order && (
          <View style={styles.receiptCard}>
            <View style={styles.row}>
              <Text style={styles.label}>Order ID</Text>
              <Text style={styles.value}>#{order._id?.slice(-8).toUpperCase()}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Payment Method</Text>
              <Text style={styles.value}>{order.paymentMethod}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Total Amount</Text>
              <Text style={[styles.value, { color: colors.primary, fontSize: sizes.fontLg }]}>
                {formatPrice(order.totalAmount)}
              </Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Status</Text>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{order.orderStatus}</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.actions}>
          {order && (
            <CustomButton
              title="Track Order"
              variant="outline"
              size="lg"
              onPress={() => navigation.navigate('OrderDetails', { orderId: order._id })}
              style={{ marginBottom: sizes.md }}
            />
          )}

          <CustomButton
            title="Continue Shopping"
            variant="primary"
            size="lg"
            onPress={() => navigation.navigate('TabRoot')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: sizes.xl,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: sizes.xl,
    shadowColor: colors.success,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  title: {
    fontSize: sizes.fontXxl,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: sizes.fontBase,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: sizes.sm,
    lineHeight: 22,
    maxWidth: 300,
  },
  receiptCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: sizes.radiusLg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: sizes.lg,
    marginVertical: sizes.xl,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: sizes.xs,
  },
  label: {
    fontSize: sizes.fontSm,
    color: colors.textSecondary,
  },
  value: {
    fontSize: sizes.fontSm,
    fontWeight: '700',
    color: colors.text,
  },
  statusBadge: {
    backgroundColor: colors.warningLight,
    paddingHorizontal: sizes.sm,
    paddingVertical: 2,
    borderRadius: sizes.radiusSm,
  },
  statusText: {
    fontSize: sizes.fontXs,
    fontWeight: '700',
    color: colors.warning,
  },
  actions: {
    width: '100%',
  },
});

export default OrderSuccessScreen;

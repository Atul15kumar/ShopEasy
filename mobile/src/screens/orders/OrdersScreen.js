import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import sizes from '../../constants/sizes';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import ProductImage from '../../components/ProductImage';
import { formatPrice } from '../../utils/priceCalculator';
import { fetchMyOrders } from '../../services/orderService';

const getStatusColor = (status) => {
  switch (status) {
    case 'Delivered':
      return { bg: colors.successLight, text: colors.success };
    case 'Shipped':
    case 'Processing':
      return { bg: colors.primaryLight, text: colors.primary };
    case 'Confirmed':
      return { bg: colors.accentLight, text: colors.accent };
    case 'Cancelled':
      return { bg: colors.dangerLight, text: colors.danger };
    default:
      return { bg: colors.warningLight, text: colors.warning };
  }
};

const OrdersScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadOrders = async () => {
    try {
      const res = await fetchMyOrders();
      if (res?.data?.orders) {
        setOrders(res.data.orders);
      }
    } catch (error) {
      console.warn('Could not load orders:', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadOrders();
  }, []);

  const renderOrderItem = ({ item }) => {
    const statusStyle = getStatusColor(item.orderStatus);
    const dateFormatted = new Date(item.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    return (
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={() => navigation.navigate('OrderDetails', { orderId: item._id })}
        style={styles.orderCard}
      >
        {/* Top order meta */}
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.orderIdText}>Order #{item._id.slice(-8).toUpperCase()}</Text>
            <Text style={styles.orderDateText}>{dateFormatted}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.statusBadgeText, { color: statusStyle.text }]}>
              {item.orderStatus}
            </Text>
          </View>
        </View>

        {/* Thumbnail gallery preview */}
        <View style={styles.itemsPreviewRow}>
          {item.products.slice(0, 3).map((prod, idx) => (
            <View key={idx} style={styles.previewThumb}>
              <ProductImage uri={prod.image} style={styles.thumbImage} />
            </View>
          ))}
          {item.products.length > 3 && (
            <View style={styles.moreThumbs}>
              <Text style={styles.moreThumbsText}>+{item.products.length - 3}</Text>
            </View>
          )}

          <View style={styles.itemMeta}>
            <Text style={styles.itemCountText}>
              {item.products.reduce((acc, p) => acc + p.quantity, 0)} Items
            </Text>
            <Text style={styles.orderTotalText}>{formatPrice(item.totalAmount)}</Text>
          </View>
        </View>

        {/* View Details Link */}
        <View style={styles.cardFooter}>
          <Text style={styles.viewDetailsText}>View Order Details</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.primary} />
        </View>
      </TouchableOpacity>
    );
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
        <Text style={styles.headerTitle}>My Orders</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <LoadingSpinner message="Loading orders..." fullScreen />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
            />
          }
          ListEmptyComponent={
            <EmptyState
              icon="receipt-outline"
              title="No Orders Yet"
              description="You haven't placed any orders so far. Start exploring our great offers!"
              buttonTitle="Start Shopping"
              onButtonPress={() => navigation.navigate('Home')}
            />
          }
          renderItem={renderOrderItem}
        />
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
  listContent: {
    padding: sizes.base,
  },
  orderCard: {
    backgroundColor: colors.surface,
    borderRadius: sizes.radiusLg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: sizes.base,
    marginBottom: sizes.base,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: sizes.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  orderIdText: {
    fontSize: sizes.fontBase,
    fontWeight: '700',
    color: colors.text,
  },
  orderDateText: {
    fontSize: sizes.fontXs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: sizes.sm,
    paddingVertical: 4,
    borderRadius: sizes.radiusSm,
  },
  statusBadgeText: {
    fontSize: sizes.fontXs,
    fontWeight: '700',
  },
  itemsPreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: sizes.md,
  },
  previewThumb: {
    width: 48,
    height: 48,
    borderRadius: sizes.radiusSm,
    overflow: 'hidden',
    backgroundColor: colors.surfaceMuted,
    marginRight: sizes.xs,
  },
  thumbImage: {
    width: '100%',
    height: '100%',
  },
  moreThumbs: {
    width: 48,
    height: 48,
    borderRadius: sizes.radiusSm,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: sizes.xs,
  },
  moreThumbsText: {
    fontSize: sizes.fontXs,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  itemMeta: {
    flex: 1,
    alignItems: 'flex-end',
  },
  itemCountText: {
    fontSize: sizes.fontXs,
    color: colors.textSecondary,
  },
  orderTotalText: {
    fontSize: sizes.fontLg,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: sizes.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  viewDetailsText: {
    fontSize: sizes.fontSm,
    fontWeight: '600',
    color: colors.primary,
  },
});

export default OrdersScreen;

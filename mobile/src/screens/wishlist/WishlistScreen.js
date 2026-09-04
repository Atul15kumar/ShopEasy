import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Alert,
} from 'react-native';
import colors from '../../constants/colors';
import sizes from '../../constants/sizes';
import WishlistItem from '../../components/WishlistItem';
import EmptyState from '../../components/EmptyState';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useWishlist } from '../../hooks/useWishlist';
import { useCart } from '../../hooks/useCart';

const WishlistScreen = ({ navigation }) => {
  const { wishlistItems, removeItem, loadWishlist, isLoading } = useWishlist();
  const { addItem } = useCart();

  const onRefresh = useCallback(() => {
    loadWishlist();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await removeItem(productId);
    } catch (error) {
      Alert.alert('Notice', error.message || 'Could not remove from wishlist.');
    }
  };

  const handleMoveToCart = async (productId) => {
    try {
      await addItem(productId, 1);
      await removeItem(productId);
      Alert.alert('Item Moved', 'Product has been moved to your shopping cart!', [
        { text: 'Continue', style: 'cancel' },
        { text: 'View Cart', onPress: () => navigation.navigate('Cart') },
      ]);
    } catch (error) {
      Alert.alert('Notice', error.message || 'Could not add to cart.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Wishlist</Text>
        <Text style={styles.countText}>{wishlistItems.length} items</Text>
      </View>

      {isLoading && wishlistItems.length === 0 ? (
        <LoadingSpinner message="Fetching wishlist..." fullScreen />
      ) : (
        <FlatList
          data={wishlistItems}
          keyExtractor={(item) => (item._id || item)}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={onRefresh}
              colors={[colors.primary]}
            />
          }
          ListEmptyComponent={
            <EmptyState
              icon="heart-outline"
              title="Your Wishlist is Empty"
              description="Save your favorite items here so you can easily purchase them later."
              buttonTitle="Discover Products"
              onButtonPress={() => navigation.navigate('Home')}
            />
          }
          renderItem={({ item }) => (
            <WishlistItem
              item={item}
              onRemove={handleRemove}
              onMoveToCart={handleMoveToCart}
              onPressProduct={(prod) =>
                navigation.navigate('ProductDetails', { productId: prod._id })
              }
            />
          )}
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
  headerTitle: {
    fontSize: sizes.fontXl,
    fontWeight: '800',
    color: colors.text,
  },
  countText: {
    fontSize: sizes.fontSm,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  listContent: {
    padding: sizes.base,
  },
});

export default WishlistScreen;

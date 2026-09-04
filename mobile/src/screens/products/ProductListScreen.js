import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import sizes from '../../constants/sizes';
import ProductCard from '../../components/ProductCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { fetchProducts } from '../../services/productService';

const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Top Rated', value: 'rating_desc' },
];

const ProductListScreen = ({ route, navigation }) => {
  const { categoryId, categoryName, filterType, title } = route.params || {};
  const { width } = useWindowDimensions();

  // Responsive columns: 2 on mobile, 3 on tablet/small screen, 4 on desktop
  const numColumns = width > 1050 ? 4 : width > 680 ? 3 : 2;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const screenTitle = title || categoryName || 'All Products';

  const loadProducts = async (pageNum = 1, append = false) => {
    try {
      if (pageNum === 1) setLoading(true);

      const params = {
        page: pageNum,
        limit: 12,
        sort,
      };

      if (categoryId) params.category = categoryId;
      if (filterType === 'featured') params.featured = 'true';
      if (filterType === 'popular') params.popular = 'true';
      if (filterType === 'newArrival') params.newArrival = 'true';
      if (filterType === 'bestSeller') params.bestSeller = 'true';

      const res = await fetchProducts(params);
      if (res?.data?.products) {
        if (append) {
          setProducts((prev) => [...prev, ...res.data.products]);
        } else {
          setProducts(res.data.products);
        }
        setTotalPages(res.data.pages || 1);
        setPage(pageNum);
      }
    } catch (error) {
      console.warn('Error fetching products:', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadProducts(1, false);
  }, [categoryId, filterType, sort]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadProducts(1, false);
  }, [categoryId, filterType, sort]);

  const handleLoadMore = () => {
    if (!loading && page < totalPages) {
      loadProducts(page + 1, true);
    }
  };

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetails', { productId: product._id });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.outerContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {screenTitle}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Search')}
            style={styles.searchIconBtn}
          >
            <Ionicons name="search-outline" size={22} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Sort Filter Bar */}
        <View style={styles.sortBar}>
          <Text style={styles.resultsCount}>
            {products.length} {products.length === 1 ? 'Product' : 'Products'} found
          </Text>
          <TouchableOpacity
            style={styles.sortSelector}
            onPress={() => setShowSortDropdown(!showSortDropdown)}
          >
            <Ionicons name="swap-vertical" size={16} color={colors.primary} />
            <Text style={styles.sortText}>
              {SORT_OPTIONS.find((s) => s.value === sort)?.label || 'Sort'}
            </Text>
            <Ionicons
              name={showSortDropdown ? 'chevron-up' : 'chevron-down'}
              size={14}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* Dropdown menu */}
        {showSortDropdown && (
          <View style={styles.dropdownMenu}>
            {SORT_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.dropdownItem, sort === opt.value && styles.activeDropdownItem]}
                onPress={() => {
                  setSort(opt.value);
                  setShowSortDropdown(false);
                }}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    sort === opt.value && styles.activeDropdownItemText,
                  ]}
                >
                  {opt.label}
                </Text>
                {sort === opt.value && (
                  <Ionicons name="checkmark" size={16} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {loading && products.length === 0 ? (
          <LoadingSpinner message="Fetching items..." fullScreen />
        ) : (
          <FlatList
            key={`grid-${numColumns}`}
            data={products}
            keyExtractor={(item) => item._id}
            numColumns={numColumns}
            contentContainerStyle={styles.listContent}
            columnWrapperStyle={styles.columnWrapper}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[colors.primary]}
              />
            }
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.4}
            ListEmptyComponent={
              <EmptyState
                icon="search-outline"
                title="No Products Found"
                description="We couldn't find any products in this selection."
                buttonTitle="Back to Home"
                onButtonPress={() => navigation.navigate('Home')}
              />
            }
            renderItem={({ item }) => (
              <ProductCard
                product={item}
                onPress={handleProductPress}
                style={{ margin: 4 }}
              />
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 1200,
    alignSelf: 'center',
  },
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
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: sizes.fontLg,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginHorizontal: sizes.sm,
  },
  searchIconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sortBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: sizes.base,
    paddingVertical: sizes.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  resultsCount: {
    fontSize: sizes.fontSm,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  sortSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: sizes.sm,
    paddingVertical: 4,
    borderRadius: sizes.radiusSm,
    backgroundColor: colors.primaryLight,
  },
  sortText: {
    fontSize: sizes.fontSm,
    fontWeight: '700',
    color: colors.primary,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 96,
    right: sizes.base,
    backgroundColor: colors.surface,
    borderRadius: sizes.radiusMd,
    borderWidth: 1,
    borderColor: colors.border,
    zIndex: 999,
    elevation: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    width: 200,
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: sizes.md,
    paddingHorizontal: sizes.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  activeDropdownItem: {
    backgroundColor: colors.primaryLight,
  },
  dropdownItemText: {
    fontSize: sizes.fontSm,
    color: colors.text,
    fontWeight: '500',
  },
  activeDropdownItemText: {
    color: colors.primary,
    fontWeight: '700',
  },
  listContent: {
    padding: sizes.sm,
    paddingBottom: sizes.xxl,
  },
  columnWrapper: {
    justifyContent: 'flex-start',
  },
});

export default ProductListScreen;

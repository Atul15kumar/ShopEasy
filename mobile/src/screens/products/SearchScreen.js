import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import sizes from '../../constants/sizes';
import SearchBar from '../../components/SearchBar';
import ProductCard from '../../components/ProductCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { fetchProducts, fetchCategories } from '../../services/productService';

const PRICE_RANGES = [
  { label: 'All', min: '', max: '' },
  { label: 'Under $50', min: '0', max: '50' },
  { label: '$50 - $100', min: '50', max: '100' },
  { label: '$100 - $200', min: '100', max: '200' },
  { label: '$200+', min: '200', max: '' },
];

const SearchScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedPriceRange, setSelectedPriceRange] = useState(PRICE_RANGES[0]);
  const [minRating, setMinRating] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetchCategories();
        if (res?.data?.categories) setCategories(res.data.categories);
      } catch (e) {
        console.warn('Could not load categories:', e.message);
      }
    };
    loadCategories();
    // Initial fetch of popular items
    executeSearch('', '', PRICE_RANGES[0], '', 'newest');
  }, []);

  const executeSearch = async (
    searchQuery = query,
    catId = selectedCategory,
    priceRange = selectedPriceRange,
    rating = minRating,
    sort = sortBy
  ) => {
    try {
      setLoading(true);
      setHasSearched(true);

      const params = {
        limit: 20,
        sort,
      };

      if (searchQuery.trim()) params.q = searchQuery.trim();
      if (catId) params.category = catId;
      if (priceRange.min !== '') params.minPrice = priceRange.min;
      if (priceRange.max !== '') params.maxPrice = priceRange.max;
      if (rating !== '') params.minRating = rating;

      const res = await fetchProducts(params);
      if (res?.data?.products) {
        setProducts(res.data.products);
      }
    } catch (error) {
      console.warn('Search error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSelectedPriceRange(PRICE_RANGES[0]);
    setMinRating('');
    setSortBy('newest');
    executeSearch(query, '', PRICE_RANGES[0], '', 'newest');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <View style={styles.searchBarWrapper}>
          <SearchBar
            value={query}
            onChangeText={(text) => {
              setQuery(text);
              executeSearch(text, selectedCategory, selectedPriceRange, minRating, sortBy);
            }}
            onSubmitEditing={() => executeSearch()}
            onClear={() => {
              setQuery('');
              executeSearch('', selectedCategory, selectedPriceRange, minRating, sortBy);
            }}
            placeholder="Search by keyword, brand..."
          />
        </View>
      </View>

      {/* Filter Horizontal Scroll Area */}
      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {/* Category Chips */}
          <TouchableOpacity
            style={[styles.chip, !selectedCategory && styles.activeChip]}
            onPress={() => {
              setSelectedCategory('');
              executeSearch(query, '', selectedPriceRange, minRating, sortBy);
            }}
          >
            <Text style={[styles.chipText, !selectedCategory && styles.activeChipText]}>
              All Categories
            </Text>
          </TouchableOpacity>

          {categories.map((cat) => (
            <TouchableOpacity
              key={cat._id}
              style={[styles.chip, selectedCategory === cat._id && styles.activeChip]}
              onPress={() => {
                const next = selectedCategory === cat._id ? '' : cat._id;
                setSelectedCategory(next);
                executeSearch(query, next, selectedPriceRange, minRating, sortBy);
              }}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedCategory === cat._id && styles.activeChipText,
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Price & Rating chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[styles.filterRow, { marginTop: sizes.xs }]}
        >
          {PRICE_RANGES.map((range, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.smallChip,
                selectedPriceRange.label === range.label && styles.activeSmallChip,
              ]}
              onPress={() => {
                setSelectedPriceRange(range);
                executeSearch(query, selectedCategory, range, minRating, sortBy);
              }}
            >
              <Text
                style={[
                  styles.smallChipText,
                  selectedPriceRange.label === range.label && styles.activeSmallChipText,
                ]}
              >
                {range.label}
              </Text>
            </TouchableOpacity>
          ))}

          {/* 4+ Stars Filter */}
          <TouchableOpacity
            style={[styles.smallChip, minRating === '4' && styles.activeSmallChip]}
            onPress={() => {
              const next = minRating === '4' ? '' : '4';
              setMinRating(next);
              executeSearch(query, selectedCategory, selectedPriceRange, next, sortBy);
            }}
          >
            <Ionicons
              name="star"
              size={12}
              color={minRating === '4' ? colors.white : colors.star}
              style={{ marginRight: 3 }}
            />
            <Text
              style={[
                styles.smallChipText,
                minRating === '4' && styles.activeSmallChipText,
              ]}
            >
              4★ & above
            </Text>
          </TouchableOpacity>

          {/* Reset Filters */}
          {(selectedCategory || selectedPriceRange.label !== 'All' || minRating) && (
            <TouchableOpacity style={styles.resetBtn} onPress={handleResetFilters}>
              <Ionicons name="refresh" size={12} color={colors.danger} style={{ marginRight: 2 }} />
              <Text style={styles.resetBtnText}>Reset</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>

      {/* Results Header */}
      <View style={styles.metaRow}>
        <Text style={styles.resultsLabel}>
          {products.length} {products.length === 1 ? 'result' : 'results'}
        </Text>
      </View>

      {/* Product Results Grid */}
      {loading ? (
        <LoadingSpinner message="Searching products..." fullScreen />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          ListEmptyComponent={
            <EmptyState
              icon="search-outline"
              title="No Results Found"
              description="Try adjusting your keywords or clearing the active filters."
              buttonTitle="Reset Filters"
              onButtonPress={handleResetFilters}
            />
          }
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={(prod) =>
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
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: sizes.base,
    paddingVertical: sizes.sm,
    backgroundColor: colors.surface,
  },
  backBtn: {
    marginRight: sizes.sm,
  },
  searchBarWrapper: {
    flex: 1,
  },
  filterSection: {
    backgroundColor: colors.surface,
    paddingBottom: sizes.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterRow: {
    paddingHorizontal: sizes.base,
    gap: sizes.xs,
  },
  chip: {
    paddingHorizontal: sizes.md,
    paddingVertical: 6,
    borderRadius: sizes.radiusFull,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: sizes.fontXs,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  activeChipText: {
    color: colors.white,
  },
  smallChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: sizes.sm,
    paddingVertical: 4,
    borderRadius: sizes.radiusFull,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeSmallChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  smallChipText: {
    fontSize: sizes.fontXs - 1,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  activeSmallChipText: {
    color: colors.white,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: sizes.sm,
    paddingVertical: 4,
    borderRadius: sizes.radiusFull,
    backgroundColor: colors.dangerLight,
  },
  resetBtnText: {
    fontSize: sizes.fontXs - 1,
    fontWeight: '700',
    color: colors.danger,
  },
  metaRow: {
    paddingHorizontal: sizes.base,
    paddingVertical: sizes.sm,
  },
  resultsLabel: {
    fontSize: sizes.fontSm,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: sizes.base,
    paddingBottom: sizes.xxl,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
});

export default SearchScreen;

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import sizes from '../../constants/sizes';
import screenStyles from '../../styles/screenStyles';
import SearchBar from '../../components/SearchBar';
import CategoryCard from '../../components/CategoryCard';
import ProductCard from '../../components/ProductCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { fetchProducts, fetchCategories } from '../../services/productService';
import { useCart } from '../../hooks/useCart';

const HomeScreen = ({ navigation }) => {
  const { cartCount } = useCart();
  const { width } = useWindowDimensions();

  // Responsive column count and card sizing
  const containerWidth = Math.min(width, 1200);
  const cols = containerWidth > 1050 ? 4 : containerWidth > 680 ? 3 : 2;
  const gap = 12;
  const padding = sizes.base * 2;
  const cardWidth = Math.floor((containerWidth - padding - gap * (cols - 1)) / cols);

  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadHomeData = async () => {
    try {
      const [catRes, featRes, popRes, newRes, bestRes] = await Promise.all([
        fetchCategories(),
        fetchProducts({ featured: 'true', limit: 8 }),
        fetchProducts({ popular: 'true', limit: 8 }),
        fetchProducts({ newArrival: 'true', limit: 8 }),
        fetchProducts({ bestSeller: 'true', limit: 8 }),
      ]);

      if (catRes?.data?.categories) setCategories(catRes.data.categories);
      if (featRes?.data?.products) setFeaturedProducts(featRes.data.products);
      if (popRes?.data?.products) setPopularProducts(popRes.data.products);
      if (newRes?.data?.products) setNewArrivals(newRes.data.products);
      if (bestRes?.data?.products) setBestSellers(bestRes.data.products);
    } catch (error) {
      console.warn('Error loading home data:', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadHomeData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadHomeData();
  }, []);

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetails', { productId: product._id });
  };

  const handleCategoryPress = (category) => {
    navigation.navigate('ProductList', {
      categoryId: category._id,
      categoryName: category.name,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.surface }}>
      <View style={styles.outerContainer}>
        {/* Top App Bar */}
        <View style={styles.headerBar}>
          <View style={styles.brandRow}>
            <View style={styles.logoBadge}>
              <Ionicons name="bag-handle" size={20} color={colors.white} />
            </View>
            <Text style={styles.brandTitle}>ShopEasy</Text>
          </View>

          <View style={styles.headerIconsRow}>
            {/* Notification Button */}
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => Alert.alert('Notifications', 'You have no new notifications.')}
            >
              <Ionicons name="notifications-outline" size={22} color={colors.text} />
            </TouchableOpacity>

            {/* Cart with Live Badge */}
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => navigation.navigate('Cart')}
            >
              <Ionicons name="cart-outline" size={24} color={colors.text} />
              {cartCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartCount > 99 ? '99+' : cartCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Input */}
        <View style={styles.searchWrapper}>
          <SearchBar
            editable={false}
            onPress={() => navigation.navigate('Search')}
            placeholder="Search items, brands, categories..."
          />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
          }
          style={{ flex: 1, backgroundColor: colors.background }}
        >
          {/* Promotional Hero Banner */}
          <View style={styles.bannerContainer}>
            <Text style={styles.bannerTitle}>Super Autumn Sale</Text>
            <Text style={styles.bannerSubtitle}>Up to 40% OFF on premium gadgets & lifestyle essentials</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate('ProductList', { isFeatured: true })}
              style={styles.bannerBtn}
            >
              <Text style={styles.bannerBtnText}>Shop Deals</Text>
              <Ionicons name="arrow-forward" size={14} color={colors.primary} style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          </View>

          {loading ? (
            <LoadingSpinner message="Fetching latest deals..." />
          ) : (
            <>
              {/* Categories Section */}
              {categories.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionHeading}>Categories</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
                      <Text style={styles.seeAllText}>See All</Text>
                    </TouchableOpacity>
                  </View>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.horizontalListContent}
                  >
                    {categories.map((cat) => (
                      <CategoryCard
                        key={cat._id}
                        category={cat}
                        layout="horizontal"
                        onPress={handleCategoryPress}
                      />
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Featured Products */}
              {featuredProducts.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionHeading}>Featured Products</Text>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('ProductList', {
                          filterType: 'featured',
                          title: 'Featured Products',
                        })
                      }
                    >
                      <Text style={styles.seeAllText}>See All</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.productGrid}>
                    {featuredProducts.map((prod) => (
                      <ProductCard
                        key={prod._id}
                        product={prod}
                        onPress={handleProductPress}
                        style={{ width: cardWidth }}
                      />
                    ))}
                  </View>
                </View>
              )}

              {/* Popular Products */}
              {popularProducts.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionHeading}>Trending Now</Text>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('ProductList', {
                          filterType: 'popular',
                          title: 'Trending Products',
                        })
                      }
                    >
                      <Text style={styles.seeAllText}>See All</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.productGrid}>
                    {popularProducts.map((prod) => (
                      <ProductCard
                        key={prod._id}
                        product={prod}
                        onPress={handleProductPress}
                        style={{ width: cardWidth }}
                      />
                    ))}
                  </View>
                </View>
              )}

              {/* New Arrivals */}
              {newArrivals.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionHeading}>New Arrivals</Text>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('ProductList', {
                          filterType: 'newArrival',
                          title: 'New Arrivals',
                        })
                      }
                    >
                      <Text style={styles.seeAllText}>See All</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.productGrid}>
                    {newArrivals.map((prod) => (
                      <ProductCard
                        key={prod._id}
                        product={prod}
                        onPress={handleProductPress}
                        style={{ width: cardWidth }}
                      />
                    ))}
                  </View>
                </View>
              )}

              {/* Best Sellers */}
              {bestSellers.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionHeading}>Best Sellers</Text>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('ProductList', {
                          filterType: 'bestSeller',
                          title: 'Best Sellers',
                        })
                      }
                    >
                      <Text style={styles.seeAllText}>See All</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.productGrid}>
                    {bestSellers.map((prod) => (
                      <ProductCard
                        key={prod._id}
                        product={prod}
                        onPress={handleProductPress}
                        style={{ width: cardWidth }}
                      />
                    ))}
                  </View>
                </View>
              )}
            </>
          )}
        </ScrollView>
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
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: sizes.base,
    paddingTop: sizes.sm,
    paddingBottom: sizes.sm,
    backgroundColor: colors.surface,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: sizes.sm,
  },
  brandTitle: {
    fontSize: sizes.fontXl,
    fontWeight: '800',
    color: colors.text,
    letterSpacing: -0.5,
  },
  headerIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sizes.sm,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
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
  searchWrapper: {
    backgroundColor: colors.surface,
    paddingHorizontal: sizes.base,
    paddingBottom: sizes.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  bannerContainer: {
    margin: sizes.base,
    padding: sizes.xl,
    backgroundColor: colors.primary,
    borderRadius: sizes.radiusXl,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  bannerTitle: {
    fontSize: sizes.fontXxl,
    fontWeight: '900',
    color: colors.white,
    letterSpacing: -0.5,
  },
  bannerSubtitle: {
    fontSize: sizes.fontSm,
    color: colors.primaryLight,
    marginTop: sizes.xs,
    marginBottom: sizes.md,
    lineHeight: 18,
  },
  bannerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingHorizontal: sizes.md,
    paddingVertical: sizes.sm,
    borderRadius: sizes.radiusMd,
    alignSelf: 'flex-start',
  },
  bannerBtnText: {
    color: colors.primary,
    fontSize: sizes.fontSm,
    fontWeight: '700',
  },
  section: {
    marginBottom: sizes.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: sizes.base,
    marginBottom: sizes.sm,
  },
  sectionHeading: {
    fontSize: sizes.fontLg,
    fontWeight: '800',
    color: colors.text,
  },
  seeAllText: {
    fontSize: sizes.fontSm,
    fontWeight: '700',
    color: colors.primary,
  },
  horizontalListContent: {
    paddingHorizontal: sizes.base,
    gap: sizes.sm,
  },
  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: sizes.base,
  },
});

export default HomeScreen;

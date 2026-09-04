import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import colors from '../../constants/colors';
import sizes from '../../constants/sizes';
import CategoryCard from '../../components/CategoryCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import { fetchCategories } from '../../services/productService';

const CategoriesScreen = ({ navigation }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadCategories = async () => {
    try {
      const res = await fetchCategories();
      if (res?.data?.categories) {
        setCategories(res.data.categories);
      }
    } catch (error) {
      console.warn('Error fetching categories:', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadCategories();
  }, []);

  const handleCategoryPress = (category) => {
    navigation.navigate('ProductList', {
      categoryId: category._id,
      categoryName: category.name,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>All Categories</Text>
        <Text style={styles.headerSubtitle}>Discover curated collections for every need</Text>
      </View>

      {loading ? (
        <LoadingSpinner message="Loading categories..." fullScreen />
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item._id}
          numColumns={2}
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
              icon="grid-outline"
              title="No Categories"
              description="No categories found. Check your database connection."
              buttonTitle="Retry"
              onButtonPress={loadCategories}
            />
          }
          renderItem={({ item }) => (
            <CategoryCard
              category={item}
              layout="grid"
              onPress={handleCategoryPress}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: sizes.base,
    paddingTop: sizes.md,
    paddingBottom: sizes.base,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: sizes.fontXl,
    fontWeight: '800',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: sizes.fontSm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  listContent: {
    padding: sizes.sm,
  },
});

export default CategoriesScreen;

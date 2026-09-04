import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';
import sizes from '../constants/sizes';

const SearchBar = ({
  value,
  onChangeText,
  onSubmitEditing,
  onClear,
  placeholder = 'Search products, brands...',
  editable = true,
  onPress,
  style,
  autoFocus = false,
}) => {
  // If not editable (e.g. on HomeScreen), render a clean tappable button that reliably opens Search
  if (!editable) {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={[styles.container, style]}
      >
        <Ionicons
          name="search-outline"
          size={20}
          color={colors.textSecondary}
          style={styles.searchIcon}
        />
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>{placeholder}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  // Editable search bar for dedicated SearchScreen
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        onPress={onSubmitEditing}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons
          name="search-outline"
          size={20}
          color={colors.primary}
          style={styles.searchIcon}
        />
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        editable={true}
        returnKeyType="search"
        autoFocus={autoFocus}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value && value.length > 0 && onClear ? (
        <TouchableOpacity
          onPress={onClear}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceMuted,
    borderRadius: sizes.radiusMd,
    paddingHorizontal: sizes.md,
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    marginRight: sizes.sm,
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: sizes.fontBase,
    color: colors.textMuted,
  },
  input: {
    flex: 1,
    fontSize: sizes.fontBase,
    color: colors.text,
    paddingVertical: 0,
    outlineStyle: 'none',
  },
});

export default SearchBar;

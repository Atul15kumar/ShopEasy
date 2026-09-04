import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
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
}) => {
  return (
    <TouchableOpacity
      activeOpacity={editable ? 1 : 0.8}
      onPress={onPress}
      style={[styles.container, style]}
    >
      <Ionicons name="search-outline" size={20} color={colors.textSecondary} style={styles.searchIcon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        editable={editable}
        returnKeyType="search"
      />
      {value && value.length > 0 && onClear ? (
        <TouchableOpacity onPress={onClear} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      ) : null}
    </TouchableOpacity>
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
  input: {
    flex: 1,
    fontSize: sizes.fontBase,
    color: colors.text,
    paddingVertical: 0,
  },
});

export default SearchBar;

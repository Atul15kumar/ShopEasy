import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';
import sizes from '../constants/sizes';
import CustomButton from './CustomButton';

const EmptyState = ({
  icon = 'basket-outline',
  title = 'No Items Found',
  description = 'There are no items to display at this moment.',
  buttonTitle = null,
  onButtonPress = null,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={48} color={colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {buttonTitle && onButtonPress && (
        <CustomButton
          title={buttonTitle}
          onPress={onButtonPress}
          variant="primary"
          size="sm"
          style={styles.actionBtn}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: sizes.xxl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: sizes.base,
  },
  title: {
    fontSize: sizes.fontLg,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: sizes.xs,
  },
  description: {
    fontSize: sizes.fontBase,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
  },
  actionBtn: {
    marginTop: sizes.lg,
    minWidth: 160,
  },
});

export default EmptyState;

import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';
import colors from '../constants/colors';
import sizes from '../constants/sizes';

const CustomButton = ({
  title,
  onPress,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'danger' | 'text'
  size = 'md', // 'sm' | 'md' | 'lg'
  loading = false,
  disabled = false,
  icon = null,
  style,
  textStyle,
}) => {
  const getContainerStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryBtn;
      case 'outline':
        return styles.outlineBtn;
      case 'danger':
        return styles.dangerBtn;
      case 'text':
        return styles.textBtn;
      default:
        return styles.primaryBtn;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'outline':
      case 'text':
        return styles.outlineBtnText;
      case 'danger':
        return styles.dangerBtnText;
      default:
        return styles.primaryBtnText;
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'sm':
        return styles.btnSm;
      case 'lg':
        return styles.btnLg;
      default:
        return styles.btnMd;
    }
  };

  const getTextSizeStyle = () => {
    switch (size) {
      case 'sm':
        return styles.textSm;
      case 'lg':
        return styles.textLg;
      default:
        return styles.textMd;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.baseButton,
        getContainerStyle(),
        getSizeStyle(),
        disabled && styles.disabledBtn,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'text' ? colors.primary : colors.white}
        />
      ) : (
        <View style={styles.contentRow}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text
            style={[
              styles.baseText,
              getTextStyle(),
              getTextSizeStyle(),
              disabled && styles.disabledText,
              textStyle,
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    borderRadius: sizes.radiusMd,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginRight: sizes.sm,
  },
  baseText: {
    fontWeight: '700',
    textAlign: 'center',
  },

  // Variants
  primaryBtn: {
    backgroundColor: colors.primary,
  },
  primaryBtnText: {
    color: colors.white,
  },
  secondaryBtn: {
    backgroundColor: colors.secondary,
  },
  outlineBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  outlineBtnText: {
    color: colors.primary,
  },
  dangerBtn: {
    backgroundColor: colors.danger,
  },
  dangerBtnText: {
    color: colors.white,
  },
  textBtn: {
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
  },

  // Sizes
  btnSm: {
    height: 38,
    paddingHorizontal: sizes.md,
  },
  btnMd: {
    height: sizes.buttonHeight,
    paddingHorizontal: sizes.base,
  },
  btnLg: {
    height: 56,
    paddingHorizontal: sizes.xl,
  },

  textSm: {
    fontSize: sizes.fontSm,
  },
  textMd: {
    fontSize: sizes.fontBase,
  },
  textLg: {
    fontSize: sizes.fontMd,
  },

  // Disabled
  disabledBtn: {
    opacity: 0.5,
    backgroundColor: colors.border,
    borderColor: colors.border,
  },
  disabledText: {
    color: colors.textMuted,
  },
});

export default CustomButton;

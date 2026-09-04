import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const sizes = {
  // Screen Dimensions
  screenWidth: width,
  screenHeight: height,

  // Spacing
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,

  // Font Sizes
  fontXs: 11,
  fontSm: 13,
  fontBase: 15,
  fontMd: 17,
  fontLg: 20,
  fontXl: 24,
  fontXxl: 30,

  // Border Radius
  radiusSm: 6,
  radiusMd: 10,
  radiusLg: 14,
  radiusXl: 20,
  radiusFull: 9999,

  // Icons
  iconSm: 16,
  iconMd: 20,
  iconBase: 24,
  iconLg: 28,
  iconXl: 34,

  // Component Specific
  buttonHeight: 50,
  inputHeight: 48,
  headerHeight: 56,
  cardWidth: (width - 48) / 2,
};

export default sizes;

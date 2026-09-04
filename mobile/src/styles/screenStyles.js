import { StyleSheet, Platform } from 'react-native';
import colors from '../constants/colors';
import sizes from '../constants/sizes';

const screenStyles = StyleSheet.create({
  // Auth Screen Styles
  authContainer: {
    flexGrow: 1,
    paddingHorizontal: sizes.xl,
    paddingVertical: sizes.xxl,
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  authHeader: {
    marginBottom: sizes.xl,
    alignItems: 'center',
  },
  authLogoContainer: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: sizes.base,
  },
  authTitle: {
    fontSize: sizes.fontXxl,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  authSubtitle: {
    fontSize: sizes.fontBase,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: sizes.xs,
  },
  authCard: {
    backgroundColor: colors.surface,
    borderRadius: sizes.radiusLg,
    padding: sizes.xl,
    borderWidth: 1,
    borderColor: colors.border,
    ...Platform.select({
      ios: {
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  authFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: sizes.xl,
  },
  authFooterText: {
    fontSize: sizes.fontBase,
    color: colors.textSecondary,
  },
  authFooterLink: {
    fontSize: sizes.fontBase,
    fontWeight: '700',
    color: colors.primary,
    marginLeft: sizes.xs,
  },

  // Home Screen Styles
  homeHeader: {
    paddingHorizontal: sizes.base,
    paddingTop: sizes.sm,
    paddingBottom: sizes.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  bannerContainer: {
    marginHorizontal: sizes.base,
    marginTop: sizes.base,
    borderRadius: sizes.radiusLg,
    overflow: 'hidden',
    backgroundColor: colors.primary,
    padding: sizes.xl,
    minHeight: 150,
    justifyContent: 'center',
  },
  bannerTitle: {
    fontSize: sizes.fontXl,
    fontWeight: '800',
    color: colors.white,
  },
  bannerSubtitle: {
    fontSize: sizes.fontBase,
    color: colors.primaryLight,
    marginTop: sizes.xs,
    marginBottom: sizes.md,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: sizes.base,
    marginTop: sizes.xl,
    marginBottom: sizes.md,
  },
  seeAllText: {
    fontSize: sizes.fontSm,
    fontWeight: '700',
    color: colors.primary,
  },

  // Product Details Screen
  detailsImageContainer: {
    width: sizes.screenWidth,
    height: 320,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsContent: {
    padding: sizes.base,
    backgroundColor: colors.surface,
    borderTopLeftRadius: sizes.radiusXl,
    borderTopRightRadius: sizes.radiusXl,
    marginTop: -20,
    minHeight: 400,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: sizes.base,
    paddingVertical: sizes.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});

export default screenStyles;

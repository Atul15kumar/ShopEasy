import { StyleSheet, Platform } from 'react-native';
import colors from '../constants/colors';
import sizes from '../constants/sizes';

const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: sizes.radiusMd,
    padding: sizes.base,
    borderWidth: 1,
    borderColor: colors.border,
    ...Platform.select({
      ios: {
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  title: {
    fontSize: sizes.fontXl,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: sizes.fontBase,
    color: colors.textSecondary,
    marginTop: sizes.xs,
  },
  sectionTitle: {
    fontSize: sizes.fontLg,
    fontWeight: '700',
    color: colors.text,
    marginBottom: sizes.md,
  },
  badge: {
    paddingHorizontal: sizes.sm,
    paddingVertical: sizes.xs,
    borderRadius: sizes.radiusSm,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: sizes.fontXs,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: sizes.base,
  },
  input: {
    height: sizes.inputHeight,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: sizes.radiusMd,
    paddingHorizontal: sizes.base,
    fontSize: sizes.fontBase,
    color: colors.text,
  },
  inputError: {
    borderColor: colors.danger,
  },
  errorText: {
    color: colors.danger,
    fontSize: sizes.fontSm,
    marginTop: sizes.xs,
  },
});

export default commonStyles;

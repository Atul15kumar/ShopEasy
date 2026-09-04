import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import sizes from '../../constants/sizes';
import ProductImage from '../../components/ProductImage';
import { useAuth } from '../../hooks/useAuth';
import { useWishlist } from '../../hooks/useWishlist';

const ProfileMenuItem = ({ icon, title, subtitle, onPress, isDestructive = false }) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onPress}
    style={styles.menuItem}
  >
    <View
      style={[
        styles.menuIconContainer,
        isDestructive && { backgroundColor: colors.dangerLight },
      ]}
    >
      <Ionicons
        name={icon}
        size={20}
        color={isDestructive ? colors.danger : colors.primary}
      />
    </View>
    <View style={styles.menuTextContainer}>
      <Text style={[styles.menuTitle, isDestructive && { color: colors.danger }]}>
        {title}
      </Text>
      {subtitle ? <Text style={styles.menuSubtitle}>{subtitle}</Text> : null}
    </View>
    <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
  </TouchableOpacity>
);

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();
  const { wishlistCount } = useWishlist();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out of ShopEasy?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.avatarWrapper}>
            <ProductImage
              uri={user?.profileImage}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.userName}>{user?.name || 'Customer'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'customer@shopeasy.com'}</Text>
          {user?.phone ? <Text style={styles.userPhone}>{user.phone}</Text> : null}

          <TouchableOpacity
            style={styles.editProfileChip}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Ionicons name="pencil" size={12} color={colors.primary} style={{ marginRight: 4 }} />
            <Text style={styles.editProfileChipText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Account Menu Section */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>My Account</Text>

          <View style={styles.card}>
            <ProfileMenuItem
              icon="receipt-outline"
              title="My Orders"
              subtitle="View all past and active orders"
              onPress={() => navigation.navigate('Orders')}
            />
            <View style={styles.divider} />

            <ProfileMenuItem
              icon="heart-outline"
              title="Wishlist"
              subtitle={`${wishlistCount} saved items`}
              onPress={() => navigation.navigate('Wishlist')}
            />
            <View style={styles.divider} />

            <ProfileMenuItem
              icon="location-outline"
              title="Delivery Addresses"
              subtitle="Manage shipping locations"
              onPress={() => navigation.navigate('AddressScreen')}
            />
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>Preferences & Support</Text>

          <View style={styles.card}>
            <ProfileMenuItem
              icon="settings-outline"
              title="Settings"
              subtitle="Notifications, security, app version"
              onPress={() => navigation.navigate('SettingsScreen')}
            />
            <View style={styles.divider} />

            <ProfileMenuItem
              icon="help-circle-outline"
              title="Customer Support"
              subtitle="Get help with orders and account"
              onPress={() =>
                Alert.alert(
                  'ShopEasy Support',
                  'Email: support@shopeasy.com\nPhone: 1-800-SHOP-EASY\nHours: 24/7 Available'
                )
              }
            />
            <View style={styles.divider} />

            <ProfileMenuItem
              icon="log-out-outline"
              title="Log Out"
              onPress={handleLogout}
              isDestructive
            />
          </View>
        </View>

        <Text style={styles.versionFooter}>ShopEasy Mobile v1.0.0 (Production)</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerCard: {
    backgroundColor: colors.surface,
    paddingVertical: sizes.xl,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatarWrapper: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 3,
    borderColor: colors.primary,
    overflow: 'hidden',
    backgroundColor: colors.surfaceMuted,
    marginBottom: sizes.sm,
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  userName: {
    fontSize: sizes.fontXl,
    fontWeight: '800',
    color: colors.text,
  },
  userEmail: {
    fontSize: sizes.fontSm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  userPhone: {
    fontSize: sizes.fontXs,
    color: colors.textMuted,
    marginTop: 2,
  },
  editProfileChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    paddingHorizontal: sizes.md,
    paddingVertical: 6,
    borderRadius: sizes.radiusFull,
    marginTop: sizes.md,
  },
  editProfileChipText: {
    fontSize: sizes.fontXs,
    fontWeight: '700',
    color: colors.primary,
  },
  menuSection: {
    marginTop: sizes.base,
    paddingHorizontal: sizes.base,
  },
  sectionTitle: {
    fontSize: sizes.fontSm,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: sizes.xs,
    marginLeft: 4,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: sizes.radiusLg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: sizes.md,
    paddingHorizontal: sizes.base,
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: sizes.md,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: sizes.fontBase,
    fontWeight: '600',
    color: colors.text,
  },
  menuSubtitle: {
    fontSize: sizes.fontXs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginLeft: 56,
  },
  versionFooter: {
    textAlign: 'center',
    fontSize: sizes.fontXs,
    color: colors.textMuted,
    marginVertical: sizes.xl,
  },
});

export default ProfileScreen;

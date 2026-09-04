import React, { useState } from 'react';
import {
  View,
  Text,
  Switch,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import sizes from '../../constants/sizes';

const SettingsScreen = ({ navigation }) => {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [promoOffers, setPromoOffers] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Notifications Section */}
        <Text style={styles.sectionHeader}>Notifications</Text>
        <View style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingTitle}>Push Notifications</Text>
              <Text style={styles.settingSubtitle}>Receive instant updates on your mobile</Text>
            </View>
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingTitle}>Order Status Tracking</Text>
              <Text style={styles.settingSubtitle}>Get alerts when packages are dispatched</Text>
            </View>
            <Switch
              value={orderUpdates}
              onValueChange={setOrderUpdates}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingTitle}>Special Deals & Discounts</Text>
              <Text style={styles.settingSubtitle}>Exclusive promotional sale announcements</Text>
            </View>
            <Switch
              value={promoOffers}
              onValueChange={setPromoOffers}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        {/* App Preferences */}
        <Text style={styles.sectionHeader}>App Preferences</Text>
        <View style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingTitle}>Default Currency</Text>
              <Text style={styles.settingSubtitle}>USD ($)</Text>
            </View>
            <Ionicons name="lock-closed-outline" size={18} color={colors.textMuted} />
          </View>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <View style={styles.settingTextCol}>
              <Text style={styles.settingTitle}>App Language</Text>
              <Text style={styles.settingSubtitle}>English (US)</Text>
            </View>
            <Ionicons name="lock-closed-outline" size={18} color={colors.textMuted} />
          </View>
        </View>

        {/* Legal & About */}
        <Text style={styles.sectionHeader}>About & Legal</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.settingRow}
            onPress={() =>
              Alert.alert(
                'Privacy Policy',
                'ShopEasy values your privacy. Customer data is encrypted and never shared with third parties.'
              )
            }
          >
            <Text style={styles.settingTitle}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.settingRow}
            onPress={() =>
              Alert.alert(
                'Terms of Service',
                'By using ShopEasy, you agree to our standard consumer terms and delivery policies.'
              )
            }
          >
            <Text style={styles.settingTitle}>Terms of Service</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <View style={styles.settingRow}>
            <Text style={styles.settingTitle}>App Version</Text>
            <Text style={styles.settingSubtitle}>1.0.0 (Build 2026.09)</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: sizes.base,
    paddingVertical: sizes.md,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    padding: sizes.xs,
  },
  headerTitle: {
    fontSize: sizes.fontLg,
    fontWeight: '700',
    color: colors.text,
  },
  content: {
    padding: sizes.base,
    paddingBottom: sizes.xxl,
  },
  sectionHeader: {
    fontSize: sizes.fontSm,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: sizes.base,
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
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: sizes.base,
  },
  settingTextCol: {
    flex: 1,
    paddingRight: sizes.base,
  },
  settingTitle: {
    fontSize: sizes.fontBase,
    fontWeight: '600',
    color: colors.text,
  },
  settingSubtitle: {
    fontSize: sizes.fontXs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.borderLight,
  },
});

export default SettingsScreen;

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import sizes from '../../constants/sizes';
import CustomButton from '../../components/CustomButton';
import { useAuth } from '../../hooks/useAuth';
import { updateProfile } from '../../services/authService';

const EditProfileScreen = ({ navigation }) => {
  const { user, updateUserData } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Name cannot be empty.');
      return;
    }

    try {
      setLoading(true);
      const updatePayload = {
        name: name.trim(),
        phone: phone.trim(),
        profileImage: profileImage.trim(),
      };
      if (password) {
        if (password.length < 6) {
          Alert.alert('Validation Error', 'Password must be at least 6 characters long.');
          setLoading(false);
          return;
        }
        updatePayload.password = password;
      }

      const res = await updateProfile(updatePayload);
      if (res?.data?.user) {
        updateUserData(res.data.user);
        Alert.alert('Success', 'Profile updated successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      Alert.alert('Update Failed', error.message || 'Could not update profile.');
    } finally {
      setLoading(false);
    }
  };

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
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Your full name"
              placeholderTextColor={colors.textMuted}
            />
          </View>

          {/* Email (Readonly) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address (Cannot change)</Text>
            <TextInput
              style={[styles.input, styles.readOnlyInput]}
              value={user?.email || ''}
              editable={false}
            />
          </View>

          {/* Phone */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="+1 555-0199"
              placeholderTextColor={colors.textMuted}
              keyboardType="phone-pad"
            />
          </View>

          {/* Profile Image URL */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Profile Picture URL</Text>
            <TextInput
              style={styles.input}
              value={profileImage}
              onChangeText={setProfileImage}
              placeholder="https://..."
              placeholderTextColor={colors.textMuted}
            />
          </View>

          {/* Password (Optional change) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>New Password (Optional)</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Leave blank to keep unchanged"
              placeholderTextColor={colors.textMuted}
              secureTextEntry
            />
          </View>

          <CustomButton
            title="Save Changes"
            onPress={handleSave}
            loading={loading}
            style={{ marginTop: sizes.base }}
          />
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
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: sizes.radiusLg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: sizes.base,
  },
  inputGroup: {
    marginBottom: sizes.base,
  },
  label: {
    fontSize: sizes.fontSm,
    fontWeight: '600',
    color: colors.text,
    marginBottom: sizes.xs,
  },
  input: {
    height: sizes.inputHeight,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: sizes.radiusMd,
    paddingHorizontal: sizes.md,
    fontSize: sizes.fontBase,
    color: colors.text,
  },
  readOnlyInput: {
    backgroundColor: colors.borderLight,
    color: colors.textSecondary,
  },
});

export default EditProfileScreen;

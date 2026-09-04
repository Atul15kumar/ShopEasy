import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import sizes from '../../constants/sizes';
import screenStyles from '../../styles/screenStyles';
import CustomButton from '../../components/CustomButton';
import { useAuth } from '../../hooks/useAuth';
import { validateEmail, validatePassword, validateName, validatePhone } from '../../utils/validation';

const RegisterScreen = ({ navigation }) => {
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleRegister = async () => {
    const nameErr = validateName(name);
    const emailErr = validateEmail(email);
    const phoneErr = validatePhone(phone);
    const passErr = validatePassword(password);
    let confirmErr = null;

    if (password !== confirmPassword) {
      confirmErr = 'Passwords do not match';
    }

    if (nameErr || emailErr || phoneErr || passErr || confirmErr) {
      setErrors({
        name: nameErr,
        email: emailErr,
        phone: phoneErr,
        password: passErr,
        confirmPassword: confirmErr,
      });
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
        confirmPassword,
      });
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.navigate('TabRoot');
      }
    } catch (error) {
      Alert.alert('Registration Failed', error.message || 'Could not register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <ScrollView contentContainerStyle={screenStyles.authContainer} keyboardShouldPersistTaps="handled">
        {/* Close Button */}
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate('TabRoot');
            }
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close" size={26} color={colors.text} />
        </TouchableOpacity>

        {/* Header */}
        <View style={screenStyles.authHeader}>
          <View style={screenStyles.authLogoContainer}>
            <Ionicons name="person-add" size={32} color={colors.primary} />
          </View>
          <Text style={screenStyles.authTitle}>Create Account</Text>
          <Text style={screenStyles.authSubtitle}>Join ShopEasy to start shopping today</Text>
        </View>

        {/* Form Card */}
        <View style={screenStyles.authCard}>
          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <View style={[styles.inputWrapper, errors.name && styles.inputError]}>
              <Ionicons name="person-outline" size={18} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
                }}
                placeholder="John Doe"
                placeholderTextColor={colors.textMuted}
              />
            </View>
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={[styles.inputWrapper, errors.email && styles.inputError]}>
              <Ionicons name="mail-outline" size={18} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
                }}
                placeholder="john@example.com"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          {/* Phone */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={[styles.inputWrapper, errors.phone && styles.inputError]}>
              <Ionicons name="call-outline" size={18} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                value={phone}
                onChangeText={(text) => {
                  setPhone(text);
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: null }));
                }}
                placeholder="+1 555-0199"
                placeholderTextColor={colors.textMuted}
                keyboardType="phone-pad"
              />
            </View>
            {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={[styles.inputWrapper, errors.password && styles.inputError]}>
              <Ionicons name="lock-closed-outline" size={18} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
                }}
                placeholder="At least 6 characters"
                placeholderTextColor={colors.textMuted}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

          {/* Confirm Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={[styles.inputWrapper, errors.confirmPassword && styles.inputError]}>
              <Ionicons name="lock-closed-outline" size={18} color={colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: null }));
                }}
                placeholder="Re-enter password"
                placeholderTextColor={colors.textMuted}
                secureTextEntry={!showPassword}
              />
            </View>
            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
          </View>

          {/* Submit */}
          <CustomButton
            title="Create Account"
            onPress={handleRegister}
            loading={loading}
            style={{ marginTop: sizes.base }}
          />
        </View>

        {/* Footer */}
        <View style={screenStyles.authFooter}>
          <Text style={screenStyles.authFooterText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={screenStyles.authFooterLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: sizes.base,
  },
  label: {
    fontSize: sizes.fontSm,
    fontWeight: '600',
    color: colors.text,
    marginBottom: sizes.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: sizes.inputHeight,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: sizes.radiusMd,
    paddingHorizontal: sizes.md,
  },
  inputError: {
    borderColor: colors.danger,
    backgroundColor: colors.dangerLight,
  },
  inputIcon: {
    marginRight: sizes.sm,
  },
  textInput: {
    flex: 1,
    fontSize: sizes.fontBase,
    color: colors.text,
    paddingVertical: 0,
  },
  errorText: {
    color: colors.danger,
    fontSize: sizes.fontXs,
    marginTop: 4,
  },
  closeBtn: {
    alignSelf: 'flex-start',
    padding: sizes.xs,
    marginBottom: sizes.sm,
    backgroundColor: colors.surface,
    borderRadius: sizes.radiusFull,
  },
});

export default RegisterScreen;

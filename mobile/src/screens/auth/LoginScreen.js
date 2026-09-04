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
import { validateEmail, validatePassword } from '../../utils/validation';

const LoginScreen = ({ navigation }) => {
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleLogin = async () => {
    const emailErr = validateEmail(email);
    const passErr = validatePassword(password);

    if (emailErr || passErr) {
      setErrors({ email: emailErr, password: passErr });
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await login(email.trim(), password);
      if (navigation.canGoBack()) {
        navigation.goBack();
      } else {
        navigation.navigate('TabRoot');
      }
    } catch (error) {
      Alert.alert('Login Failed', error.message || 'Invalid credentials. Please try again.');
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
        {/* Close Button to return to store */}
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

        {/* Header Branding */}
        <View style={screenStyles.authHeader}>
          <View style={screenStyles.authLogoContainer}>
            <Ionicons name="bag-handle" size={34} color={colors.primary} />
          </View>
          <Text style={screenStyles.authTitle}>ShopEasy</Text>
          <Text style={screenStyles.authSubtitle}>Welcome back! Please sign in to continue</Text>
        </View>

        {/* Card with inputs */}
        <View style={screenStyles.authCard}>
          {/* Email input */}
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
                placeholder="name@example.com"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          {/* Password input */}
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
                placeholder="••••••••"
                placeholderTextColor={colors.textMuted}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

          {/* Sign In Button */}
          <CustomButton
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            style={{ marginTop: sizes.base }}
          />
        </View>

        {/* Footer Link */}
        <View style={screenStyles.authFooter}>
          <Text style={screenStyles.authFooterText}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={screenStyles.authFooterLink}>Sign Up</Text>
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

export default LoginScreen;

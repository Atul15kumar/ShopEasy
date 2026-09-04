import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '../../constants/colors';
import sizes from '../../constants/sizes';
import CustomButton from '../../components/CustomButton';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import {
  fetchAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from '../../services/authService';
import { validateAddress } from '../../utils/validation';

const AddressScreen = ({ navigation }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [houseFlat, setHouseFlat] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [country, setCountry] = useState('United States');
  const [isDefault, setIsDefault] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const loadAddresses = async () => {
    try {
      const res = await fetchAddresses();
      if (res?.data?.addresses) {
        setAddresses(res.data.addresses);
      }
    } catch (error) {
      console.warn('Could not load addresses:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAddresses();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFullName('');
    setPhone('');
    setHouseFlat('');
    setStreet('');
    setCity('');
    setState('');
    setPinCode('');
    setCountry('United States');
    setIsDefault(addresses.length === 0);
    setFormErrors({});
    setModalVisible(true);
  };

  const openEditModal = (addr) => {
    setEditingId(addr._id);
    setFullName(addr.fullName);
    setPhone(addr.phone);
    setHouseFlat(addr.houseFlat);
    setStreet(addr.street);
    setCity(addr.city);
    setState(addr.state);
    setPinCode(addr.pinCode);
    setCountry(addr.country || 'United States');
    setIsDefault(addr.isDefault);
    setFormErrors({});
    setModalVisible(true);
  };

  const handleSaveAddress = async () => {
    const data = {
      fullName,
      phone,
      houseFlat,
      street,
      city,
      state,
      pinCode,
      country,
      isDefault,
    };

    const errors = validateAddress(data);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setSaving(true);
      if (editingId) {
        const res = await updateAddress(editingId, data);
        if (res?.data?.addresses) setAddresses(res.data.addresses);
      } else {
        const res = await addAddress(data);
        if (res?.data?.addresses) setAddresses(res.data.addresses);
      }
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Save Notice', error.message || 'Could not save address.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAddress = (id) => {
    Alert.alert('Delete Address', 'Are you sure you want to delete this delivery address?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const res = await deleteAddress(id);
            if (res?.data?.addresses) setAddresses(res.data.addresses);
          } catch (e) {
            Alert.alert('Error', e.message || 'Could not delete address.');
          }
        },
      },
    ]);
  };

  const handleSetDefault = async (addr) => {
    if (addr.isDefault) return;
    try {
      const res = await updateAddress(addr._id, { ...addr, isDefault: true });
      if (res?.data?.addresses) setAddresses(res.data.addresses);
    } catch (e) {
      Alert.alert('Error', e.message || 'Could not update default address.');
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
        <Text style={styles.headerTitle}>Saved Addresses</Text>
        <TouchableOpacity onPress={openAddModal} style={styles.addBtn}>
          <Ionicons name="add" size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <LoadingSpinner message="Loading addresses..." fullScreen />
      ) : (
        <FlatList
          data={addresses}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <EmptyState
              icon="location-outline"
              title="No Saved Addresses"
              description="Add your delivery address so you can checkout quickly."
              buttonTitle="+ Add New Address"
              onButtonPress={openAddModal}
            />
          }
          renderItem={({ item }) => (
            <View style={[styles.card, item.isDefault && styles.defaultCard]}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.addrName}>{item.fullName}</Text>
                {item.isDefault ? (
                  <View style={styles.defaultTag}>
                    <Text style={styles.defaultTagText}>DEFAULT</Text>
                  </View>
                ) : (
                  <TouchableOpacity onPress={() => handleSetDefault(item)}>
                    <Text style={styles.setDefaultLink}>Set as Default</Text>
                  </TouchableOpacity>
                )}
              </View>

              <Text style={styles.addrDetails}>
                {item.houseFlat}, {item.street}
              </Text>
              <Text style={styles.addrDetails}>
                {item.city}, {item.state} - {item.pinCode}
              </Text>
              <Text style={styles.addrDetails}>{item.country}</Text>
              <Text style={styles.addrPhone}>Phone: {item.phone}</Text>

              <View style={styles.cardActions}>
                <TouchableOpacity
                  style={styles.actionLink}
                  onPress={() => openEditModal(item)}
                >
                  <Ionicons name="pencil-outline" size={16} color={colors.primary} />
                  <Text style={styles.actionLinkText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionLink}
                  onPress={() => handleDeleteAddress(item._id)}
                >
                  <Ionicons name="trash-outline" size={16} color={colors.danger} />
                  <Text style={[styles.actionLinkText, { color: colors.danger }]}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {/* Add / Edit Address Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingId ? 'Edit Address' : 'New Address'}
              </Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.modalBody} keyboardShouldPersistTaps="handled">
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Full Name *</Text>
                <TextInput
                  style={[styles.formInput, formErrors.fullName && styles.formInputError]}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Recipient full name"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Phone Number *</Text>
                <TextInput
                  style={[styles.formInput, formErrors.phone && styles.formInputError]}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="+1 555-0199"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>House / Flat / Building *</Text>
                <TextInput
                  style={[styles.formInput, formErrors.houseFlat && styles.formInputError]}
                  value={houseFlat}
                  onChangeText={setHouseFlat}
                  placeholder="Apt 4B, Sunset Heights"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Street / Area *</Text>
                <TextInput
                  style={[styles.formInput, formErrors.street && styles.formInputError]}
                  value={street}
                  onChangeText={setStreet}
                  placeholder="123 Main Street"
                />
              </View>

              <View style={styles.twoColumnRow}>
                <View style={[styles.formGroup, { flex: 1, marginRight: sizes.sm }]}>
                  <Text style={styles.formLabel}>City *</Text>
                  <TextInput
                    style={[styles.formInput, formErrors.city && styles.formInputError]}
                    value={city}
                    onChangeText={setCity}
                    placeholder="City"
                  />
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.formLabel}>State *</Text>
                  <TextInput
                    style={[styles.formInput, formErrors.state && styles.formInputError]}
                    value={state}
                    onChangeText={setState}
                    placeholder="State"
                  />
                </View>
              </View>

              <View style={styles.twoColumnRow}>
                <View style={[styles.formGroup, { flex: 1, marginRight: sizes.sm }]}>
                  <Text style={styles.formLabel}>PIN / Postal Code *</Text>
                  <TextInput
                    style={[styles.formInput, formErrors.pinCode && styles.formInputError]}
                    value={pinCode}
                    onChangeText={setPinCode}
                    placeholder="94102"
                  />
                </View>
                <View style={[styles.formGroup, { flex: 1 }]}>
                  <Text style={styles.formLabel}>Country</Text>
                  <TextInput
                    style={styles.formInput}
                    value={country}
                    onChangeText={setCountry}
                    placeholder="Country"
                  />
                </View>
              </View>

              {/* Set Default Toggle */}
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => setIsDefault(!isDefault)}
              >
                <Ionicons
                  name={isDefault ? 'checkbox' : 'square-outline'}
                  size={22}
                  color={colors.primary}
                />
                <Text style={styles.checkboxLabel}>Make this my default shipping address</Text>
              </TouchableOpacity>

              <CustomButton
                title={editingId ? 'Update Address' : 'Save Address'}
                onPress={handleSaveAddress}
                loading={saving}
                style={{ marginTop: sizes.lg }}
              />
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>
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
  addBtn: {
    padding: sizes.xs,
  },
  listContent: {
    padding: sizes.base,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: sizes.radiusLg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: sizes.base,
    marginBottom: sizes.base,
  },
  defaultCard: {
    borderColor: colors.primary,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: sizes.xs,
  },
  addrName: {
    fontSize: sizes.fontBase,
    fontWeight: '700',
    color: colors.text,
  },
  defaultTag: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: sizes.sm,
    paddingVertical: 2,
    borderRadius: sizes.radiusSm,
  },
  defaultTagText: {
    fontSize: sizes.fontXs - 1,
    fontWeight: '800',
    color: colors.primary,
  },
  setDefaultLink: {
    fontSize: sizes.fontXs,
    fontWeight: '600',
    color: colors.primary,
  },
  addrDetails: {
    fontSize: sizes.fontSm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  addrPhone: {
    fontSize: sizes.fontXs,
    color: colors.textMuted,
    marginTop: sizes.xs,
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sizes.lg,
    marginTop: sizes.md,
    paddingTop: sizes.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  actionLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionLinkText: {
    fontSize: sizes.fontSm,
    fontWeight: '600',
    color: colors.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: sizes.radiusXl,
    borderTopRightRadius: sizes.radiusXl,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: sizes.base,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: sizes.fontLg,
    fontWeight: '700',
    color: colors.text,
  },
  modalBody: {
    padding: sizes.base,
    paddingBottom: sizes.xxl,
  },
  formGroup: {
    marginBottom: sizes.md,
  },
  twoColumnRow: {
    flexDirection: 'row',
  },
  formLabel: {
    fontSize: sizes.fontXs,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  formInput: {
    height: sizes.inputHeight,
    backgroundColor: colors.surfaceMuted,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: sizes.radiusMd,
    paddingHorizontal: sizes.md,
    fontSize: sizes.fontBase,
    color: colors.text,
  },
  formInputError: {
    borderColor: colors.danger,
    backgroundColor: colors.dangerLight,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: sizes.sm,
    marginVertical: sizes.sm,
  },
  checkboxLabel: {
    fontSize: sizes.fontSm,
    color: colors.text,
    fontWeight: '500',
  },
});

export default AddressScreen;

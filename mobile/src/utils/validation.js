export const validateEmail = (email) => {
  if (!email || !email.trim()) return 'Email is required';
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) return 'Please enter a valid email address';
  return null;
};

export const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  return null;
};

export const validateName = (name) => {
  if (!name || !name.trim()) return 'Name is required';
  if (name.trim().length < 2) return 'Name must be at least 2 characters';
  return null;
};

export const validatePhone = (phone) => {
  if (!phone || !phone.trim()) return 'Phone number is required';
  const phoneRegex = /^[0-9+\-\s()]{7,20}$/;
  if (!phoneRegex.test(phone.trim())) return 'Please enter a valid phone number';
  return null;
};

export const validateAddress = (address) => {
  const errors = {};
  if (!address.fullName?.trim()) errors.fullName = 'Full name is required';
  if (!address.phone?.trim()) errors.phone = 'Phone number is required';
  if (!address.houseFlat?.trim()) errors.houseFlat = 'Flat / House No. is required';
  if (!address.street?.trim()) errors.street = 'Street / Area is required';
  if (!address.city?.trim()) errors.city = 'City is required';
  if (!address.state?.trim()) errors.state = 'State is required';
  if (!address.pinCode?.trim()) errors.pinCode = 'PIN / Postal Code is required';
  return errors;
};

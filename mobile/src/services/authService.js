import api from './api';

export const loginUser = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const fetchProfile = async () => {
  const response = await api.get('/auth/profile');
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await api.put('/auth/profile', profileData);
  return response.data;
};

export const fetchAddresses = async () => {
  const response = await api.get('/users/address');
  return response.data;
};

export const addAddress = async (addressData) => {
  const response = await api.post('/users/address', addressData);
  return response.data;
};

export const updateAddress = async (id, addressData) => {
  const response = await api.put(`/users/address/${id}`, addressData);
  return response.data;
};

export const deleteAddress = async (id) => {
  const response = await api.delete(`/users/address/${id}`);
  return response.data;
};

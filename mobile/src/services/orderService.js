import api from './api';

export const createOrder = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

export const fetchMyOrders = async () => {
  const response = await api.get('/orders');
  return response.data;
};

export const fetchOrderById = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

export const cancelOrder = async (id) => {
  const response = await api.put(`/orders/${id}/cancel`);
  return response.data;
};

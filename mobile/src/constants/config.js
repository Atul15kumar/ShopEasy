import { Platform } from 'react-native';

// Laptop local Wi-Fi IP address (detected via ipconfig)
// This enables your physical phone, emulator, and laptop to connect to the backend server
const LOCAL_MACHINE_IP = '192.168.1.12';

const getDefaultBaseUrl = () => {
  if (Platform.OS === 'web') {
    return 'http://localhost:5000/api';
  }
  // Connect to your laptop's backend server over local Wi-Fi
  return `http://${LOCAL_MACHINE_IP}:5000/api`;
};

const config = {
  appName: 'ShopEasy',
  apiBaseUrl: getDefaultBaseUrl(),
  apiTimeout: 15000,
  currency: '$',
  supportEmail: 'support@shopeasy.com',
};

export default config;

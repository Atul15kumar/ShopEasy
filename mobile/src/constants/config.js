import { Platform } from 'react-native';

// Standard default localhost addresses:
// Android Emulator uses 10.0.2.2 to reach host machine localhost
// iOS Simulator / Web uses 127.0.0.1 or localhost
const getDefaultBaseUrl = () => {
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/api';
  }
  return 'http://localhost:5000/api';
};

const config = {
  appName: 'ShopEasy',
  apiBaseUrl: getDefaultBaseUrl(),
  apiTimeout: 15000,
  currency: '$',
  supportEmail: 'support@shopeasy.com',
};

export default config;

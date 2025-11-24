import {Platform} from 'react-native';

// TODO: Винести в конфігурацію
// Для Android емулятора використовуємо 10.0.2.2 замість localhost
export const API_BASE_URL = __DEV__
  ? Platform.OS === 'android'
    ? 'http://10.0.2.2:3000'
    : 'http://localhost:3000'
  : 'https://your-production-api.com';


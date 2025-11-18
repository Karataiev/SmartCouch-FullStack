import {configureStore} from '@reduxjs/toolkit';
import appReducer from './slices/appSlice';
import {updateCurrentTime} from './action';

const formatTime = () => {
  const date = new Date();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

export const store = configureStore({
  reducer: {app: appReducer},
  devTools: process.env.NODE_ENV !== 'production',
});

// Ініціалізуємо таймер після створення store
let intervalId = setInterval(() => {
  const time = formatTime();
  store.dispatch(updateCurrentTime(time));
}, 1000);

// Встановлюємо початковий час
store.dispatch(updateCurrentTime(formatTime()));

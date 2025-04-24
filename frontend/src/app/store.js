import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import adsReducer from '../features/ads/adsSlice';

export const store = configureStore({
  reducer: {
    auth:authReducer,
    ads : adsReducer
  },
});

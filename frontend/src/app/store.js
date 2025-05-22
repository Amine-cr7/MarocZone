import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import catReducer  from '../features/category/catSlice';
import adsReducer  from '../features/ads/adsSlice';
import adminReducer  from '../features/admin/adminSlice';

export const store = configureStore({
  reducer: {
    auth:authReducer,
    categories:catReducer,
    ads:adsReducer,
    admin:adminReducer,
  },
});

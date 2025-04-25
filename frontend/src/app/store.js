import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import catReducer  from '../features/category/catSlice';

export const store = configureStore({
  reducer: {
    auth:authReducer,
    categories:catReducer,
  },
});

import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Uses localStorage
import userReducer from './userSlice';

// Configure redux-persist for the user slice
const persistConfig = {
  key: 'user', // Key for localStorage
  storage,
};

const persistedUserReducer = persistReducer(persistConfig, userReducer);

// Create the Redux store
const store = configureStore({
  reducer: {
    user: persistedUserReducer,
  },
});

export const persistor = persistStore(store);

export default store;

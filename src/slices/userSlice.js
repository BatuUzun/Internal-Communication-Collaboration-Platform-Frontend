import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: null, // Add user ID to the state
  email: null,
  
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.id = action.payload.id; // Update user ID
      state.email = action.payload.email;
      
    },
    clearUser(state) {
      state.id = null;
      state.email = null;
      
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;

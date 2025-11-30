import { createSlice } from '@reduxjs/toolkit';
import { register, logIn, logOut, fetchCurrentUser } from './authOperations';

const initialState = {
  user: { name: null, email: null, userData: {} },
  token: null,
  isLoggedIn: false,
  isRefreshing: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Manuel resetlemek gerekirse diye
    resetAuth: (state) => {
      state.user = { name: null, email: null, userData: {} };
      state.token = null;
      state.isLoggedIn = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // --- REGISTER ---
      // DÜZELTME BURADA: (state, action) yerine sadece (state)
      .addCase(register.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // --- LOGIN ---
      .addCase(logIn.fulfilled, (state, action) => {
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
        state.isLoggedIn = true;
        state.error = null;
      })
      .addCase(logIn.rejected, (state, action) => {
        state.error = action.payload;
      })

      // --- LOGOUT ---
      .addCase(logOut.fulfilled, (state) => {
        state.user = { name: null, email: null, userData: {} };
        state.token = null;
        state.isLoggedIn = false;
        state.error = null;
      })
      .addCase(logOut.rejected, (state) => {
         state.user = { name: null, email: null, userData: {} };
         state.token = null;
         state.isLoggedIn = false;
      })
      // --- REFRESH USER ---
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload.data; // Kullanıcı verisini güncelle
        state.isLoggedIn = true;
      });
  },
});

export const { resetAuth } = authSlice.actions;
export const authReducer = authSlice.reducer;
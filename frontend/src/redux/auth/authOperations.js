import { createAsyncThunk } from '@reduxjs/toolkit';
import { instance, setToken, clearToken } from '../../services/api';

// 1. KAYIT OLMA (Register)
export const register = createAsyncThunk(
  'auth/register',
  async (credentials, thunkAPI) => {
    try {
      const { data } = await instance.post('/auth/register', credentials);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

// 2. GİRİŞ YAPMA (Login)
export const logIn = createAsyncThunk(
  'auth/login',
  async (credentials, thunkAPI) => {
    try {
      const { data } = await instance.post('/auth/login', credentials);
      setToken(data.data.token);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  }
);

// 3. ÇIKIŞ YAPMA (Logout)
export const logOut = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    await instance.post('/auth/logout');
    clearToken();
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// --- MEVCUT KULLANICIYI GETİR (Refresh) ---
export const fetchCurrentUser = createAsyncThunk(
  'auth/refresh',
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const persistedToken = state.auth.token;

    if (persistedToken === null) {
      return thunkAPI.rejectWithValue('Unable to fetch user');
    }

    try {
      setToken(persistedToken);
      const { data } = await instance.get('/auth/current');
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
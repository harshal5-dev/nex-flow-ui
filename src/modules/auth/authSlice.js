import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setAuthLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setAuthError: (state, action) => {
      state.error = action.payload;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
    clearCredentials: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
  },
});

export const {
  setCredentials,
  clearCredentials,
  setAuthLoading,
  setAuthError,
} = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsAuthLoading = (state) => state.auth.isLoading;
export const selectError = (state) => state.auth.error;

export default authSlice.reducer;

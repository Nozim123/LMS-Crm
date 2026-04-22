import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    accessToken: null,
    user: null,
    tenantId: null
  },
  reducers: {
    setSession: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      state.tenantId = action.payload.user?.tenantId || null;
    },
    logout: (state) => {
      state.accessToken = null;
      state.user = null;
      state.tenantId = null;
    }
  }
});

export const { setSession, logout } = authSlice.actions;
export default authSlice.reducer;

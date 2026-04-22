import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    accessToken: localStorage.getItem('accessToken'),
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    tenantId: localStorage.getItem('tenantId')
  },
  reducers: {
    setSession: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      state.tenantId = action.payload.user?.tenantId || null;
      localStorage.setItem('accessToken', action.payload.accessToken);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('tenantId', action.payload.user?.tenantId || '');
    },
    logout: (state) => {
      state.accessToken = null;
      state.user = null;
      state.tenantId = null;
      localStorage.clear();
    }
  }
});

export const { setSession, logout } = authSlice.actions;
export default authSlice.reducer;

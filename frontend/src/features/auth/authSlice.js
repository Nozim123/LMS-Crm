import { createSlice } from '@reduxjs/toolkit';

const savedUser = JSON.parse(localStorage.getItem('user') || 'null');

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    accessToken: localStorage.getItem('accessToken'),
    user: savedUser,
    tenantId: localStorage.getItem('tenantId'),
    roles: savedUser?.roles || [],
    activeRole: savedUser?.activeRole || null,
    hydrated: true
  },
  reducers: {
    setSession: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.user = action.payload.user;
      state.tenantId = action.payload.user?.tenantId || null;
      state.roles = action.payload.user?.roles || [];
      state.activeRole = action.payload.user?.activeRole || null;
      localStorage.setItem('accessToken', action.payload.accessToken);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('tenantId', action.payload.user?.tenantId || '');
    },
    setActiveRole: (state, action) => {
      state.activeRole = action.payload;
      state.user = { ...state.user, activeRole: action.payload };
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    logout: (state) => {
      state.accessToken = null;
      state.user = null;
      state.tenantId = null;
      state.roles = [];
      state.activeRole = null;
      localStorage.clear();
    }
  }
});

export const { setSession, setActiveRole, logout } = authSlice.actions;
export default authSlice.reducer;

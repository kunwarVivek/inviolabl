import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface userDetails {
  id: string;
  createdAt: string;
  updatedAt: string;
  firstName: string;
  lastName: string;
  tenantId: string;
  email: string;
  phone: string;
  role: string;
}

interface UserState {
  details: userDetails | null; 
}

const UserSlice = createSlice({
  name: 'user',
  initialState: {
    details: null as userDetails | null,
  } as UserState,

  reducers: {
    setUser: (state, action) => {
      state.details = action.payload;
    },
    clearUser: (state) => {
      state.details = null;
    },
    updateUserFromResponse: (state, action) => {
      state.details = action.payload;
    },
    
  },

  
  })



export const { setUser, clearUser, updateUserFromResponse } = UserSlice.actions;

export default UserSlice.reducer;



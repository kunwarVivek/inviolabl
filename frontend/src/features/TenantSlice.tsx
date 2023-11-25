import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface tenantDetails {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  domain: string;
  email: string;
  phone: string;
}

interface TenantState {
  details: tenantDetails; 
}

const initialTenantDetails: tenantDetails = {
  id: '',
  createdAt: '',
  updatedAt: '',
  name: '',
  domain: '',
  email: '',
  phone: '',
};

const TenantSlice = createSlice({
  name: 'tenant',
  initialState: {
    details: { ...initialTenantDetails },
  } as TenantState,

  reducers: {
    setTenant: (state, action) => {
      state.details = action.payload;
    },
    clearTenant: (state) => {
      state.details = null;
    },
    updateTenantFromResponse: (state, action) => {
      state.details = action.payload;
    },
    
  },

  
  })



export const { setTenant, clearTenant, updateTenantFromResponse } = TenantSlice.actions;

export default TenantSlice.reducer;





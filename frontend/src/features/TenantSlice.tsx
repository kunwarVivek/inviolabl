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
  details: tenantDetails | null; 
}

const TenantSlice = createSlice({
  name: 'tenant',
  initialState: {
    details: null as tenantDetails | null,
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


    // setTenant: (state, action: PayloadAction<Tenant>) => {
    //   state.currentTenant = action.payload;
    // },
    // clearTenant: (state) => {
    //   state.currentTenant = null;
    // },
    // updateTenantFromResponse: (state, action: PayloadAction<Tenant>) => {
    //   state.currentTenant = action.payload;
    // },
  

// export const { setTenant, clearTenant, updateTenantFromResponse } = TenantSlice.actions;


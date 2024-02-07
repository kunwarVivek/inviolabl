import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const PrivySlice = createSlice({
  name: 'privy',
  initialState: {
    account:""
  },

  reducers: {
    setAccount: (state, action) => {
      state.account = action.payload;
    },
    
  },

  
  })



export const { setAccount } = PrivySlice.actions;

export default PrivySlice.reducer;

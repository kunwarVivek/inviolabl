import { createSlice } from '@reduxjs/toolkit';

const SessionSlice = createSlice({
  name: 'Session',
  initialState: "",
  reducers: {
    setSession: (state, action) => {
      return action.payload;
    },
  },
});

export const { setSession } = SessionSlice.actions;

export default SessionSlice.reducer;

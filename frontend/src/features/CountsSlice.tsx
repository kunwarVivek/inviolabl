import { createSlice } from '@reduxjs/toolkit';

const CountsSlice = createSlice({
  name: 'Counts',
  initialState: [],
  reducers: {
    setCounts: (state, action) => {
      return action.payload;
    },
  },
});

export const { setCounts } = CountsSlice.actions;

export default CountsSlice.reducer;

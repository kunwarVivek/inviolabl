import { createSlice } from '@reduxjs/toolkit';

const FileInfoSlice = createSlice({
  name: 'FileInfo',
  initialState: [],
  reducers: {
    setFileInfoList: (state, action) => {
      return action.payload;
    },
  },
});

export const { setFileInfoList } = FileInfoSlice.actions;

export default FileInfoSlice.reducer;

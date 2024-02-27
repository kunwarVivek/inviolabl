import { createSlice } from '@reduxjs/toolkit';

const FileUploadCompleteSlice = createSlice({
  name: 'FileUploadComplete',
  initialState: {
    account: false,
  },
  reducers: {
    setFileUploadComplete: (state, action) => {
      state.account = action.payload;
    },
  },
});

export const { setFileUploadComplete } = FileUploadCompleteSlice.actions;

export default FileUploadCompleteSlice.reducer;

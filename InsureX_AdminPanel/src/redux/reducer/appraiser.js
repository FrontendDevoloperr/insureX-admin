import { createSlice } from "@reduxjs/toolkit";

export const appraiserSlice = createSlice({
  name: "appraiser",
  initialState: {
    appraiser: [],
    loading: false,
    error: null,
  },
  reducers: {
    getAppraiser: (state, action) => {
      state.appraiser = action.payload;
    },
  },
});
export const { getAppraiser } = appraiserSlice.actions;
export default appraiserSlice.reducer;

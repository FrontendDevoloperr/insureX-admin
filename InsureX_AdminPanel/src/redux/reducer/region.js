import { createSlice } from "@reduxjs/toolkit";

export const regionSlice = createSlice({
  name: "region",
  initialState: {
    region: [],
    loading: false,
    error: null,
  },
  reducers: {
    getRegion: (state, action) => {
      state.region = action.payload;
    },
  },
});
export const { getRegion } = regionSlice.actions;
export default regionSlice.reducer;

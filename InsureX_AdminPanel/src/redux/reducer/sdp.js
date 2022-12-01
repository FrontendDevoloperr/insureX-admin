import { createSlice } from "@reduxjs/toolkit";

export const sdpSlice = createSlice({
  name: "sdp",
  initialState: {
    sdp: [],
    loading: false,
    error: null,
  },
  reducers: {
    getSdp: (state, action) => {
      state.sdp = action.payload;
    },
  },
});
export const { getSdp } = sdpSlice.actions;
export default sdpSlice.reducer;

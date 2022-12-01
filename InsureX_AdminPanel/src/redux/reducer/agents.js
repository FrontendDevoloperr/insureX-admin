import { createSlice } from "@reduxjs/toolkit";

export const agentsSlice = createSlice({
  name: "agents",
  initialState: {
    agents: [],
    loading: false,
    error: null,
  },
  reducers: {
    getAgents: (state, action) => {
      state.agents = action.payload;
    },
  },
});
export const { getAgents } = agentsSlice.actions;
export default agentsSlice.reducer;

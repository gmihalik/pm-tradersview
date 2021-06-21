import { createSlice } from "@reduxjs/toolkit";

export const tradeSlice = createSlice({
  name: "trade",
  initialState: {
    value: {
      author: "",
      comment: "",
      trade: {
        action: "",
        underlying: "",
        expiration: "",
        strike: "",
        tradeType: ""
      }
    }
  },
  reducers: {
    setTrade: (state, action) => {
      state.value = action.payload;
    }
  }
});

export const { setTrade } = tradeSlice.actions;

export const selectTrade = (state) => state.trade.value;

export default tradeSlice.reducer;

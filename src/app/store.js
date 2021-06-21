import { configureStore } from "@reduxjs/toolkit";
import tradeReducer from "../features/trade/tradeSlice";

export default configureStore({
  reducer: {
    trade: tradeReducer
  }
});

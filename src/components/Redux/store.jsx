import { configureStore } from "@reduxjs/toolkit";
import watchlistReducer from "./watchListSlice";

const store = configureStore({
  reducer: {
    watchlist: watchlistReducer
  }
});

export default store;

import { createSlice } from "@reduxjs/toolkit";

const loadWatchlist = () => {
  const storedWatchlist = localStorage.getItem("watchlist");
  return storedWatchlist ? JSON.parse(storedWatchlist) : [];
};

const watchlistSlice = createSlice({
  name: "watchlist",
  initialState: loadWatchlist(), 
  reducers: {
    addToWatchlist: (state, action) => {
      if (!state.some(movie => movie.id === action.payload.id)) {
        const updatedState = [...state, action.payload];
        localStorage.setItem("watchlist", JSON.stringify(updatedState)); 
        return updatedState;
      }
    },
    removeFromWatchlist: (state, action) => {
      const updatedState = state.filter(movie => movie.id !== action.payload);
      localStorage.setItem("watchlist", JSON.stringify(updatedState));
      return updatedState;
    }
  }
});

export const { addToWatchlist, removeFromWatchlist } = watchlistSlice.actions;
export default watchlistSlice.reducer;

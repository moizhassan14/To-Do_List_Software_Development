// src/store/slice/theme/theme.slice.js
import { createSlice } from "@reduxjs/toolkit";

// Initial state for theme
const initialState = {
  mode: 'light', // 'light' or 'dark'
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    // Toggle between light and dark mode
    toggleTheme(state) {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
    // Set a specific theme mode
    setTheme(state, action) {
      const mode = action.payload;
      if (mode === 'light' || mode === 'dark') {
        state.mode = mode;
      }
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;

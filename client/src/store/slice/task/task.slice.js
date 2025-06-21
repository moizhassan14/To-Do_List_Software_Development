// File: client/src/store/slice/task/task.slice.js
import { createSlice } from "@reduxjs/toolkit";
import {
  createTaskThunk,
  getMyTasksThunk,
  updateTaskThunk,
  deleteTaskThunk,
  shareTaskThunk,
  reorderTasksThunk,
} from "./task.thunk";

// Initial state for the task slice
const initialState = {
  tasks: [],
  total: 0,
  page: 1,
  pages: 1,
  loading: false,
  buttonLoading: false,
  error: null,
  filter: "all", // 'all', 'active', 'completed'
  search: "",
  selectedTags: [],
};

// Create the task slice
const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    resetTaskState: () => initialState,
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setSelectedTags: (state, action) => {
      state.selectedTags = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTaskThunk.pending, (state) => {
        state.buttonLoading = true;
        state.error = null;
      })
      .addCase(createTaskThunk.fulfilled, (state, action) => {
        state.buttonLoading = false;
        state.tasks.unshift(action.payload);
      })
      .addCase(createTaskThunk.rejected, (state, action) => {
        state.buttonLoading = false;
        state.error = action.payload;
      })
      .addCase(getMyTasksThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getMyTasksThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.tasks;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(getMyTasksThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTaskThunk.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((task) => task._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(deleteTaskThunk.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task._id !== action.payload);
      })
      .addCase(shareTaskThunk.fulfilled, (state) => {
        state.buttonLoading = false;
      })
      .addCase(shareTaskThunk.rejected, (state, action) => {
        state.buttonLoading = false;
        state.error = action.payload;
      })
      .addCase(reorderTasksThunk.fulfilled, (state, action) => {
        state.tasks = action.payload;
      });
  },
});

// Export actions and reducer
export const { resetTaskState, setFilter, setSearch, setSelectedTags } = taskSlice.actions;
export default taskSlice.reducer;

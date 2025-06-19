import { createSlice } from "@reduxjs/toolkit";
import {
  loginUserThunk,
  registerUserThunk,
  logOutUserThunk,
  refreshTokenThunk,
  getUsersByRoleThunk,
  getOwnerDashboardThunk,
  getSharedDashboardThunk,
  assignUserRoleThunk,
} from "./user.thunk";

const initialState = {
  isAuthenticated: false,
  userProfile: null,
  owners: [],
  collaborators: [],
  buttonLoading: false,
  loading: false,
  screenLoading: true, // Start true to show spinner while refreshing token
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    resetUserState: () => initialState,
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginUserThunk.pending, (state) => {
      state.buttonLoading = true;
      state.error = null;
    });
    builder.addCase(loginUserThunk.fulfilled, (state, action) => {
      state.buttonLoading = false;
      if (action.payload.success) {
        state.userProfile = action.payload.user;
        state.isAuthenticated = true;
        state.screenLoading = false;
      }
    });
    builder.addCase(loginUserThunk.rejected, (state, action) => {
      state.buttonLoading = false;
      state.error = action.payload;
    });

    // Register
    builder.addCase(registerUserThunk.pending, (state) => {
      state.buttonLoading = true;
      state.error = null;
    });
    builder.addCase(registerUserThunk.fulfilled, (state, action) => {
      state.buttonLoading = false;
      if (action.payload.success) {
        state.userProfile = action.payload.user;
        state.isAuthenticated = true;
        state.screenLoading = false;
      }
    });
    builder.addCase(registerUserThunk.rejected, (state, action) => {
      state.buttonLoading = false;
      state.error = action.payload;
    });

    // Logout
    builder.addCase(logOutUserThunk.pending, (state) => {
      state.buttonLoading = true;
    });
    builder.addCase(logOutUserThunk.fulfilled, (state) => {
      state.buttonLoading = false;
      state.isAuthenticated = false;
      state.userProfile = null;
      state.owners = [];
      state.collaborators = [];
      state.screenLoading = false;
    });
    builder.addCase(logOutUserThunk.rejected, (state, action) => {
      state.buttonLoading = false;
      state.error = action.payload;
    });

    // Refresh Token (for initial load)
    builder.addCase(refreshTokenThunk.pending, (state) => {
      state.loading = true;
      state.screenLoading = true;
    });
    builder.addCase(refreshTokenThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.screenLoading = false;
      state.isAuthenticated = true;
      state.userProfile = action.payload.user; // Assuming backend returns user
    });
    builder.addCase(refreshTokenThunk.rejected, (state, action) => {
      state.loading = false;
      state.screenLoading = false;
      state.isAuthenticated = false;
      state.error = action.payload;
    });

    // Get Users By Role
    builder.addCase(getUsersByRoleThunk.pending, (state) => {
      state.screenLoading = true;
    });
    builder.addCase(getUsersByRoleThunk.fulfilled, (state, action) => {
      state.screenLoading = false;
      state.owners = action.payload.owners || [];
      state.collaborators = action.payload.collaborators || [];
    });
    builder.addCase(getUsersByRoleThunk.rejected, (state, action) => {
      state.screenLoading = false;
      state.error = action.payload;
    });

    // ✅ OWNER DASHBOARD
    builder.addCase(getOwnerDashboardThunk.fulfilled, (state, action) => {
      state.roleMessage = action.payload;
    });
    builder.addCase(getOwnerDashboardThunk.rejected, (state, action) => {
      state.roleMessage = action.payload;
    });

    // ✅ SHARED DASHBOARD
    builder.addCase(getSharedDashboardThunk.fulfilled, (state, action) => {
      state.roleMessage = action.payload;
    });
    builder.addCase(getSharedDashboardThunk.rejected, (state, action) => {
      state.roleMessage = action.payload;
    });
    //only owner assign roles
    builder.addCase(assignUserRoleThunk.pending, (state) => {
      state.buttonLoading = true;
      state.error = null;
    });

    builder.addCase(assignUserRoleThunk.fulfilled, (state, action) => {
      state.buttonLoading = false;

      const { userId, role } = action.payload;

      // Remove the user from both lists
      state.owners = state.owners.filter((user) => user._id !== userId);
      state.collaborators = state.collaborators.filter(
        (user) => user._id !== userId
      );

      // Reassign to the correct list (with minimal data or refresh later)
      const updatedUser = { _id: userId, role };

      if (role === "owner") {
        state.owners.push(updatedUser);
      } else {
        state.collaborators.push(updatedUser);
      }
    });

    builder.addCase(assignUserRoleThunk.rejected, (state, action) => {
      state.buttonLoading = false;
      state.error = action.payload;
    });
  },
});

export const { resetUserState } = userSlice.actions;

export default userSlice.reducer;

// src/features/client/clientSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { getDashboardThunk, uploadMealThunk } from "./clientThunks";

const initialState = {
  dashboard: null,          // Client dashboard data
  loading: false,           // Loading state for both dashboard & upload
  error: null,              // Error message (if any)
  uploadSuccess: false,     // Meal upload status
};

const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    resetUploadState(state) {
      state.uploadSuccess = false;
    },
    resetClientState() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      // ============================================================
      // ✅ FETCH DASHBOARD
      // ============================================================
      .addCase(getDashboardThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDashboardThunk.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload || {};

        // ✅ Normalize & structure dashboard response
        state.dashboard = {
          clientId: payload.clientId || payload.userId || payload.id || null,
          trainerId: payload.trainerId || null,
          clientName:
            payload.clientName ||
            payload.fullName ||
            payload.name ||
            "Client",
          currentStreakDays:
            payload.currentStreakDays ||
            payload.streakDays ||
            payload.currentStreak ||
            0,
          totalMacros: payload.totalMacros || {
            calories: 0,
            protein: 0,
            carbs: 0,
            fat: 0,
          },
          plannedMeals: payload.plannedMeals || [],
          meals: payload.meals || [],
        };

        state.error = null;
      })
      .addCase(getDashboardThunk.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to fetch client dashboard data";
      })

      // ============================================================
      // ✅ UPLOAD MEAL
      // ============================================================
      .addCase(uploadMealThunk.pending, (state) => {
        state.loading = true;
        state.uploadSuccess = false;
        state.error = null;
      })
      .addCase(uploadMealThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.uploadSuccess = true;

        // Optionally append new meal data into dashboard
        if (state.dashboard?.meals && action.payload) {
          state.dashboard.meals = [
            ...state.dashboard.meals,
            action.payload,
          ];
        }
      })
      .addCase(uploadMealThunk.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to upload meal image";
      });
  },
});

// ✅ Export actions
export const { clearError, resetUploadState, resetClientState } =
  clientSlice.actions;

// ✅ Export reducer
export default clientSlice.reducer;

// ============================================================
// ✅ SELECTORS
// ============================================================
export const selectClient = (state) => state.client;
export const selectDashboard = (state) => state.client.dashboard;
export const selectClientLoading = (state) => state.client.loading;
export const selectClientError = (state) => state.client.error;
export const selectUploadSuccess = (state) => state.client.uploadSuccess;

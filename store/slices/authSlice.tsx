/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IUserListItem, userService } from "@/services/user.service";
import { RootState } from "../store";



interface AuthState {
    me: IUserListItem | null;
    isLoading: boolean;
    initialized: boolean;
    error: string | null;
}

const initialState: AuthState = {
    me: null,
    isLoading: false,
    initialized: false,
    error: null,
};

export const fetchMe = createAsyncThunk<
    { user: IUserListItem },
    void,
    { rejectValue: string }
>(
    "auth/fetchMe",
    async (_, { rejectWithValue }) => {
        try {
            console.log("fetchMe called");
            const data = await userService.me();

            // If your service returns { data: user }
            return data.data;

            // If it returns the user directly, use:
            // return data;
        } catch (error: any) {
            return rejectWithValue(
                error?.response?.data?.message || "Failed to fetch user."
            );
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        clearAuth(state) {
            state.me = null;
            state.error = null;
        },

        clearAuthError(state) {
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchMe.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })

            .addCase(fetchMe.fulfilled, (state, action) => {
                state.isLoading = false;
                state.initialized = true;
                state.me = action.payload.user;
            })

            .addCase(fetchMe.rejected, (state, action) => {
                state.isLoading = false;
                state.initialized = true;
                state.me = null;
                state.error =
                    action.payload ?? "Something went wrong.";
            });
    },
});

export const { clearAuth, clearAuthError } = authSlice.actions;
export const selectMeSlice = (state: RootState) => state.authSlice
export default authSlice.reducer;
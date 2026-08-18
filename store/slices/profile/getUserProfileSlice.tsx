/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/store/store';
import { IProfile, profileService } from '@/services/profile.service';

interface UserProfileState {
    profile: IProfile | null;
    isLoading: boolean;
    isError: boolean;
    errorMessage: string | null;
}

const initialState: UserProfileState = {
    profile: null,
    isLoading: false,
    isError: false,
    errorMessage: null,
};

// Async Thunk
export const fetchUserProfileById = createAsyncThunk(
    'userProfile/fetchUserProfileById',
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await profileService.getUserProfileById(userId);
            return response.data.profile;
        } catch (error: any) {
            return rejectWithValue(error?.message || 'Failed to fetch user profile');
        }
    }
);

// User Profile Slice
export const userProfileSlice = createSlice({
    name: 'userProfile',
    initialState,
    reducers: {
        clearUserProfile: (state) => {
            state.profile = null;
            state.isError = false;
            state.errorMessage = null;
        },
        clearUserProfileError: (state) => {
            state.isError = false;
            state.errorMessage = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserProfileById.pending, (state) => {
                state.isLoading = true;
                state.isError = false;
                state.errorMessage = null;
            })
            .addCase(fetchUserProfileById.fulfilled, (state, action: PayloadAction<IProfile>) => {
                state.isLoading = false;
                state.profile = action.payload;
            })
            .addCase(fetchUserProfileById.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.errorMessage = action.payload as string;
            });
    },
});

export const { clearUserProfile, clearUserProfileError } = userProfileSlice.actions;

// Selectors
export const selectUserProfileSlice = (state: RootState) => state.userProfileSlice;

export default userProfileSlice.reducer;
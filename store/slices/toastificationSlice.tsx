import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export type IToastificationType =
    | "success"
    | "error"
    | "warning"
    | "info";

export interface IToastification {
    id?: string;
    type: IToastificationType;
    title?: string;
    message: string;
    duration?: number;
}

export interface IToastificationOptions {
    title?: string;
    duration?: number;
}

interface IInitialState {
    toastifications: IToastification[];
}

const initialState: IInitialState = {
    toastifications: [],
};

const toastificationSlice = createSlice({
    name: "toastificationSlice",

    initialState,

    reducers: {
        toastify: (
            state,
            action: PayloadAction<IToastification>
        ) => {
            const id = crypto.randomUUID;
            state.toastifications.push({ ...action.payload, id: String(id) });
        },

        removeToastify: (
            state,
            action: PayloadAction<{ id: string }>
        ) => {
            state.toastifications =
                state.toastifications.filter(
                    (toast) =>
                        toast.id !== action.payload.id
                );
        },

        clearToastifications: (state) => {
            state.toastifications = [];
        },
    },
});

export const {
    toastify,
    removeToastify,
    clearToastifications,
} = toastificationSlice.actions;

export const selectToastificationSlice = (
    state: RootState
) => state.toastificationSlice.toastifications;

export default toastificationSlice.reducer;
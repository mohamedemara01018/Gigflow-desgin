import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface SocketState {
    isConnected: boolean;
    socketId: string | null;
}

const initialState: SocketState = {
    isConnected: false,
    socketId: null,
};

const socketSlice = createSlice({
    name: "socket",
    initialState,
    reducers: {
        socketConnected: (
            state,
            action: PayloadAction<string>
        ) => {
            state.isConnected = true;
            state.socketId = action.payload;
        },

        socketDisconnected: (state) => {
            state.isConnected = false;
            state.socketId = null;
        },
    },
});

export const {
    socketConnected,
    socketDisconnected,
} = socketSlice.actions;


export const selectSocketSlice = (state: RootState) => state.socketSlice
export default socketSlice.reducer;
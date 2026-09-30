import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface SocketState {
    isConnected: boolean;
    socketId: string | null;
    onlineUsers: Record<string, boolean>;
}

const initialState: SocketState = {
    isConnected: false,
    socketId: null,
    onlineUsers: {},
};

const socketSlice = createSlice({
    name: "socket",
    initialState,
    reducers: {
        socketConnected: (state, action: PayloadAction<string>) => {
            state.isConnected = true;
            state.socketId = action.payload;
        },

        socketDisconnected: (state) => {
            state.isConnected = false;
            state.socketId = null;
        },

        userOnline: (state, action: PayloadAction<{ userId: string } | string>) => {
            const userId =
                typeof action.payload === "string" ? action.payload : action.payload.userId;
            if (userId) {
                state.onlineUsers[userId] = true;
            }
        },

        userOffline: (state, action: PayloadAction<{ userId: string } | string>) => {
            const userId =
                typeof action.payload === "string" ? action.payload : action.payload.userId;
            if (userId) {
                state.onlineUsers[userId] = false;
            }
        },

        setUsersPresence: (state, action: PayloadAction<Record<string, boolean>>) => {
            state.onlineUsers = {
                ...state.onlineUsers,
                ...action.payload,
            };
        },

        setOnlineUserIds: (state, action: PayloadAction<string[]>) => {
            const newMap: Record<string, boolean> = { ...state.onlineUsers };
            action.payload.forEach((uid) => {
                if (uid) newMap[uid] = true;
            });
            state.onlineUsers = newMap;
        },
    },
});

export const {
    socketConnected,
    socketDisconnected,
    userOnline,
    userOffline,
    setUsersPresence,
    setOnlineUserIds,
} = socketSlice.actions;

export const selectSocketSlice = (state: RootState) => state.socketSlice;
export const selectOnlineUsers = (state: RootState) => state.socketSlice.onlineUsers;

export default socketSlice.reducer;
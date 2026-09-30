"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    socketConnected,
    socketDisconnected,
    userOnline,
    userOffline,
    setOnlineUserIds,
    setUsersPresence,
} from "@/store/slices/socketSlice";

import { socket } from "@/utils/socket";
import { selectMeSlice } from "@/store/slices/auth/authSlice";

export default function SocketProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const dispatch = useDispatch();
    const { me } = useSelector(selectMeSlice);

    useEffect(() => {
        socket.connect();

        const handleConnect = () => {
            console.log("Socket connected:", socket.id);
            dispatch(socketConnected(String(socket.id)));

            if (me?._id) {
                socket.emit("join", me._id);
            }
        };

        const handleDisconnect = () => {
            console.log("Socket disconnected");
            dispatch(socketDisconnected());
        };

        const handleUserOnline = (data: { userId: string } | string) => {
            dispatch(userOnline(data));
        };

        const handleUserOffline = (data: { userId: string } | string) => {
            dispatch(userOffline(data));
        };

        const handlePresenceState = (data: { onlineUserIds: string[] }) => {
            if (data?.onlineUserIds) {
                dispatch(setOnlineUserIds(data.onlineUserIds));
            }
        };

        const handleConversationPresence = (data: { presence: Record<string, boolean> }) => {
            if (data?.presence) {
                dispatch(setUsersPresence(data.presence));
            }
        };

        const handlePresenceResponse = (data: { presence: Record<string, boolean> }) => {
            if (data?.presence) {
                dispatch(setUsersPresence(data.presence));
            }
        };

        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);
        socket.on("user_online", handleUserOnline);
        socket.on("user_offline", handleUserOffline);
        socket.on("presence_state", handlePresenceState);
        socket.on("conversation_presence", handleConversationPresence);
        socket.on("presence_response", handlePresenceResponse);

        return () => {
            socket.off("connect", handleConnect);
            socket.off("disconnect", handleDisconnect);
            socket.off("user_online", handleUserOnline);
            socket.off("user_offline", handleUserOffline);
            socket.off("presence_state", handlePresenceState);
            socket.off("conversation_presence", handleConversationPresence);
            socket.off("presence_response", handlePresenceResponse);

            socket.disconnect();
        };
    }, [dispatch, me?._id]);

    return children;
}
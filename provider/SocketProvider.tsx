"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    socketConnected,
    socketDisconnected,
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
            console.log("Connected:", socket.id);

            dispatch(
                socketConnected(String(socket.id))
            );

            if (me?._id) {
                socket.emit("join", me._id);

                console.log(
                    `Joined room: user:${me._id}`
                );
            }
        };

        const handleDisconnect = () => {
            console.log("Disconnected");

            dispatch(socketDisconnected());
        };



        socket.on("connect", handleConnect);

        socket.on(
            "disconnect",
            handleDisconnect
        );

        return () => {
            socket.off("connect", handleConnect);
            socket.off(
                "disconnect",
                handleDisconnect
            );

            socket.disconnect();
        };
    }, [dispatch, me?._id]);

    return children;
}
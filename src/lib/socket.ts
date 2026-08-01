"use client";

import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (accessToken: string): Socket => {
    if (!socket) {
        socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
            autoConnect: false,
            transports: ["websocket"],
            auth: {
                token: accessToken,
            },
        });
    }

    return socket;
};
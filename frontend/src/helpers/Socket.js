import React from 'react';
import io from "socket.io-client";
import { getSessionCookie } from './Cookie';

export const updateArray = new Map();

export function connectSocket() {
    return io.connect(process.env.REACT_APP_API_URL, {
        reconnection: true,
        reconnectionDelayMax: 5000,
        transports: ["websocket"], 
        upgrade: false,
        auth: { token: getSessionCookie()?.accessToken }
    });
}

export const SocketContext = React.createContext({
    clientSocket: null,
    setClientSocket: (socket) => {}
});
import React, { useContext, useState } from "react";
import SocketContext from "./SocketContext";
import { io } from 'socket.io-client';


const SocketState = (props) => {
    const apiUrl = import.meta.env.VITE_Backend_URL;
    const [socket, setSocket] = useState(null);
    
    // Fetch user
    const creteSocket = async () => {
        const newSocket = io('http://localhost:8080');
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        }
    };

    return (
        <SocketContext.Provider value={{ socket, creteSocket }}>
            {props.children}
        </SocketContext.Provider>
    )
}

export default SocketState;

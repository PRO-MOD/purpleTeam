import React, { useContext, useState } from "react";
import SocketContext from "./SocketContext";
import { io } from 'socket.io-client';


const SocketState = (props) => {
    const apiUrl = import.meta.env.VITE_Backend_URL;
    const [socket, setSocket] = useState(null);
    const [unreadMessages, setUnreadMessages] = useState(null);
    
    // Fetch user
    const creteSocket = async () => {
        const newSocket = io('http://localhost:8080');
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        }
    };

    const fetchUnreadMessages = async () => {
        try {
          const response = await fetch(`${apiUrl}/api/chat/unread-messages`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Auth-token": localStorage.getItem('Hactify-Auth-token')
            },
          });
          const userData = await response.json();
          setUnreadMessages(userData);
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      };

    return (
        <SocketContext.Provider value={{ socket, creteSocket, unreadMessages, fetchUnreadMessages }}>
            {props.children}
        </SocketContext.Provider>
    )
}

export default SocketState;

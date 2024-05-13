import React, { useState, useEffect } from "react";
import SocketContext from "./SocketContext";
import { io } from 'socket.io-client';
import Notification from '/notification.mp3'


const SocketState = (props) => {
  const apiUrl = import.meta.env.VITE_Backend_URL;
  const [socket, setSocket] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState(null);
  const [userId, setUserId] = useState();
  const [messages, setMessages] = useState([]);

  // Fetch user
  const creteSocket = async (userID) => {
    const newSocket = io('https://internship-project-gj6x.onrender.com');
    setSocket(newSocket);
    setUserId(userID);
    console.log("userId: >> "+userId+" userID: >> "+userID);
    newSocket.emit('addUser', userID);
    return () => {
      newSocket.disconnect();
    }
  };

  // Handle events after socket connection is established
  useEffect(() => {
    if (socket) {
      // Emit 'addUser' event when the socket is created

      // Listen for 'getUsers' event
      socket.on('getUsers', users => {
        console.log("Active Users :>> ", users);
      });
    }
  }, [socket]);

  useEffect(() => {

    socket?.on('getMessage', message => {
        if (!window.location.href.includes('/chat')) {
            // Play notification sound
            playNotificationSound();
            fetchUnreadMessages();
        }
        else {
            // playNotificationSound();
            const timestamp = new Date();
            const messageWithTimestamp = { ...message, timestamp };
            setMessages(prevMessages => [...prevMessages, messageWithTimestamp]);
            fetchUnreadMessagesByUser();
            fetchUnreadMessages();
        }
    });
    fetchUnreadMessages();

}, [socket]);

const playNotificationSound = () => {
    // Play notification sound
    console.log("heel notification");
    const notificationSound = new Audio(Notification);
    notificationSound.play();
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

  const [unreadCounts, setUnreadCounts] = useState({});
  // Function to fetch unread messages counts by user ID
  const fetchUnreadMessagesByUser = async () => {
      try {
          const response = await fetch(`${apiUrl}/api/chat/unread-messages-users`, {
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
                  "Auth-token": localStorage.getItem('Hactify-Auth-token') // Assuming you have a token stored in localStorage
              }
          });
          const data = await response.json();
          setUnreadCounts(data.unreadMessagesByUser);
      } catch (error) {
          console.error('Error fetching unread messages by user:', error);
          return 0; // Return 0 in case of an error
      }
  };


  useEffect(() => {
    // creteSocket();
    fetchUnreadMessages();
  }, []);

  return (
    <SocketContext.Provider value={{ socket, creteSocket, unreadMessages, fetchUnreadMessages, messages, setMessages, unreadCounts, fetchUnreadMessagesByUser }}>
      {props.children}
    </SocketContext.Provider>
  )
}

export default SocketState;

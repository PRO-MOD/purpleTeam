import React, { useState, useEffect } from "react";
import SocketContext from "./SocketContext";
import { io } from 'socket.io-client';
import Notification from '/notification.mp3'
import Modal from "../components/ChallengeSolvedModal";


const SocketState = (props) => {
  const apiUrl = import.meta.env.VITE_Backend_URL;
  const [socket, setSocket] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState(null);
  const [userId, setUserId] = useState();
  const [messages, setMessages] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false); // State for modal visibility
  const [challenge, setChallenge] = useState(''); // State for challenge name
  const [timeoutId, setTimeoutId] = useState(null);
  const [submissions, setSubmissions] = useState([]);

  


  // Fetch user
  const creteSocket = async (userID) => {
    const newSocket = io(`${apiUrl}:8080`); // || 'http://15.206.26.38:8080/'
    setSocket(newSocket);
    setUserId(userID);
    console.log("userId: >> " + userId + " userID: >> " + userID);
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

    socket?.on('challengeSolved', (data) => {
      console.log('Challenge solved:', data);
      setChallenge(data.challenge);
      setModalIsOpen(true);

      // Clear any existing timeout
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // Set a new timeout to clear the challenge and close the modal after 10 seconds
      const newTimeoutId = setTimeout(() => {
        setChallenge('');
        setModalIsOpen(false);
      }, 10000);

      setTimeoutId(newTimeoutId);
      fetchSubmissions();
    });

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

    // Clean up timeout on component unmount
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
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

  const fetchSubmissions = async () => {
    fetch(`${apiUrl}/api/challenge/challengesubmissions`, {
      headers: {
          "Auth-token": localStorage.getItem('Hactify-Auth-token'),
          'Content-Type': 'application/json',
      }
  })
      .then(response => {
          if (!response.ok) {
              throw new Error('Failed to fetch submissions');
          }
          return response.json();
      })
      .then(data => {
          // Sort submissions by date in descending order
          const sortedSubmissions = data.sort((a, b) => new Date(b.date) - new Date(a.date));
          setSubmissions(sortedSubmissions);
      })
      .catch(error => {
          console.error('Error fetching submissions:', error);
      });
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
    <SocketContext.Provider value={{ socket, creteSocket, unreadMessages, fetchUnreadMessages, messages, setMessages, unreadCounts, submissions, fetchUnreadMessagesByUser, challenge, fetchSubmissions }}>
      {modalIsOpen && <p className="bg-red-500 text-white text-center w-full py-2 absolute left-[13%] ps-4 z-10">Red Team Captured {challenge}</p>}
      {/* <p className="bg-red-500 text-white w-full py-2 text-center absolute left-[13%] ps-4">Red Team Captured</p> */}
      {props.children}
    </SocketContext.Provider>
  )
}

export default SocketState;

import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, MessageBox } from 'react-chat-elements';
import AuthContext from '../../context/AuthContext';
import ChatInput from './ChatInput';



import { io } from 'socket.io-client'

function ChatWindow() {
    const { userId } = useParams();
    const [userInfo, setUserInfo] = useState(null);
    const [messages, setMessages] = useState([]);
    const context = useContext(AuthContext);
    const { user, fetchUserRole } = context;
    const [error, setError] = useState(null);
    const messageRef = useRef(null);


    // console.log(messages);

    const [socket, setSocket] = useState(null)

    useEffect(() => {
        const newSocket = io('http://localhost:8080');
        setSocket(newSocket);

        // Clean up function to disconnect the socket when the component unmounts
        return () => {
            newSocket.disconnect();
        }
    }, [])

    useEffect(() => {
        fetchUserRole();
        socket?.emit('addUser', user._id);
        socket?.on('getUsers', users => {
            console.log("Active Users :>> ", users);
        }); //on se receive karte hai

        socket?.on('getMessage', message => {
            console.log('Received message:', message);
            const timestamp = new Date(); // Get the current timestamp
            const messageWithTimestamp = { ...message, timestamp }; // Add the timestamp to the message
            setMessages(prevMessages => [...prevMessages, messageWithTimestamp]);
        });



    }, [socket])

    useEffect(() => {
        messageRef?.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])


    useEffect(() => {
        const getUserRole = async () => {
            try {
                await fetchUserRole();
            } catch (error) {
                setError('Error fetching user role');
            }
        };
        getUserRole();
    }, []);

    useEffect(() => {
        // Fetch user information for the selected user
        fetchUserInfo(userId);

        // Fetch messages between logged-in user and selected user
        fetchMessages(userId);
    }, [userId]);

    const fetchUserInfo = async (userId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/auth/${userId}`, {
                method: 'GET'
            });
            const userData = await response.json();
            setUserInfo(userData);
        } catch (error) {
            console.error('Error fetching user information:', error);
        }
    };

    const fetchMessages = async (userId) => {
        try {
            // Fetch messages between logged-in user and selected user
            // here userId is nothing but the recipientId
            const response = await fetch(`http://localhost:5000/api/chat/messages/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "Auth-token": localStorage.getItem('Hactify-Auth-token')
                }
            });
            const messageData = await response.json();
            // console.log(messageData);
            setMessages(messageData);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const isLoggedInUserMsg = (messageSender) => {
        // Check if the message sender is the logged-in user
        return messageSender === user._id; // Assuming userId is stored in localStorage
    };

    const imageDataToBase64URL = (imageData) => {
        // Check if the image data contains the Cloudinary domain
        if (imageData && typeof imageData === 'object') {
            return imageData.url; // Return the URL directly if it's already in base64 format
        } else {
            // Handle other cases or formats if needed
            // For now, assuming it's already in the desired format, return it as is
            return imageData;
        }
    };
    
    

    return (
        <div className='flex flex-col h-screen'>
            {/* Profile View */}
            <div className="flex flex-row items-center h-[50px] bg-white m-4 rounded-full ">
                {/* Display user information */}
                {userInfo && (
                    <>
                        <Avatar className='mx-4 rounded-full'
                            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" // Assuming avatar is included in user information
                            alt={userInfo.name}
                            size="large"
                            type="rounded"
                        />
                        <div className="flex flex-col">
                            <h1>{userInfo.name}</h1>
                            <h1>{userInfo.email}</h1>
                        </div>
                    </>
                )}
            </div>
            {/* Main content */}
            <div className="flex-1 overflow-y-auto">
                {/* Display messages */}
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">No message to Display</h2>
                        <p className="text-gray-600">Start a conversation</p>
                    </div>
                ) : (
                    messages.map((message, index) => (
                        <>
                            <div key={index}>
                                <MessageBox
                                    position={isLoggedInUserMsg(message.sender) ? 'right' : 'left'}
                                    title={isLoggedInUserMsg(message.sender) ? 'You' : userInfo?.name || 'Unknown'}
                                    type='text'
                                    text={message.content}
                                    date={new Date(message.timestamp)}
                                    styles={{ maxWidth: '50%' }}
                                />
                            </div>
                            {message.images && message.images.map((imageData, index) => (
                                <MessageBox
                                    key={index}
                                    position={isLoggedInUserMsg(message.sender) ? 'right' : 'left'}
                                    type={"photo"}
                                    title={isLoggedInUserMsg(message.sender) ? 'You' : userInfo?.name || 'Unknown'}
                                    data={{
                                        uri: imageDataToBase64URL(imageData), // Convert image data to base64 URL
                                    }}
                                    date={new Date(message.timestamp)}
                                    styles={{ maxWidth: '50%' }}
                                />
                            ))}

                            <div ref={messageRef}></div>
                        </>
                    ))
                )}

            </div>

            {/* Messaging input */}
            <ChatInput recipientId={userId} fetchMessages={fetchMessages} socket={socket} userId={user._id} />
        </div>
    )
}

export default ChatWindow;

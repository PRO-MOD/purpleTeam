import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, MessageBox } from 'react-chat-elements';
import AuthContext from '../../context/AuthContext';
import ChatInput from './ChatInput';



function ChatWindow() {
    const { userId } = useParams();
    const [userInfo, setUserInfo] = useState(null);
    const [messages, setMessages] = useState([]);
    const context = useContext(AuthContext);
    const { user, fetchUserRole } = context;
    const [error, setError] = useState(null);

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
                {messages.map((message, index) => (
                    <MessageBox
                        key={index}
                        position={isLoggedInUserMsg(message.sender) ? 'right' : 'left'}
                        title={isLoggedInUserMsg(message.sender) ? 'You' : userInfo.name}
                        type='text'
                        text={message.content}
                        date={new Date(message.timestamp)}
                        styles={{maxWidth: '50%'}}
                    />
                ))}
            </div>

            {/* Messaging input */}
            <ChatInput recipientId={userId} fetchMessages={fetchMessages}/>
        </div>
    )
}

export default ChatWindow;

import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, MessageBox } from 'react-chat-elements';
import AuthContext from '../../context/AuthContext';
import SocketContext from '../../context/SocketContext';
import ChatInput from './ChatInput';
import { io } from 'socket.io-client';

function ChatWindow() {
    const apiUrl = import.meta.env.VITE_Backend_URL;
    const { userId } = useParams();
    const [userInfo, setUserInfo] = useState(null);
    const [messages, setMessages] = useState([]);

    // import all context 
    const { user, fetchUserRole } = useContext(AuthContext);
    const { socket } = useContext(SocketContext);


    const [error, setError] = useState(null);
    const messageRef = useRef(null);
    // const [socket, setSocket] = useState(null);
    // State to manage the visibility of the image modal
    const [showImageModal, setShowImageModal] = useState(false);
    // State to keep track of the selected image URI
    const [selectedImageUri, setSelectedImageUri] = useState('');

    // Function to handle image click and open the modal
    const handleImageClick = (imageUri) => {
        setSelectedImageUri(imageUri);
        setShowImageModal(true);
    };

    // Function to close the modal
    const handleCloseModal = () => {
        setShowImageModal(false);
    };

    useEffect(() => {
        // const newSocket = io('http://localhost:8080');
        // setSocket(newSocket);

        // return () => {
        //     newSocket.disconnect();
        // }
        // creteSocket();
    }, []);

    useEffect(() => {
        const fetchData = () => {
            fetchUserRole().then(() => {
                // After fetching user role, emit 'addUser' event and set up socket listeners
                socket?.emit('addUser', user._id);

                socket?.on('getUsers', users => {
                    console.log("Active Users :>> ", users);
                });

                // socket?.on('getMessage', message => {
                //     const timestamp = new Date();
                //     const messageWithTimestamp = { ...message, timestamp };
                //     setMessages(prevMessages => [...prevMessages, messageWithTimestamp]);
                // });
            }).catch(error => {
                setError('Error fetching user role');
            });
        };

        fetchData();
    }, [socket, user._id]);

    useEffect(() => {

        socket?.on('getMessage', message => {
            const timestamp = new Date();
            const messageWithTimestamp = { ...message, timestamp };
            setMessages(prevMessages => [...prevMessages, messageWithTimestamp]);
        });

        
    }, [socket]);


    useEffect(() => {
        messageRef?.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

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
        fetchUserInfo(userId);
        fetchMessages(userId);
    }, [userId]);

    const fetchUserInfo = async (userId) => {
        try {
            const response = await fetch(`${apiUrl}/api/auth/${userId}`, {
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
            const response = await fetch(`${apiUrl}/api/chat/messages/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "Auth-token": localStorage.getItem('Hactify-Auth-token')
                }
            });
            const messageData = await response.json();
            setMessages(messageData);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const isLoggedInUserMsg = (messageSender) => {
        return messageSender === user._id;
    };

    const imageDataToBase64URL = (imageData) => {
        if (imageData && typeof imageData === 'object') {
            return imageData.url;
        } else {
            return imageData;
        }
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const timeString = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
        return timeString;
    };

    const groupMessagesByDate = (messages) => {
        const groupedMessages = [];
        let currentDate = null;
        let currentGroup = null;

        messages.forEach(message => {
            const messageDate = new Date(message.timestamp).toDateString();
            if (messageDate !== currentDate) {
                currentDate = messageDate;
                currentGroup = { date: currentDate, messages: [] };
                groupedMessages.push(currentGroup);
            }
            currentGroup.messages.push(message);
        });
        console.log(groupedMessages);

        return groupedMessages;
    };

    return (
        <div className='flex flex-col h-screen' style={{ backgroundImage: "url('https://res.cloudinary.com/practicaldev/image/fetch/s--WAKqnINn--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://thepracticaldev.s3.amazonaws.com/i/tw0nawnvo0zpgm5nx4fp.png')" }}>
            <div className="flex flex-row items-center h-[50px] bg-white m-4 rounded-full ">
                {userInfo && (
                    <>
                        <Avatar className='mx-4 rounded-full border-2'
                            src={userInfo.profile || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                            alt={userInfo.name}
                            size="large"
                        // type="rounded"
                        />
                        <div className="flex flex-col">
                            <h1>{userInfo.name}</h1>
                            <h1>{userInfo.role == "BT" ? "Blue Team" : userInfo.role == "WT" ? "White Team" : ""}</h1>
                        </div>
                    </>
                )}
            </div>
            <div className="flex-1 overflow-y-auto" >
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">No message to Display</h2>
                        <p className="text-gray-600">Start a conversation</p>
                    </div>
                ) : (
                    groupMessagesByDate(messages).map((group, index) => (
                        <div key={index}>
                            <h3 className="text-gray-600 text-center my-4"> <span className='border-2 px-2 bg-gray-200 rounded-lg shadow-lg'>{group.date}</span></h3>
                            {group.messages.map((message, index) => (
                                <div key={index}>
                                    {
                                        !(message.content.length === 0) &&
                                        <MessageBox
                                            position={isLoggedInUserMsg(message.sender) ? 'right' : 'left'}
                                            title={isLoggedInUserMsg(message.sender) ? 'You' : userInfo?.name || 'Unknown'}
                                            type='text'
                                            text={message.content}
                                            date={new Date(message.timestamp)}
                                            dateString={formatDate(message.timestamp)}
                                            styles={{ maxWidth: '50%' }}
                                        />

                                    }
                                    {message.images && message.images.map((imageData, index) => (
                                        <MessageBox
                                            key={index}
                                            position={isLoggedInUserMsg(message.sender) ? 'right' : 'left'}
                                            type={"photo"}
                                            title={isLoggedInUserMsg(message.sender) ? 'You' : userInfo?.name || 'Unknown'}
                                            data={{
                                                uri: imageDataToBase64URL(imageData),
                                            }}
                                            date={new Date(message.timestamp)}
                                            dateString={formatDate(message.timestamp)}
                                            styles={{ maxWidth: '50%' }}
                                            onClick={() => handleImageClick(imageDataToBase64URL(imageData))}
                                        />
                                    ))}
                                </div>
                            ))}
                        </div>
                    ))
                )}
                <div ref={messageRef}></div>
            </div>
            <ChatInput recipientId={userId} fetchMessages={fetchMessages} socket={socket} userId={user._id} />
            {showImageModal && (
                <div className="fixed  top-1/4 left-1/4 w-1/2 h-1/2 flex items-center justify-center z-50">
                    <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 z-10"></div>
                    <div className="bg-white p-4 rounded-md relative z-20">
                        <img src={selectedImageUri} alt="Selected" className="max-h-full max-w-full" />
                        <button onClick={handleCloseModal} className="absolute top-2 right-2 text-gray-700 hover:text-gray-900">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

            )}
        </div>
    )
}

export default ChatWindow;

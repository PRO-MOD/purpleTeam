import React, { useState, useEffect, useContext } from 'react';
import { ChatItem } from "react-chat-elements";
import { useNavigate } from "react-router-dom";
import SocketContext from '../../context/SocketContext';
import "../../App.css"

function ChatLists({ position }) {
    const apiUrl = import.meta.env.VITE_Backend_URL;
    const [conversations, setConversations] = useState([]);
    const [volunteers, setVolunteers] = useState([]);
    const navigate = useNavigate();

    // import all context
    const { unreadMessages, fetchUnreadMessages } = useContext(SocketContext);

    useEffect(() => {
        if (position === 'left') {
            fetchConversations();
        } else if (position === 'right') {
            fetchVolunteers();
        }
    }, [position]);

    const fetchConversations = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/chat/conversations`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "Auth-token": localStorage.getItem('Hactify-Auth-token') // Assuming you have a token stored in localStorage
                }
            });
            const data = await response.json();
            console.log(conversations);
            data.sort((a, b) => new Date(b.latestMessageDate) - new Date(a.latestMessageDate));
            setConversations(data);
        } catch (error) {
            console.error('Error fetching conversations:', error);
        }
    };

    const fetchVolunteers = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/auth/getallVolunteer`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "Auth-token": localStorage.getItem('Hactify-Auth-token') // Assuming you have a token stored in localStorage
                }
            });
            const data = await response.json();
            setVolunteers(data);
        } catch (error) {
            console.error('Error fetching volunteers:', error);
        }
    };

    const handleChatItemClick = async (recipientId) => {
        navigate(`/chat/${recipientId}`);
        await fetchUnreadMessages();
    };

    return (
        <div className="flex flex-col max-h-screen">
            {position === 'left' && conversations.map((conversation, index) => (
                <ChatItem
                    key={index}
                    avatar={conversation.recipient.profile || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"}
                    alt={conversation.recipient.name}
                    title={conversation.recipient.name}
                    subtitle={conversation.latestMessageContent}
                    date={new Date(conversation.latestMessageDate)}
                    unread={conversation.unreadCount}
                    onClick={() => handleChatItemClick(conversation.recipient._id)}
                />
            ))}
            {
                position === 'right' && (
                    <>
                    <h1 className='p-4 bg-white'>Start Conversation...</h1>
                    <hr />
                    </>
                )
            }
            {position === 'right' && volunteers.map((volunteer, index) => (
                <ChatItem
                    key={index}
                    avatar="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                    alt={volunteer.name}
                    title={volunteer.name}
                    onClick={() => handleChatItemClick(volunteer._id)}
                />
            ))}
        </div>
    );
}

export default ChatLists;

import React, { useState, useEffect } from 'react';
import { ChatItem } from "react-chat-elements";
import { useNavigate } from "react-router-dom";
import "../../App.css"

function ChatLists({ position }) {
    const [conversations, setConversations] = useState([]);
    const [volunteers, setVolunteers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (position === 'left') {
            fetchConversations();
        } else if (position === 'right') {
            fetchVolunteers();
        }
    }, [position]);

    const fetchConversations = async () => {
        try {
            const response = await fetch('http://13.233.214.116:5000/api/chat/conversations', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    "Auth-token": localStorage.getItem('Hactify-Auth-token') // Assuming you have a token stored in localStorage
                }
            });
            const data = await response.json();
            console.log(conversations);
            setConversations(data);
        } catch (error) {
            console.error('Error fetching conversations:', error);
        }
    };

    const fetchVolunteers = async () => {
        try {
            const response = await fetch('http://13.233.214.116:5000/api/auth/getallVolunteer', {
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

    const handleChatItemClick = (recipientId) => {
        navigate(`/chat/${recipientId}`);
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
                    <h1 className='p-4 bg-white'>Start Conversation with Volunteers...</h1>
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

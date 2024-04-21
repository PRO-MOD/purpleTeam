import React from 'react';
import "react-chat-elements/dist/main.css"
import ChatList from './ChatList';
import Profile from './Profile';
import ChatWindow from './ChatWindow';
// import ChatUserList from './ChatUserList';

function ChatAppLayout() {
  return (
    <div className="flex max-h-screen">
      {/* Left Section: List of existing chats */}
      <div className="w-1/4 bg-gray-200">
        <Profile/>
        <hr />
        <ChatList />
      </div>
      
      {/* Center Section: Chat window */}
      <div className="flex-1 bg-gray-100">
        <ChatWindow />
      </div>

      {/* Right Section: List of users available for chat */}
      <div className="w-1/4 bg-gray-200">
        {/* <ChatUserList /> */}
      </div>
    </div>
  );
}

export default ChatAppLayout;

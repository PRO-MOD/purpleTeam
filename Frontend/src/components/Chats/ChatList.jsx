import React from 'react';
import { ChatList } from "react-chat-elements"

function ChatLists() {
    return (
        <div className="flex max-h-screen ">
            <ChatList
                className='chat-list'
                dataSource={[
                    {
                        avatar: 'https://avatars.githubusercontent.com/u/80540635?v=4',
                        alt: 'kursat_avatar',
                        title: 'Kursat',
                        subtitle: "Why don't we go to the No Way Home movie this weekend ?",
                        date: new Date(),
                        unread: 3,
                    },
                    {
                        avatar: 'https://avatars.githubusercontent.com/u/41473129?v=4',
                        alt: 'Emre',
                        title: 'Emre',
                        subtitle: "Okay !!",
                        date: new Date(2021, 9, 22),
                        unread: 3,
                    }
                ]} />
        </div>
    );
}

export default ChatLists;

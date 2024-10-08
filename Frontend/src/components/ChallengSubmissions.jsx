import React, { useState, useEffect, useContext } from 'react';
import SocketContext from '../context/SocketContext';
import ColorContext from '../context/ColorContext';

function ChallengeSubmissions() {
    const apiUrl = import.meta.env.VITE_Backend_URL;
    const { bgColor, textColor, sidenavColor, hoverColor } = useContext(ColorContext);
    // const [submissions, setSubmissions] = useState([]);
    
  const { submissions, fetchSubmissions } = useContext(SocketContext);

    useEffect(() => {
        fetchSubmissions();
    }, []);

    // Function to format date as string
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { timeZone: 'Asia/Kolkata' };
        return `on ${date.toLocaleDateString('en-US', options)} at ${date.toLocaleTimeString('en-US', options)}`;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Machine Captures: </h1><hr />
            <div className="w-[90%] ">
                {
                    submissions.length > 0 ?
                    submissions.map((challenge, i) => (
                        <p key={i} className=" text-white w-full py-2 my-2 ps-4 rounded-lg" style={{ backgroundColor: sidenavColor}} >Red Team Captured {challenge.challenge_name} {formatDate(challenge.date)}</p>
                    ))
                    :
                    <p className='text-red-600 py-16 text-center'>Well Played !! No Machines Captured by Red Team Yet</p>
                }
            </div>
        </div>
    );
}

export default ChallengeSubmissions;

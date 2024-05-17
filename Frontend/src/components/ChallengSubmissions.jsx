import React, { useState, useEffect } from 'react';

function ChallengeSubmissions() {
    const apiUrl = import.meta.env.VITE_Backend_URL;
    const [submissions, setSubmissions] = useState([]);

    useEffect(() => {
        // Fetch submissions from backend endpoint
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
                setSubmissions(data);
            })
            .catch(error => {
                console.error('Error fetching submissions:', error);
            });
    }, []);

    // Function to format date as string
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { timeZone: 'Asia/Kolkata' };
        return `on ${date.toLocaleDateString('en-US', options)} at ${date.toLocaleTimeString('en-US', options)}`;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Challenge Submissions</h1><hr />
            <div className="w-[90%] ">
                {
                    submissions.length > 0 ?
                    submissions.map((challenge, i) => (
                        <p key={i} className="bg-brown-650 text-white w-full py-2 my-2 ps-4 rounded-lg">Red Team Captured {challenge.challenge_name} {formatDate(challenge.date)}</p>
                    ))
                    :
                    <p className='text-red-600 py-16 text-center'>Well Played !! No Machines Captured by Red Team Yet</p>
                }
            </div>
        </div>
    );
}

export default ChallengeSubmissions;

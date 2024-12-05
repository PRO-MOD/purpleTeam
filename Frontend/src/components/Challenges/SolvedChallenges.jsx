import React, { useState, useEffect, useContext } from 'react';
import ColorContext from '../../context/ColorContext';
import FontContext from '../../context/FontContext';

const SolvedChallenges = () => {
    const apiUrl = import.meta.env.VITE_Backend_URL;
    const [challengeData, setChallengeData] = useState([]);
    const [loading, setLoading] = useState(true); // Add loading state
    const { sidenavColor, textColor } = useContext(ColorContext);
    const { navbarFont, paraFont } = useContext(FontContext);

    // Fetch the solved challenges data from the backend
    const fetchSolvedChallenges = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/submissions/solved-challenges`, {
                method: 'GET',
                headers: {
                    'Auth-token': localStorage.getItem('Hactify-Auth-token'),
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            // Sort challenges alphabetically by name
            const sortedData = data.data.sort((a, b) =>
                a.challengeName.localeCompare(b.challengeName)
            );
            setChallengeData(sortedData); // Assuming response has a 'data' field with the challenge info
        } catch (error) {
            console.error('Error fetching solved challenges:', error);
        } finally {
            setLoading(false); // Set loading to false after fetching
        }
    };

    useEffect(() => {
        fetchSolvedChallenges(); // Fetch immediately on mount

        // Set up interval to fetch every minute
        const intervalId = setInterval(() => {
            fetchSolvedChallenges();
        }, 60000); // 60000ms = 1 minute

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    // Get all unique user names from challenge data
    const getUsers = () => {
        const userSet = new Set();
        challengeData.forEach(challenge =>
            challenge.users.forEach(user => userSet.add(user.name))
        );
        return Array.from(userSet);
    };

    const users = getUsers();

    return (
        <div className="w-[90%] mx-auto mt-8">
            <img 
                src={`${apiUrl}/uploads/CTFdChallenges/CyberShakti.jpg-1732718442286-353567371.jpg`} // Replace with your image URL
                alt="CTF Header"
                className="w-full h-[150px] fit-cover rounded-lg mb-4"
            />
            <h1
                className="text-4xl font-bold text-center mb-8"
                style={{ fontFamily: 'headingFont', color: sidenavColor }}
            >
                CTF SOLVES
            </h1>
            {loading ? (
                <div className="flex justify-center items-center">
                    <p className="text-xl font-medium text-gray-600">Loading...</p>
                </div>
            ) : challengeData.length === 0 ? (
                <div className="flex justify-center items-center">
                    <p className="text-xl font-medium text-gray-500">No challenges found.</p>
                </div>
            ) : (
                <div className="bg-white shadow-md rounded-lg p-6 overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-200">
                        <thead>
                            <tr className='text-white' style={{ ...navbarFont, backgroundColor: sidenavColor}}>
                                <th className="border border-gray-300 px-4 py-2">Users</th>
                                {challengeData.map((challenge, index) => (
                                    <th
                                        key={index}
                                        className="border border-gray-300 px-4 py-2"
                                    >
                                        {challenge.challengeName}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((userName, userIndex) => (
                                <tr key={userIndex} className="text-center">
                                    <td className="border border-gray-300 px-4 py-2 font-bold text-left">
                                        {userName}
                                    </td>
                                    {challengeData.map((challenge, challengeIndex) => {
                                        const userStatus = challenge.users.find(
                                            user => user.name === userName
                                        );
                                        return (
                                            <td
                                                key={challengeIndex}
                                                className="border border-gray-300 px-4 py-2"
                                            >
                                                {userStatus?.solved ? (
                                                    <span className="text-green-500 font-bold">✓</span>
                                                ) : (
                                                    <span className="text-red-500 font-bold">✗</span>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default SolvedChallenges;

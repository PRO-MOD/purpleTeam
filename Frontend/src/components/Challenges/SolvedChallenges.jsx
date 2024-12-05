
import React, { useState, useEffect, useContext } from 'react';
import ColorContext from '../../context/ColorContext';

const SolvedChallenges = () => {
    const apiUrl = import.meta.env.VITE_Backend_URL;
    const [challengeData, setChallengeData] = useState([]);
    const [userList, setUserList] = useState([]);
    const [loading, setLoading] = useState(true);
    const { tableColor, sidenavColor } = useContext(ColorContext);

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

            // Extract user names dynamically
            const uniqueUsers = new Set();
            data.data.forEach((challenge) => {
                challenge.users.forEach((user) => {
                    uniqueUsers.add(user.name);
                });
            });

            setUserList(Array.from(uniqueUsers)); // Convert Set to Array
            setChallengeData(data.data);
        } catch (error) {
            console.error('Error fetching solved challenges:', error);
        } finally {
            setLoading(false);
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
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 px-8 py-2 text-left">Challenge Name</th>
                                {userList.map((user) => (
                                    <th
                                        key={user}
                                        className="border border-gray-300 px-4 py-2 text-left"
                                    >
                                        {user}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {challengeData.map((challenge) => (
                                <tr key={challenge.challengeName} className="hover:bg-gray-50">
                                    <td className="border border-gray-300 px-4 py-2">
                                        {challenge.challengeName}
                                    </td>
                                    {userList.map((user) => {
                                        const userStatus = challenge.users.find(
                                            (u) => u.name === user
                                        );
                                        return (
                                            <td
                                                key={user}
                                                className="border border-gray-300 px-4 py-2 text-center"
                                            >
                                                {userStatus?.solved ? (
                                                    <span className="text-green-500">✔</span>
                                                ) : (
                                                    <span className="text-red-500">✘</span>
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

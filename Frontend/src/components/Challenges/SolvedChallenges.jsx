import React, { useState, useEffect, useContext } from 'react';
import ColorContext from '../../context/ColorContext';
import FontContext from '../../context/FontContext';

const SolvedChallenges = () => {
    const apiUrl = import.meta.env.VITE_Backend_URL;
    const [challengeData, setChallengeData] = useState({});
    const [loading, setLoading] = useState(true);
    const { sidenavColor, textColor } = useContext(ColorContext);
    const { navbarFont, paraFont } = useContext(FontContext);

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

            // Sort challenges alphabetically within each category
            const sortedData = {};
            Object.entries(data.data).forEach(([category, challenges]) => {
                sortedData[category] = challenges.sort((a, b) =>
                    a.challengeName.localeCompare(b.challengeName)
                );
            });

            setChallengeData(sortedData);
        } catch (error) {
            console.error('Error fetching solved challenges:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSolvedChallenges();

        const intervalId = setInterval(() => {
            fetchSolvedChallenges();
        }, 60000);

        return () => clearInterval(intervalId);
    }, []);

    const getUsers = () => {
        const userSet = new Set();
        Object.values(challengeData).forEach((categoryChallenges) =>
            categoryChallenges.forEach((challenge) =>
                challenge.users.forEach((user) => userSet.add(user.name))
            )
        );
        return Array.from(userSet);
    };

    const users = getUsers();

    return (
        <div className="w-[90%] mx-auto mt-8">
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
            ) : Object.keys(challengeData).length === 0 ? (
                <div className="flex justify-center items-center">
                    <p className="text-xl font-medium text-gray-500">No challenges found.</p>
                </div>
            ) : (
                <div className="bg-white shadow-md rounded-lg p-6 overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-200">
                        <thead>
                            <tr className="text-white" style={{ ...navbarFont, backgroundColor: sidenavColor }}>
                                <th className="border border-gray-300 px-4 py-2">Users</th>
                                {Object.entries(challengeData).map(([category, challenges], categoryIndex) => (
                                    <th
                                        key={categoryIndex}
                                        colSpan={challenges.length}
                                        className="border border-gray-300 px-4 py-2 text-center"
                                    >
                                        {category}
                                    </th>
                                ))}
                            </tr>
                            <tr className="text-white" style={{ ...navbarFont, backgroundColor: sidenavColor }}>
                                <th className="border border-gray-300 px-4 py-2"></th>
                                {Object.values(challengeData).map((challenges) =>
                                    challenges.map((challenge, challengeIndex) => (
                                        <th
                                            key={challengeIndex}
                                            className="border border-gray-300 px-4 py-2"
                                        >
                                            {challenge.challengeName}
                                        </th>
                                    ))
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((userName, userIndex) => (
                                <tr key={userIndex} className="text-center">
                                    <td className="border border-gray-300 px-4 py-2 font-bold text-left">
                                        {userName}
                                    </td>
                                    {Object.values(challengeData).map((challenges) =>
                                        challenges.map((challenge, challengeIndex) => {
                                            const userStatus = challenge.users.find(
                                                (user) => user.name === userName
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
                                        })
                                    )}
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

import React, { useState, useEffect, useContext } from 'react';
import InformationTable from './challenges/Partials/InformationTable';
import ColorContext from '../../context/ColorContext';

const SolvedChallenges = () => {
    const apiUrl = import.meta.env.VITE_Backend_URL;
    const [challengeData, setChallengeData] = useState([]);
    const [loading, setLoading] = useState(true); // Add loading state
    const { tableColor, sidenavColor } = useContext(ColorContext);

    useEffect(() => {
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
                setChallengeData(data.data); // Assuming response has a 'data' field with the challenge info
            } catch (error) {
                console.error('Error fetching solved challenges:', error);
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        fetchSolvedChallenges();
    }, []);

    // Columns for the InfoTable
    const columns = [
        { header: 'Challenge Name', accessor: 'challengeName' },
        { header: 'Solved By', accessor: 'solvedUsers' },
    ];

    // Handle row click
    const handleRowClick = (id) => {
        console.log(`Row clicked: ${id}`);
    };

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
            ) : challengeData.length === 0 ? (
                <div className="flex justify-center items-center">
                    <p className="text-xl font-medium text-gray-500">No challenges found.</p>
                </div>
            ) : (
                <div className="bg-white shadow-md rounded-lg p-6">
                    <InformationTable
                        data={challengeData.map((item, index) => ({
                            _id: index, // For unique key in the table
                            challengeName: item.challengeName,
                            solvedUsers: item.solvedUsers.join(', '), // Convert array to a string for display
                        }))}
                        columns={columns}
                        onRowClick={handleRowClick}
                    />
                </div>
            )}
        </div>
    );
};

export default SolvedChallenges;

import React, { useState, useEffect } from 'react';
import AssignStaticScoreModal from './AssignStaticScoreModal';

const StaticScore = ({ userId }) => {
    const apiUrl = import.meta.env.VITE_Backend_URL;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [staticScore, setStaticScore] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStaticScore = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/score/get-static-score/${userId}`);
                const data = await response.json();
                setStaticScore(data.staticScore);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching static score:', error);
                setLoading(false);
            }
        };

        fetchStaticScore();
    }, [userId]);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleAssign = (newScore) => {
        setStaticScore(newScore);
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-100">Loading...</div>;
    }

    return (
        <div className='flex flex-row items-center'>
            <p className="text-lg mb-4">Static Score: {staticScore !== null ? staticScore : 'Not Assigned'}</p>
            <button
                onClick={handleOpenModal}
                className="w-1/6 ms-4 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Assign Static Score
            </button>
            <AssignStaticScoreModal
                userId={userId}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onAssign={handleAssign}
                assignedStaticScore={staticScore}
            />
        </div>
    );
};

export default StaticScore;

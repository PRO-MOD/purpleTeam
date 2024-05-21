import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function NewReportSubmission() {
    const [newReports, setNewReports] = useState([]);
    const apiUrl = import.meta.env.VITE_Backend_URL;
    const navigate = useNavigate();

    useEffect(() => {
        fetchNewReports();

        const intervalId = setInterval(fetchNewReports, 60000);

        // Clean up function to clear interval when component unmounts
        return () => clearInterval(intervalId);
    }, []);

    const fetchNewReports = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/updates/newReports`);
            if (!response.ok) {
                throw new Error('Failed to fetch new reports');
            }
            const data = await response.json();
            const sortedSubmissions = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setNewReports(sortedSubmissions);
        } catch (error) {
            console.error('Error fetching new reports:', error);
        }
    };

    // Function to format date as string
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { timeZone: 'Asia/Kolkata' };
        return `on ${date.toLocaleDateString('en-US', options)} at ${date.toLocaleTimeString('en-US', options)}`;
    };

    const handleReportClick = async (updateId, userId) => {
        try {
            // Update click count in the database
            const response = await fetch(`${apiUrl}/api/updates/newReports/${updateId}`, {
                method: 'PUT',
            });
            if (!response.ok) {
                throw new Error('Failed to update click count');
            }
            // Redirect to user profile
            navigate(`/user/${userId}`);
        } catch (error) {
            console.error('Error updating click count:', error);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">New Report Updates: </h1><hr />
            <div className="w-[90%] ">
                {
                    newReports.length > 0 ?
                    newReports.map((report, i) => (
                        <p key={i} onClick={() => handleReportClick(report._id, report.userId._id)} className="bg-brown-650 text-white w-full py-2 my-2 ps-4 rounded-lg cursor-pointer">{report.userId.name} submitted a new report for {report.ID} {formatDate(report.createdAt)}</p>
                    ))
                    :
                    <p className='text-red-600 py-16 text-center'>No new reports available</p>
                }
            </div>
        </div>
    );
}

export default NewReportSubmission;

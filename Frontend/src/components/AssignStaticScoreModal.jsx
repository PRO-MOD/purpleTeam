import React, { useState, useEffect, useContext } from 'react';
import FontContext from '../context/FontContext';
const AssignStaticScoreModal = ({ userId, isOpen, onClose, onAssign, assignedStaticScore }) => {
    const apiUrl = import.meta.env.VITE_Backend_URL;
    const [staticScore, setStaticScore] = useState('');
    const [message, setMessage] = useState('');
    const {navbarFont, headingFont, paraFont, updateFontSettings}=useContext(FontContext);

    useEffect(() => {
        // Set the initial state of staticScore to the previously assigned score
        if (assignedStaticScore) {
            setStaticScore(assignedStaticScore.toString());
        }
    }, [assignedStaticScore]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');

        if (!staticScore || isNaN(staticScore)) {
            setMessage('Please enter a valid number for staticScore');
            return;
        }

        try {
            const response = await fetch(`${apiUrl}/api/score/assign-static-score/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ staticScore: Number(staticScore) }),
            });

            const result = await response.json();

            if (response.ok) {
                setMessage('Static Score assigned successfully');
                onAssign(Number(staticScore));
                onClose();
            } else {
                setMessage(result.error || 'An error occurred');
            }
        } catch (error) {
            setMessage('An error occurred: ' + error.message);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50"></div>
            <div className="bg-white p-6 rounded-lg shadow-lg z-10 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4" style={{fontFamily: headingFont}}>Assign Static Score</h2>
                <p className="text-lg font-semibold mb-4" style={{fontFamily:paraFont}}>User ID: {userId}</p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="staticScore" className="block text-sm font-medium text-gray-700" style={{fontFamily:paraFont}}>Static Score</label>
                        <input
                            type="text"
                            id="staticScore"
                            value={staticScore}
                            onChange={(e) => {
                                // Ensure the input value is non-negative
                                const newValue = e.target.value.replace(/\D/g, ''); // Remove any non-digit characters
                                setStaticScore(newValue);
                            }}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="mr-2 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                           style={{fontFamily:navbarFont.fontFamily, fontSize:navbarFont.fontSize}}>
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                         style={{fontFamily:navbarFont.fontFamily, fontSize:navbarFont.fontSize}}>
                            Submit
                        </button>
                    </div>
                </form>
                {message && <p className="mt-4 text-red-600">{message}</p>}
            </div>
        </div>
    );
};

export default AssignStaticScoreModal;

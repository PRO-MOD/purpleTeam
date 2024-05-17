import React, { useState } from 'react';

const CreateChallenge = () => {
    const apiUrl = import.meta.env.VITE_Backend_URL;
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false); // State variable for loading indicator

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            setMessage('Please upload a file first.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            setLoading(true); // Set loading to true when starting the upload
            const response = await fetch(`${apiUrl}/api/challenge/create`, {
                method: 'POST',
                body: formData,
            });
            if (response.ok) {
                setMessage('File uploaded successfully!');
                setTimeout(() => {
                    setMessage('');
                }, 5000);
            } else {
                const errorData = await response.json();
                setMessage('Error uploading file: ' + errorData.message);
                setTimeout(() => {
                    setMessage('');
                }, 5000);
            }
        } catch (error) {
            setMessage('Error uploading file: ' + error.message);
        } finally {
            setLoading(false); // Set loading to false after the upload is complete (whether successful or not)
        }
    };

    return (
        <form onSubmit={handleSubmit} className='flex flex-row items-center'>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2 text-red-500" htmlFor="file">
                    Create CTFD Challenges
                </label>
                <input
                    type="file"
                    id="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:border-blue-500"
                />
            </div>
            <button
                type="submit"
                className="w-[100px] ms-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200 h-[45px]"
                disabled={loading} // Disable the button while loading
            >
                {loading ? 'Uploading...' : 'Upload'} {/* Change button text based on loading state */}
            </button>
            {message && (
                <p className="mt-4 text-center text-indigo-700 ms-4">
                    {message}
                </p>
            )}
        </form>
    );
};

export default CreateChallenge;

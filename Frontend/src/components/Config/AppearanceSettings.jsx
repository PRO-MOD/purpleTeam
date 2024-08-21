import React, { useState } from 'react';

const AppearanceSettings = () => {
  const apiUrl = import.meta.env.VITE_Backend_URL;
    const [logo, setLogo] = useState(null);

    const handleFileChange = (e) => {
        setLogo(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!logo) {
            alert('Please select a logo to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('logo', logo);

        try {
            const response = await fetch(`${apiUrl}/api/config/update-logo`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message);
            } else {
                alert(data.error || 'Failed to update logo');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while updating the logo.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label className="block text-lg font-semibold mb-2">Upload Logo</label>
                <input
                    type="file"
                    onChange={handleFileChange}
                    className="border p-2 w-full"
                    accept="image/*" // This ensures that only image files are selectable
                />
            </div>
            <button
                type="submit"
                className="mt-4 bg-green-500 text-white p-2 rounded"
            >
                Update Logo
            </button>
            <div className="mt-4">
                <label className="block text-lg font-semibold mb-2">Theme</label>
                <p className="text-gray-500">From here you can update the theme.</p>
            </div>
        </form>
    );
};

export default AppearanceSettings;

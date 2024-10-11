import React, { useState, useContext } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBarsProgress } from '@fortawesome/free-solid-svg-icons';
import FontContext from '../../../../../context/FontContext';

const HeaderFooter = () => {
    const apiUrl = import.meta.env.VITE_Backend_URL;
    const [showModal, setShowModal] = useState(false);
    const [headerImage, setHeaderImage] = useState(null);
    const [footerImage, setFooterImage] = useState(null);
    const [message, setMessage] = useState('');
    const {navbarFont, headingFont, paraFont, updateFontSettings}=useContext(FontContext);

    const handleFileChange = (e, setFile) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create separate FormData objects for header and footer images
        const formDataHeader = new FormData();
        if (headerImage) {
            formDataHeader.append('headerImage', headerImage);
        }

        const formDataFooter = new FormData();
        if (footerImage) {
            formDataFooter.append('footerImage', footerImage);
        }

        try {
            // Send header image if present
            if (headerImage) {
                const headerResponse = await fetch(`${apiUrl}/api/reports/headers/upload`, {
                    method: 'POST',
                    body: formDataHeader,
                });

                if (headerResponse.ok) {
                    const data = await headerResponse.json();
                    setMessage('Header image updated successfully.');
                } else {
                    setMessage('Failed to update header image.');
                }
            }

            // Send footer image if present
            if (footerImage) {
                const footerResponse = await fetch(`${apiUrl}/api/reports/footers/upload`, {
                    method: 'POST',
                    body: formDataFooter,
                });

                if (footerResponse.ok) {
                    const data = await footerResponse.json();
                    setMessage('Footer image updated successfully.');
                } else {
                    setMessage('Failed to update footer image.');
                }
            }
        } catch (error) {
            console.error('Error updating configuration:', error);
            setMessage('Error updating configuration.');
        }
    };

    return (
        <div className="">
            {/* <button
                
                className="p-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-700"
            >
                Configure Header and Footer
            </button> */}
            <FontAwesomeIcon className='mx-2 text-blue-500 cursor-pointer' icon={faBarsProgress} onClick={() => setShowModal(true)} title='Configure Header and Footer'/>


            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                        <h3 className="text-lg font-semibold mb-4">Configure Header and Footer</h3>
                        {message && <div className="text-green-500 mb-2">{message}</div>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700"  >Header Image</label>
                                <input
                                    type="file"
                                    onChange={(e) => handleFileChange(e, setHeaderImage)}
                                    className="form-control mt-1"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700">Footer Image</label>
                                <input
                                    type="file"
                                    onChange={(e) => handleFileChange(e, setFooterImage)}
                                    className="form-control mt-1"
                                />
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 hover:text-red-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="p-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-700" 
                                >
                                    Save Configuration
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HeaderFooter;

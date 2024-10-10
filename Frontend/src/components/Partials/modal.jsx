import React from 'react';

const Modal = ({ isOpen, closeModal, title, children, onSubmit }) => {
    if (!isOpen) return null; // Don't render modal if it's not open

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-96">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
                    <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={closeModal}
                    >
                        &times; {/* Close icon */}
                    </button>
                </div>
                <div className="p-6">
                    {children} {/* Content passed to the modal */}
                </div>
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-4">
                    <button
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        onClick={closeModal}
                    >
                        Close
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={onSubmit}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;

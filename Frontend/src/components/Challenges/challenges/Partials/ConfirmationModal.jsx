// src/components/ConfirmationModal.js
import React from 'react';

const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-10">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Confirm Action</h2>
        <p className="mb-4">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white p-2 rounded-sm mr-2"
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            className="bg-gray-600 text-white p-2 rounded-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

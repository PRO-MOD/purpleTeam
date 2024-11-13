import React, { useState } from 'react';

const DuplicateModal = ({ repositories, onConfirm, onCancel }) => {
  const [selectedRepoId, setSelectedRepoId] = useState('');

  const handleRepoChange = (e) => {
    setSelectedRepoId(e.target.value);
  };

  const handleConfirm = () => {
    if (selectedRepoId) {
      onConfirm(selectedRepoId);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Select a repository to duplicate challenges</h3>
        <select value={selectedRepoId} onChange={handleRepoChange}>
          <option value="">Select Repository</option>
          {repositories.map(repo => (
            <option key={repo._id} value={repo._id}>
              {repo.name}
            </option>
          ))}
        </select>
        <div className="modal-actions">
          <button onClick={handleConfirm}>Confirm</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default DuplicateModal;

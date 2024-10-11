import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faEdit, faPlus } from '@fortawesome/free-solid-svg-icons';
import FontContext from '../../../../../../context/FontContext';
import ColorContext from '../../../../../../context/ColorContext';

const Hints = ({ challengeId }) => {
  const { paraFont, navbarFont, headingFont } = useContext(FontContext); // Accessing fonts from context
  const { tableColor } = useContext(ColorContext); // Accessing fonts from context
  const [hints, setHints] = useState([]);
  const [newHint, setNewHint] = useState('');
  const [newHintCost, setNewHintCost] = useState(0); // Default value
  const [editingIndex, setEditingIndex] = useState(null);
  const [editHint, setEditHint] = useState('');
  const [editHintCost, setEditHintCost] = useState(0); // Default value
  const [message, setMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchHints();
  }, [challengeId]);

  const apiUrl = import.meta.env.VITE_Backend_URL;

  const fetchHints = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/hints/get/${challengeId}`);
      const data = await response.json();
      setHints(data.hints);
    } catch (error) {
      console.error('Error fetching hints:', error);
    }
  };

  const handleAddHint = async () => {
    if (!newHint.trim()) {
      setMessage('Please enter a hint.');
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/hints/add/${challengeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newHint.trim(), cost: newHintCost }),
      });

      if (!response.ok) {
        throw new Error('Hint addition failed.');
      }

      const data = await response.json();
      setHints((prevHints) => [...prevHints, data.hint]);
      setNewHint('');
      setNewHintCost(0);
      setMessage('Hint added successfully');
      setIsModalOpen(false); // Close modal after adding
    } catch (error) {
      setMessage('Hint addition failed.');
      console.error('Error adding hint:', error);
    }
  };

  const handleDeleteHint = async (hintId) => {
    try {
      const response = await fetch(`${apiUrl}/api/hints/${challengeId}/hints/delete/${hintId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Hint deletion failed.');
      }

      setHints((prevHints) => prevHints.filter((hint) => hint._id !== hintId));
      setMessage('Hint deleted successfully');
      setEditingIndex(null); // Reset editing state if any
    } catch (error) {
      setMessage('Hint deletion failed.');
      console.error('Error deleting hint:', error);
    }
  };

  const handleEditHint = async () => {
    if (!editHint.trim()) {
      setMessage('Please enter a hint.');
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/hints/edit/${challengeId}/hints/${editingIndex}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: editHint.trim(), cost: editHintCost }),
      });

      if (!response.ok) {
        throw new Error('Hint edit failed.');
      }

      const data = await response.json();
      const updatedHints = hints.map((hint) => (hint._id === data.hint._id ? data.hint : hint));
      setHints(updatedHints);
      setMessage('Hint edited successfully');
      setEditingIndex(null); // Reset editing state
      setIsModalOpen(false); // Close modal after editing
    } catch (error) {
      setMessage('Hint edit failed.');
      console.error('Error editing hint:', error);
    }
  };

  const handleStartEdit = (index, hint) => {
    setEditingIndex(hint._id);
    setEditHint(hint.content);
    setEditHintCost(hint.cost);
    setIsModalOpen(true);
  };

  const handleStartAdd = () => {
    setEditingIndex(null);
    setNewHint('');
    setNewHintCost(0);
    setIsModalOpen(true);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditHint('');
    setEditHintCost(0); // Reset hint cost to default
    setMessage('');
    setIsModalOpen(false); // Close modal
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-4 mx-12">
        <div className="flex flex-row items-center mb-2">
          <h3 className="font-medium text-xl" style={headingFont}>Hints</h3>
          <FontAwesomeIcon
            icon={faPlus}
            className="text-blue-500 cursor-pointer mx-2"
            onClick={handleStartAdd}
            title="Add Hint"
          />
        </div>
        {hints.length === 0 ? (
          <p style={paraFont}>No hints added.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50" >
              <tr style={{backgroundColor: tableColor}}>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={navbarFont}>
                  Hint
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={navbarFont}>
                  Cost
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={navbarFont}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {hints.map((hint) => (
                <tr key={hint._id} className="hover:bg-gray-100">
                  <td className="px-6 py-4 whitespace-nowrap" style={paraFont}>
                    {hint.content}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500" style={paraFont}>
                    {hint.cost}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <FontAwesomeIcon
                      icon={faEdit}
                      className="text-blue-500 cursor-pointer me-4"
                      onClick={() => handleStartEdit(hint._id, hint)}
                    />
                    <FontAwesomeIcon
                      icon={faTrashAlt}
                      className="text-red-500 cursor-pointer"
                      onClick={() => handleDeleteHint(hint._id)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {message && <p className="mt-4" style={paraFont}>{message}</p>}
      </div>
      
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4" style={headingFont}>
              {editingIndex ? 'Edit Hint' : 'Add Hint'}
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Hint</label>
              <input
                type="text"
                value={editingIndex ? editHint : newHint}
                onChange={(e) => editingIndex ? setEditHint(e.target.value) : setNewHint(e.target.value)}
                placeholder="Enter hint"
                className="border border-gray-300 p-2 rounded-sm w-full"
                style={{ fontFamily: paraFont.fontFamily, fontSize: paraFont.fontSize, fontWeight: paraFont.fontWeight, fontStyle: paraFont.fontStyle }}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Cost</label>
              <input
                type="number"
                value={editingIndex ? editHintCost : newHintCost}
                onChange={(e) => editingIndex ? setEditHintCost(parseInt(e.target.value)) : setNewHintCost(parseInt(e.target.value))}
                placeholder="Enter cost"
                className="border border-gray-300 p-2 rounded-sm w-full"
                style={{ fontFamily: paraFont.fontFamily, fontSize: paraFont.fontSize, fontWeight: paraFont.fontWeight, fontStyle: paraFont.fontStyle }}
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={editingIndex ? handleEditHint : handleAddHint}
                className="bg-blue-500 text-white p-2 rounded-sm mr-2"
              >
                {editingIndex ? 'Save' : 'Add'}
              </button>
              <button
                onClick={handleCancelEdit}
                className="bg-gray-600 text-white p-2 rounded-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hints;

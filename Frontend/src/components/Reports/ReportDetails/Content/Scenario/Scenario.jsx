import React, { useState, useEffect, useContext } from 'react';
import Table from '../../../Table'; // Import the reusable Table component
import Modal from '../../../../Partials/modal'; // Reuse the Modal component
import InputField from '../../../../Challenges/challenges/Partials/InputFeild'; // Assuming similar input field component for scenarios
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import FontContext from '../../../../../context/FontContext';
import ConfirmationModal from '../../../../Challenges/challenges/Partials/ConfirmationModal';

const Scenarios = ({ reportId }) => {
  const { navbarFont, headingFont, paraFont, updateFontSettings } = useContext(FontContext);
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingScenario, setEditingScenario] = useState(null);
  const apiUrl = import.meta.env.VITE_Backend_URL;
const [showConfirmModal, setShowConfirmModal] = useState(false); // State to control confirm modal
    const [scenarioToDelete, setScenarioToDelete] = useState(null); // Store the question to be deleted

  useEffect(() => {
    fetchScenarios();
  }, [reportId]);

  const fetchScenarios = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/scenario/${reportId}`, {
        headers: {
          'Auth-token': localStorage.getItem('Hactify-Auth-token'),
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch scenarios');
      }
      const data = await response.json();
      setScenarios(data);
    } catch (error) {
      setError('Failed to load scenarios');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (scenario) => {
    setEditingScenario(scenario);
    setShowModal(true);
  };

   const handleDelete = (id) => {
    setScenarioToDelete(id); // Set the question to be deleted
        setShowConfirmModal(true); // Show the confirmation modal
    };


  const confirmDelete = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/scenario/${scenarioToDelete}`, {
        method: 'DELETE',
        headers: {
          'Auth-token': localStorage.getItem('Hactify-Auth-token'),
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete scenario');
      }
      setScenarios(scenarios.filter((scenario) => scenario._id !== scenarioToDelete));
      setShowConfirmModal(false);
    } catch (error) {
      setError('Failed to delete scenario');
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingScenario(null);
  };

  const handleScenarioSubmit = async (e) => {
    e.preventDefault();
    const newScenario = {
      scenarioId: editingScenario.scenarioId,
      reportId,
    };

    if (editingScenario._id) {
      // Edit existing scenario
      try {
        const response = await fetch(`${apiUrl}/api/scenario/${editingScenario._id}`, {
          method: 'PUT',
          headers: {
            'Auth-token': localStorage.getItem('Hactify-Auth-token'),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newScenario),
        });

        if (!response.ok) {
          throw new Error('Failed to update scenario');
        }

        await response.json();
        
        fetchScenarios();
        handleModalClose();
      } catch (error) {
        setError('Failed to update scenario');
      }
    } else {
      // Add new scenario
      try {
        const response = await fetch(`${apiUrl}/api/scenario`, {
          method: 'POST',
          headers: {
            'Auth-token': localStorage.getItem('Hactify-Auth-token'),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newScenario),
        });

        if (!response.ok) {
          throw new Error('Failed to add scenario');
        }

        await response.json();
        
        fetchScenarios();
        handleModalClose();
      } catch (error) {
        setError('Failed to add scenario');
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const columns = [
    { header: "Scenario ID", accessor: "scenarioId" },
  ];

  return (
    <div className="container mx-auto px-6">
      <div className="flex items-center mb-4">
        <h2 className="text-2xl font-semibold" style={{ fontFamily: headingFont }}>Scenarios</h2>
        <FontAwesomeIcon icon={faPlus} className="mx-2 text-green-500 cursor-pointer" onClick={() => setShowModal(true)} />
      </div>

      <Table columns={columns} data={scenarios} onEdit={handleEdit} onDelete={handleDelete} editButtonReq={true} />

      {/* Modal for adding or editing scenarios */}
      <Modal 
        isOpen={showModal} 
        closeModal={handleModalClose} 
        title={editingScenario ? "Edit Scenario" : "Add Scenario"} 
        onSubmit={handleScenarioSubmit}
      >
        {/* Inside the modal, add the scenario form */}
        <InputField 
          label="Scenario ID" 
          type="text" 
          id="scenarioId" 
          value={editingScenario ? editingScenario.scenarioId : ''}
          onChange={(e) => setEditingScenario({...editingScenario, scenarioId: e.target.value})}
        />
        {/* Add more fields as needed */}
      </Modal>
        {/* Confirmation Modal for Deletion */}
        {showConfirmModal && (
                <ConfirmationModal
                    message="Are you sure you want to delete this Scenario?"
                    onConfirm={confirmDelete}
                    onCancel={() => setShowConfirmModal(false)}
                />
            )}
    </div>
  );
};

export default Scenarios;

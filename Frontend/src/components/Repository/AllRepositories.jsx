import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from '../Challenges/challenges/Partials/ConfirmationModal';
import InfoTable from '../Challenges/challenges/Partials/InfoTable';

const AllRepositories = () => {
  const [repositories, setRepositories] = useState([]);
  const [selectedRepositories, setSelectedRepositories] = useState([]);
  const [searchField, setSearchField] = useState('name');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [deletionAction, setDeletionAction] = useState(null);
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_Backend_URL;

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/repositories`);
        const data = await response.json();
        setRepositories(data);
      } catch (error) {
        console.error('Error fetching repositories:', error);
      }
    };

    fetchRepositories();
  }, []);

  const handleSelectRepository = (repositoryId) => {
    setSelectedRepositories(prevSelected =>
      prevSelected.includes(repositoryId)
        ? prevSelected.filter(id => id !== repositoryId)
        : [...prevSelected, repositoryId]
    );
  };

  const handleDeleteRepositories = () => {
    setDeletionAction(() => async () => {
      try {
        for (const repositoryId of selectedRepositories) {
          const response = await fetch(`${apiUrl}/api/repositories/${repositoryId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            const errorResponse = await response.json();
            console.error(`Error deleting repository ${repositoryId}:`, errorResponse.message);
          } else {
            const result = await response.json();
            console.log(result.message);
          }
        }

        setRepositories(prevRepositories =>
          prevRepositories.filter(repository => !selectedRepositories.includes(repository._id))
        );
        setSelectedRepositories([]);
      } catch (error) {
        console.error('Error deleting repositories:', error);
      }
    });
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    if (deletionAction) {
      await deletionAction();
    }
    setShowModal(false);
  };

  const handleCancelDelete = () => {
    setShowModal(false);
  };

  const sortedRepositories = [...repositories].sort((a, b) => {
    const aValue = a[searchField];
    const bValue = b[searchField];

    return aValue.localeCompare(bValue);
  });

  const filteredRepositories = sortedRepositories.filter(repository => {
    if (searchQuery === '') return true;
    return String(repository[searchField]).toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleDetailsClick = (repositoryId, event) => {
    if (!event.target.closest('input[type="checkbox"]')) {
      navigate(`/repositories/${repositoryId}`);
    }
  };

  const handleSelectAllRepositories = () => {
    if (selectedRepositories.length === repositories.length) {
      setSelectedRepositories([]);
    } else {
      setSelectedRepositories(repositories.map(repository => repository._id));
    }
  };

  const handleAddRepositories = () => {
    navigate('/admin/repository/create');
  };

  const columns = [
    { header: 'ID', accessor: '_id' },
    { header: 'Name', accessor: 'name' },
    { header: 'Description', accessor: 'description' },
  ];

  return (
    <div className="container mx-auto p-4 my-8 w-full">
      <div className="mb-4 mx-auto">
        <form className="flex flex-wrap justify-center gap-4">
          <div>
            <select
              id="field"
              value={searchField}
              onChange={(e) => setSearchField(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-sm outline-0 focus:border-green-500 focus:ring focus:ring-green-200"
            >
              <option value="name">Name</option>
              <option value="description">Description</option>
            </select>
          </div>
          <div className="w-3/4">
            <input
              id="q"
              name="q"
              placeholder="Search for matching repository"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-sm outline-0 focus:border-green-500 focus:ring focus:ring-green-200"
            />
          </div>
        </form>
      </div>
      <hr className="mx-8 my-4 " />

      {repositories.length <= 0 && (
        <div className="mb-8 flex flex-row justify-center items-center text-gray-700">
          <span onClick={handleAddRepositories} className="cursor-pointer">
            Add Repositories to View
            <FontAwesomeIcon icon={faPlusCircle} className="mx-2" />
          </span>
        </div>
      )}

      {showModal && (
        <ConfirmationModal
          message="Are you sure you want to delete the selected repositories? This action cannot be undone."
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}

      <InfoTable
        data={filteredRepositories}
        columns={columns}
        onRowClick={handleDetailsClick}
        selectedItems={selectedRepositories}
        onItemSelect={handleSelectRepository}
        onSelectAll={handleSelectAllRepositories}
        onDelete={handleDeleteRepositories}
      />
    </div>
  );
};

export default AllRepositories;


import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import FontContext from '../../../../../../context/FontContext';
import ColorContext from '../../../../../../context/ColorContext';

const Users = ({ challengeId }) => {
  const apiUrl = import.meta.env.VITE_Backend_URL;
  const { navbarFont, headingFont, paraFont } = useContext(FontContext);
  const { tableColor } = useContext(ColorContext);
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/challenges/users/${challengeId}`, {
          method: 'GET',
          headers: {
            'Auth-token': localStorage.getItem('Hactify-Auth-token'),
          }
        });
        const data = await response.json();
        setUsers(data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchAllUsers = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/user/getallusers`, {
          method: 'GET',
          headers: {
            'Auth-token': localStorage.getItem('Hactify-Auth-token'),
          }
        });
        const data = await response.json();

        // Filter out users who are already added
        const assignedUserIds = new Set(users.map(user => user._id));
        const availableUsers = data.filter(user => !assignedUserIds.has(user._id));
        setAllUsers(availableUsers);
      } catch (error) {
        console.error('Error fetching all users:', error);
      }
    };

    fetchUsers();
    fetchAllUsers();
  }, []); //challengeId, users

  const handleAddUsers = async () => {
    if (selectedUsers.length === 0) {
      setMessage('Please select at least one user.');
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/challenges/multiusers/${challengeId}/add`, {
        method: 'POST',
        headers: { 
          'Auth-token': localStorage.getItem('Hactify-Auth-token'),
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ user_ids: selectedUsers }),
      });

      if (!response.ok) throw new Error('User addition failed.');

      const data = await response.json();
      setUsers((prevUsers) => [...prevUsers, ...data.addedUsers]);
      setAllUsers((prevAllUsers) =>
        prevAllUsers.filter(user => !selectedUsers.includes(user._id))
      );
      setSelectedUsers([]);
      setSelectAll(false);
      setMessage('Users added successfully');
      setModalOpen(false);
    } catch (error) {
      setMessage('User addition failed.');
      console.error('Error adding users:', error);
    }
  };

  const handleDelete = async (index) => {
    const userId = users[index]._id;
    try {
      const response = await fetch(`${apiUrl}/api/challenges/users/${challengeId}/delete/${userId}`, {
        method: 'DELETE',
        headers: {
          'Auth-token': localStorage.getItem('Hactify-Auth-token'),
        }
      });

      if (!response.ok) {
        throw new Error('User deletion failed.');
      }

      setUsers((prevUsers) => prevUsers.filter((_, i) => i !== index));
      setAllUsers((prevAllUsers) => [...prevAllUsers, users[index]]);
      setMessage('User deleted successfully');
    } catch (error) {
      setMessage('User deletion failed.');
      console.error('Error deleting user:', error);
    }
  };

  const handleToggleUserSelection = (userId) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const toggleModal = () => {
    setSelectedUsers([]);
    setSelectAll(false);
    setModalOpen(!modalOpen);
    setMessage('');
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user._id));
    }
    setSelectAll(!selectAll);
  };

  const filteredUsers = allUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto" >
      <div className="mb-4 mx-12">
        <div className="flex flex-row items-center mb-2">
          <h3 className="font-medium text-xl" style={{ ...headingFont }}>Users</h3>
          <FontAwesomeIcon icon={faPlus} className="text-blue-500 cursor-pointer mx-2" onClick={toggleModal} title="Add Users" />
        </div>
        {users.length === 0 ? (
          <p style={{ ...paraFont }}>No users added.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr style={{backgroundColor: tableColor}}>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider" style={{ ...navbarFont }}>
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs uppercase tracking-wider" style={{ ...navbarFont }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user, index) => (
                <tr key={index} className="hover:bg-gray-100" style={{ ...paraFont }}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <pre className="text-gray-700">{user.name}</pre>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <FontAwesomeIcon icon={faTrashAlt} className="text-red-500 cursor-pointer" onClick={() => handleDelete(index)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Add Users</h2>
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={handleSearch}
              className="form-input w-full p-2 mb-4 border rounded-sm focus:ring focus:ring-green-200"
            />
            <div className="flex items-center space-x-2 mb-2">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                className="form-checkbox"
              />
              <label className="text-gray-700">Select All</label>
            </div>
            <div className="max-h-48 overflow-y-auto border rounded-sm p-2 mb-4">
              {filteredUsers.map(user => (
                <div key={user._id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user._id)}
                    onChange={() => handleToggleUserSelection(user._id)}
                    className="form-checkbox"
                  />
                  <label className="text-gray-700">{user.name}</label>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <button onClick={toggleModal} className="bg-gray-600 text-white p-2 rounded-sm mr-2">
                Cancel
              </button>
              <button onClick={handleAddUsers} className="bg-blue-600 text-white p-2 rounded-sm">
                Add Selected Users
              </button>
            </div>
            {message && <p className="mt-4 text-center">{message}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;

import React, { useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import FontContext from '../../../../../../context/FontContext';

const Users = ({ challengeId }) => {
  const apiUrl = import.meta.env.VITE_Backend_URL;
  const { navbarFont, headingFont, paraFont } = useContext(FontContext); // Use the fonts from context
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [newUser, setNewUser] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editUser, setEditUser] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/challenges/users/${challengeId}`);
        const data = await response.json();
        setUsers(data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchAllUsers = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/user/getallusers`);
        const data = await response.json();
        const assignedUserIds = new Set(users.map(user => user._id));
        const availableUsers = data.filter(user => !assignedUserIds.has(user._id));
        setAllUsers(availableUsers);
      } catch (error) {
        console.error('Error fetching all users:', error);
      }
    };

    fetchUsers();
    fetchAllUsers();
  }, [challengeId]);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await fetch(`${apiUrl}/api/user/getallusers`);
        const data = await response.json();
        const assignedUserIds = new Set(users.map(user => user._id));
        const availableUsers = data.filter(user => !assignedUserIds.has(user._id));
        setAllUsers(availableUsers);
      } catch (error) {
        console.error('Error fetching all users:', error);
      }
    };

    fetchAllUsers();
  }, [users]);

  const handleAddUser = async () => {
    if (!newUser.trim()) {
      setMessage('Please select a user.');
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/challenges/users/${challengeId}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: newUser }),
      });

      if (!response.ok) {
        throw new Error('User addition failed.');
      }

      const data = await response.json();
      setUsers((prevUsers) => [...prevUsers, data.user]);
      setAllUsers((prevAllUsers) => prevAllUsers.filter(user => user._id !== newUser));
      setNewUser('');
      setMessage('User added successfully');
      setModalOpen(false);
    } catch (error) {
      setMessage('User addition failed.');
      console.error('Error adding user:', error);
    }
  };

  const handleDeleteUser = async (index) => {
    const userId = users[index]._id;
    try {
      const response = await fetch(`${apiUrl}/api/challenges/users/${challengeId}/delete/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('User deletion failed.');
      }

      setUsers((prevUsers) => prevUsers.filter((_, i) => i !== index));
      setAllUsers((prevAllUsers) => [...prevAllUsers, users[index]]);
      setMessage('User deleted successfully');
      setEditingIndex(null);
    } catch (error) {
      setMessage('User deletion failed.');
      console.error('Error deleting user:', error);
    }
  };

  const handleEditUser = async () => {
    if (!editUser.trim()) {
      setMessage('Please select a user.');
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/api/challenges/users/${challengeId}/edit/${editingIndex}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: editUser }),
      });

      if (!response.ok) {
        throw new Error('User edit failed.');
      }

      const data = await response.json();
      const updatedUsers = [...users];
      updatedUsers[editingIndex] = data.user;
      setUsers(updatedUsers);
      setAllUsers((prevAllUsers) => prevAllUsers.filter(user => user._id !== editUser));
      setMessage('User edited successfully');
      setEditingIndex(null);
      setModalOpen(false);
    } catch (error) {
      setMessage('User edit failed.');
      console.error('Error editing user:', error);
    }
  };

  const handleStartEdit = (index) => {
    setEditingIndex(index);
    setEditUser(users[index]._id);
    setModalOpen(true);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditUser('');
    setMessage('');
    setModalOpen(false);
  };

  const toggleModal = () => {
    handleCancelEdit();
    setModalOpen(!modalOpen);
    setMessage('');
    if (!modalOpen) {
      setNewUser('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-4 mx-12">
        <div className="flex flex-row items-center mb-2">
          <h3 className="font-medium text-xl" style={{ ...headingFont }}>Users</h3>
          <FontAwesomeIcon icon={faPlus} className="text-blue-500 cursor-pointer mx-2" onClick={toggleModal} title="Add User" />
        </div>
        {users.length === 0 ? (
          <p style={{ ...paraFont }}>No users added.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs uppercase tracking-wider" style={{ ...navbarFont }}>
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs uppercase tracking-wider" style={{ ...navbarFont }}>
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
                    {/* <FontAwesomeIcon icon={faEdit} className="text-blue-500 cursor-pointer me-4" onClick={() => handleStartEdit(index)} /> */}
                    <FontAwesomeIcon icon={faTrashAlt} className="text-red-500 cursor-pointer" onClick={() => handleDeleteUser(index)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">{editingIndex !== null ? 'Edit User' : 'Add New User'}</h2>
            <div className="mb-4">
              <select
                id="user"
                name="user"
                className="form-select mt-1 block w-full sm:text-sm border border-gray-300 rounded-sm focus:ring focus:ring-green-200 outline-0 p-2"
                value={editingIndex !== null ? editUser : newUser}
                onChange={(e) => editingIndex !== null ? setEditUser(e.target.value) : setNewUser(e.target.value)}
              >
                <option value="">Select a user</option>
                {allUsers.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end">
              <button onClick={toggleModal} className="bg-gray-600 text-white p-2 rounded-sm mr-2">
                Cancel
              </button>
              <button
                onClick={editingIndex !== null ? handleEditUser : handleAddUser}
                className={`bg-${editingIndex !== null ? 'green' : 'blue'}-600 text-white p-2 rounded-sm`}
              >
                {editingIndex !== null ? 'Save' : 'Add User'}
              </button>
            </div>
            {message && <p className="mt-4">{message}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
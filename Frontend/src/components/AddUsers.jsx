import React, { useState, useEffect, useContext} from 'react';
import CreateUsers from './CreateChallenge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';
import ColorContext from '../context/ColorContext';
import FontContext from '../context/FontContext';
import ConfirmationModal from './Challenges/challenges/Partials/ConfirmationModal';
const BT = import.meta.env.VITE_BT;
const WT= import.meta.env.VITE_WT;

// import axios from 'axios';

function AddUsers() {
    const [showModal, setShowModal] = useState(false);
    const { bgColor, textColor, sidenavColor, hoverColor } = useContext(ColorContext);
    const {navbarFont, headingFont, paraFont, updateFontSettings}=useContext(FontContext);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: ''
    });
    const [users, setUsers] = useState([]);
    const [volunteers, setVolunteers] = useState([]);
    const [editUserId, setEditUserId] = useState(null); // Store the ID of the user being edited
    const [file, setFile] = useState(null);
    const [deleteUserId, setDeleteUserId] = useState(null); // State to store the ID of the user to be deleted
    const [deleteUserType, setDeleteUserType] = useState(null); // State to store the type of user (user or volunteer)
    const [showConfirmModal, setShowConfirmModal] = useState(false); // State to control the modal visibility

    useEffect(() => {
        fetchUsers();
        fetchVolunteers();
    }, []);

    const apiUrl = import.meta.env.VITE_Backend_URL;

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/auth/getallusers`, {
                method: 'GET',
                headers: {
                  'Auth-token': localStorage.getItem('Hactify-Auth-token'),
                }
              });
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const fetchVolunteers = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/auth/getallVolunteer`, {
                method: 'GET',
                headers: {
                  'Auth-token': localStorage.getItem('Hactify-Auth-token'),
                }
              });
            const data = await response.json();
            setVolunteers(data);
        } catch (error) {
            console.error('Error fetching volunteers:', error);
        }
    };


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editUserId ? `${apiUrl}/api/auth/updateuser/${editUserId}` : `${apiUrl}/api/auth/createuser`;
            const method = editUserId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Auth-token': localStorage.getItem('Hactify-Auth-token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            console.log('User created/updated:', data);
            setShowModal(false);
            setFormData({
                name: '',
                email: '',
                password: '',
                role: ''
            });
            fetchUsers(); // Fetch updated user data after creation/update
            fetchVolunteers();
        } catch (error) {
            console.error('Error creating/updating user:', error);
        }
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleFileUpload = async () => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(`${apiUrl}/api/flags/upload`, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };


    const closeModal = () => {
        setShowModal(false);
        setFormData({
            name: '',
            email: '',
            password: '',
            role: ''
        });
        setEditUserId(null);
    };

    // Function to populate the form fields when editing a user
    const handleEditUser = (userId, userType) => {

        let userToEdit = null;
        if (userType === 'user') {
            userToEdit = users.find(user => user._id === userId);
        } else if (userType === 'volunteer') {
            userToEdit = volunteers.find(user => user._id === userId);
        }

        // const userToEdit = users.find(user => user._id === userId);
        if (userToEdit) {
            setFormData({
                name: userToEdit.name,
                email: userToEdit.email,
                password: '', // Password should not be pre-filled for security reasons
                role: userToEdit.role
            });
            setEditUserId(userId);
            setShowModal(true);
        }
    };

    const handleDeleteUser = (userId, userType) => {
        setDeleteUserId(userId);
        setDeleteUserType(userType);
        setShowConfirmModal(true); // Show the confirmation modal
    };

  
    // Function to confirm the delete action
    const confirmDelete = async () => {
        try {
            const url = `${apiUrl}/api/auth/deleteuser/${deleteUserId}`;
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Auth-token': localStorage.getItem('Hactify-Auth-token'),
                }
            });
            if (response.ok) {
                // Remove the deleted user from the users or volunteers array
                if (deleteUserType === 'user') {
                    setUsers(users.filter(user => user._id !== deleteUserId));
                } else {
                    setVolunteers(volunteers.filter(volunteer => volunteer._id !== deleteUserId));
                }
                console.log('User deleted successfully');
            } else {
                console.error('Failed to delete user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        } finally {
            setShowConfirmModal(false); // Close the modal after deletion
        }
    };

    // Function to cancel the delete action
    const cancelDelete = () => {
        setShowConfirmModal(false); // Close the modal without deleting
    };

    
    const toggleVisibility = async (userId, userType) => {
        try {
            const url = `${apiUrl}/api/auth/toggleVisibility/${userId}`;
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Auth-token': localStorage.getItem('Hactify-Auth-token'),
                    'Content-Type': 'application/json'
                }
            });
            if (response.ok) {
                // Update the visibility state in the local state
                if (userType === 'user') {
                    setUsers(users.map(user => user._id === userId ? { ...user, userVisibility: !user.userVisibility } : user));
                } else {
                    setVolunteers(volunteers.map(volunteer => volunteer._id === userId ? { ...volunteer, userVisibility: !volunteer.userVisibility } : volunteer));
                }
                console.log('Visibility toggled successfully');
            } else {
                console.error('Failed to toggle visibility');
            }
        } catch (error) {
            console.error('Error toggling visibility:', error);
        }
    };

    return (
        <div className="m-12">
            <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: headingFont.fontFamily, fontSize:headingFont.fontSize }}>Admin Dashboard</h1>
            <hr className='mx-2 my-8 border-black' />
        

            <div className="flex flex-row w-full items-center">
                {/* Button to add user */}
                <button
                    className="cursor-pointer text-white py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 h-[45px]"
                    onClick={() => setShowModal(true)} style={{ backgroundColor: sidenavColor }}
                >
                    Add User
                </button>

                <div className="flex flex-row ms-8">
                    <CreateUsers fetchUsers={fetchUsers} fetchVolunteers={fetchVolunteers}/>
                 
                </div>
            </div>

            {/* Modal for adding a new user */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75">
                    <div className="bg-white rounded-lg p-6 w-full md:w-1/2 lg:w-1/3 overflow-y-auto max-h-96">
                        <h2 className="text-2xl font-bold mb-4"  style={{ fontFamily: headingFont.fontFamily, fontSize:headingFont.fontSize }}>Add User</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700"  style={{ fontFamily: paraFont.fontFamily, fontSize:paraFont.fontSize }}>Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded-md p-2 w-full"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700"  style={{ fontFamily: paraFont.fontFamily, fontSize:paraFont.fontSize }}>Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded-md p-2 w-full"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700"  style={{ fontFamily: paraFont.fontFamily, fontSize:paraFont.fontSize }}>Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded-md p-2 w-full"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label htmlFor="role" className="block text-sm font-medium text-gray-700"  style={{ fontFamily: paraFont.fontFamily, fontSize:paraFont.fontSize }}>Role</label>
                                <select
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="border border-gray-300 rounded-md p-2 w-full"
                                    required
                                >
                                    <option value="">Select Role</option>
                                    <option value={WT}>White Team</option>
                                    <option value={BT}>Blue Team</option>
                                </select>
                            </div>

                            <div className="flex flex-row">
                                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                    Submit
                                </button>
                                <button className="ms-8 text-gray-600" onClick={closeModal}>
                                    CLOSE
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="users mt-12">
                <h1 className="text-xl font-bold mb-4 underline" style={{ fontFamily: headingFont.fontFamily, fontSize:headingFont.fontSize }}>Blue Team: </h1>
                <table className="table-auto w-full border">
                    <thead>
                        <tr>
                            <th className="border border-gray-400 px-4 py-2 w-1/12">SR. NO</th>
                            <th className="border border-gray-400 px-4 py-2 w-4/12">Name</th>
                            <th className="border border-gray-400 px-4 py-2 w-4/12">Email</th>
                            <th className="border border-gray-400 px-4 py-2 w-3/6">Password</th>
                            <th className="border border-gray-400 px-4 py-2 w-1/12">Actions</th>
                            <th className="border border-gray-400 px-4 py-2 w-1/12">Visibility</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users && users.map((user, index) => (
                            <tr key={index}>
                                <td className="border border-gray-400 px-4 py-2">{index + 1}</td>
                                <td className="border border-gray-400 px-4 py-2">{user.name}</td>
                                <td className="border border-gray-400 px-4 py-2">{user.email}</td>
                                <td className="border border-gray-400 px-4 py-2">************</td>
                                <td className="border border-gray-400 px-4 py-2">
                                    <button onClick={() => handleEditUser(user._id, "user")} className="mr-2">Edit</button>
                                    <button
        onClick={() => handleDeleteUser(user._id, "user")}
        className="text-red-500 hover:text-red-700" // Add a button wrapper for better styling and click handling
    >
        <FontAwesomeIcon icon={faTrashCan} />
    </button>
                                </td>
                                <td className="border border-gray-400 px-4 py-2">
                                    <button
                                        className={`w-12 h-6 rounded-full p-1 ${user.userVisibility ? 'bg-green-500' : 'bg-red-500'}`}
                                        onClick={() => toggleVisibility(user._id, "user")}
                                    >
                                        <div className={`h-4 w-4 rounded-full bg-white shadow transform transition-transform ${user.userVisibility ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="volunteers mt-12">
                <h1 className="text-xl font-bold mb-4 underline" style={{ fontFamily: headingFont.fontFamily, fontSize:headingFont.fontSize }}>White Team: </h1>
                <table className="table-auto w-full border">
                    <thead>
                        <tr>
                            <th className="border border-gray-400 px-4 py-2 w-1/12">SR. NO</th>
                            <th className="border border-gray-400 px-4 py-2 w-4/12">Name</th>
                            <th className="border border-gray-400 px-4 py-2 w-4/12">Email</th>
                            <th className="border border-gray-400 px-4 py-2 w-3/6">Password</th>
                            <th className="border border-gray-400 px-4 py-2 w-1/12">Actions</th>
                            <th className="border border-gray-400 px-4 py-2 w-1/12">Visibility</th>
                        </tr>
                    </thead>
                    <tbody>
                        {volunteers && volunteers.map((volunteer, index) => (
                            <tr key={index}>
                                <td className="border border-gray-400 px-4 py-2">{index + 1}</td>
                                <td className="border border-gray-400 px-4 py-2">{volunteer.name}</td>
                                <td className="border border-gray-400 px-4 py-2">{volunteer.email}</td>
                                <td className="border border-gray-400 px-4 py-2">************</td>
                                <td className="border border-gray-400 px-4 py-2">
                                    <button onClick={() => handleEditUser(volunteer._id, "volunteer")} className="mr-2">Edit</button>
                                    <button
        onClick={() => handleDeleteUser(volunteer._id, "volunteer")}
        className="text-red-500 hover:text-red-700" // Add a button wrapper for better styling and click handling
    >
        <FontAwesomeIcon icon={faTrashCan} />
    </button>
                                </td>
                                <td className="border border-gray-400 px-4 py-2">
                                    <button
                                        className={`w-12 h-6 rounded-full p-1 ${volunteer.userVisibility ? 'bg-green-500' : 'bg-red-500'}`}
                                        onClick={() => toggleVisibility(volunteer._id, "volunteer")}
                                    >
                                        <div className={`h-4 w-4 rounded-full bg-white shadow transform transition-transform ${volunteer.userVisibility ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {showConfirmModal && (
                <ConfirmationModal
                    message="Are you sure you want to delete this user?"
                    onConfirm={confirmDelete}
                    onCancel={cancelDelete}
                />
            )}
            </div>
        </div>
        
    );
}

export default AddUsers;

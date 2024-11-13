import React, { useState, useEffect, useContext } from 'react';
import FontContext from '../context/FontContext';
function AssignTeams() {
    const [showModal, setShowModal] = useState(false);
    const [volunteers, setVolunteers] = useState([]);
    const [selectedVolunteer, setSelectedVolunteer] = useState(null);
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const {navbarFont, headingFont, paraFont, updateFontSettings}=useContext(FontContext);

    useEffect(() => {
        fetchVolunteers();
    }, []);

    const apiUrl = import.meta.env.VITE_Backend_URL;

    const fetchVolunteers = async () => {
        try {
            // Fetch volunteers from the backend
            const response = await fetch(`${apiUrl}/api/auth/getallVolunteer`);
            const data = await response.json();
            setVolunteers(data);
        } catch (error) {
            console.error('Error fetching volunteers:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            // Fetch users with role "BT" from the backend
            const response = await fetch(`${apiUrl}/api/auth/getallusers`);
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleAssignTeams = async (volunteerId) => {
        setSelectedVolunteer(volunteerId);
        fetchUsers();
        setShowModal(true);

        // Use the updated volunteers state
        const selectedVolunteer = volunteers.find(volunteer => volunteer._id === volunteerId);

        if (selectedVolunteer) {
            const assignedUserIds = selectedVolunteer.assignedTeams.map(team => team._id);
            setSelectedUsers(assignedUserIds);
        }
    };

    const handleCheckboxChange = (userId) => {
        setSelectedUsers((prevSelectedUsers) => {
            const updatedUsers = new Set(prevSelectedUsers);

            if (updatedUsers.has(userId)) {
                updatedUsers.delete(userId);
            } else {
                updatedUsers.add(userId);
            }

            return Array.from(updatedUsers);
        });
    };

    const assignUsers = async () => {
        try {
            // Send a request to the backend to assign selected users to the volunteer
            const response = await fetch(`${apiUrl}/api/auth/addUsers/${selectedVolunteer}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ selectedUserIds: selectedUsers })
            });
            const data = await response.json();
            console.log('Users assigned to team successfully:', data);
            setShowModal(false);
        } catch (error) {
            console.error('Error assigning users to team:', error);
        }
    };

    const removeUsers = async () => {
        // Remove users who are no longer selected
        const unselectedUsers = users.filter(user => !selectedUsers.includes(user._id));

        try {
            // Send a request to the backend to remove unselected users from the volunteer
            const response = await fetch(`${apiUrl}/api/auth/removeUsers/${selectedVolunteer}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ unselectedUserIds: unselectedUsers.map(user => user._id) })
            });
            const data = await response.json();
            console.log('Users removed from team successfully:', data);
        } catch (error) {
            console.error('Error removing users from team:', error);
        }
    };

    const handleAssignTeamsSubmit = async () => {
        await assignUsers();
        await removeUsers();
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div className="m-12">
            <h1 className="text-3xl font-bold mb-4" style={{fontFamily:headingFont}}>Admin Dashboard</h1>
            <hr className='mx-2 my-8 border-black' />

            <div className="volunteers mt-12">
                <h1 className="text-xl font-bold mb-4 underline" style={{fontFamily:headingFont}}>White Team:</h1>
                <table className="table-auto w-full border " style={{fontFamily:paraFont}}>
                    <thead>
                        <tr>
                            <th className="border border-gray-400 px-4 py-2">SR. NO</th>
                            <th className="border border-gray-400 px-4 py-2">Name</th>
                            <th className="border border-gray-400 px-4 py-2">Email</th>
                            <th className="border border-gray-400 px-4 py-2">Assigned Teams</th>
                            <th className="border border-gray-400 px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {volunteers.map((volunteer, index) => (
                            <tr key={volunteer._id}>
                                <td className="border border-gray-400 px-4 py-2" style={{fontFamily:paraFont}}>{index + 1}</td>
                                <td className="border border-gray-400 px-4 py-2">{volunteer.name}</td>
                                <td className="border border-gray-400 px-4 py-2">{volunteer.email}</td>
                                <td className="border border-gray-400 px-4 py-2">
                                    {volunteer.assignedTeams && volunteer.assignedTeams.length > 0
                                        ? volunteer.assignedTeams.map(team => team.name).join(', ')
                                        : 'No assigned teams'}
                                </td>
                                <td className="border  border-gray-400 px-4 py-2 text-indigo-500 hover:underline hover:text-indigo-800 ">
                                    <button onClick={() => handleAssignTeams(volunteer._id)}style={{fontFamily:navbarFont.fontFamily, fontSize:navbarFont.fontSize}}>Assign Teams</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-75">
                    <div className="bg-white rounded-lg p-6 w-full md:w-1/2 lg:w-1/3 overflow-y-auto max-h-96">
                        <h2 className="text-2xl font-bold mb-4" style={{fontFamily:headingFont}}>Assign Teams</h2>
                        <form onSubmit={handleAssignTeamsSubmit}>
                            {users.map((user) => (
                                <div key={user._id} className="mb-2">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={selectedUsers.includes(user._id)}
                                            onChange={() => handleCheckboxChange(user._id)}
                                        />
                                        {user.name}
                                    </label>
                                </div>
                            ))}
                            <div className="flex flex-row items-center">
                                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Assign Teams</button>
                                <button onClick={handleCloseModal} className="text-red-500 hover:underline font-bold ms-4 rounded">Close</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AssignTeams;

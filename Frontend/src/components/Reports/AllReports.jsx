import React, { useEffect, useState,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import FontContext from '../../context/FontContext';
import { formatDate } from '../../assets/utils/formatDate';
import ReusableTable from '../Challenges/challenges/Partials/InfoTable';
import ConfirmationModal from '../Challenges/challenges/Partials/ConfirmationModal';


const AllReports = () => {
    const [reports, setReports] = useState([]);
    const [selectedReports, setSelectedReports] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const {navbarFont, headingFont, paraFont, updateFontSettings}=useContext(FontContext);
    const [showModal, setShowModal] = useState(false); // State to manage modal visibility
    const [message, setMessage] = useState(""); // State to store the confirmation message
    const [reportsToDelete, setReportsToDelete] = useState([]);

    const apiUrl = import.meta.env.VITE_Backend_URL;

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await fetch(`${apiUrl}/api/reports/`);
                if (!response.ok) {
                    throw new Error('Error fetching reports');
                }
                const data = await response.json();

                // Format dates
                const formattedData = data.map(report => ({
                    ...report,
                    deadline: formatDate(report.deadline),
                    createdAt: formatDate(report.createdAt),
                }));

                setReports(formattedData);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchReports();
    }, []);

    const handleRowClick = (reportId, event) => {
        // Handle row click logic here
        console.log(`Report clicked: ${reportId}`);
        if (!event.target.closest('input[type="checkbox"]')) {
            navigate(`/admin/report/details/${reportId}`);
          }
    };

    const handleSelectReport = (reportId) => {
        setSelectedReports((prevSelected) =>
            prevSelected.includes(reportId)
                ? prevSelected.filter((id) => id !== reportId)
                : [...prevSelected, reportId]
        );
    };

    const handleSelectAllReports = () => {
        if (selectedReports.length === reports.length) {
            setSelectedReports([]);
        } else {
            setSelectedReports(reports.map((report) => report._id));
        }
    };

    const handleDeleteReports = async () => {
        try {
            console.log('Deleting reports:', selectedReports);
            const response = await fetch(`${apiUrl}/api/reports/deleteReport`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ids: selectedReports })
            })
            if (response.ok) {
                const result = response.json();
                console.log(result.message);
                setReports(prevReport => prevReport.filter(report => !selectedReports.includes(report._id)))
                setSelectedReports([]);
            } else {
                console.error('Error deleting challenges:', await response.json());
            }
            setShowModal(false);
        } catch (error) {
            console.error('Error deleting challenges:', await response.json());
        }
        finally {
            setShowModal(false); // Close the modal after deletion
        }
    };

    const handleShowModal = () => {
        setMessage('Are you sure you want to delete the selected reports?');
        setReportsToDelete(selectedReports);
        setShowModal(true);
    };
    const handleCancelModal = () => {
        setShowModal(false);
    };

    const columns = [
        { header: 'ID', accessor: '_id' },
        { header: 'Name', accessor: 'name' },
        { header: 'Description', accessor: 'description' },
        { header: 'Deadline', accessor: 'deadline' },
        { header: 'Created At', accessor: 'createdAt' },
        { header: 'Visibility', accessor: 'visibility' },
    ];

    return (
        <div className="container mx-auto p-4 my-8 w-full">
            {error && <div className="text-red-500">{error}</div>}
            <ReusableTable
                data={reports}
                columns={columns}
                onRowClick={handleRowClick}
                selectedItems={selectedReports}
                onItemSelect={handleSelectReport}
                onSelectAll={handleSelectAllReports}
                onDelete={handleShowModal}
            />

{showModal && (
                <ConfirmationModal
                    message={message}
                    onConfirm={handleDeleteReports}
                    onCancel={handleCancelModal}
                />
            )}
        </div>
    );
};

export default AllReports;

import React, { useEffect, useState,useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import FontContext from '../../context/FontContext';

import { formatDate } from '../../assets/utils/formatDate';

import ReusableTable from '../Challenges/challenges/Partials/InfoTable';


const AllReports = () => {
    const [reports, setReports] = useState([]);
    const [selectedReports, setSelectedReports] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const {navbarFont, headingFont, paraFont, updateFontSettings}=useContext(FontContext);

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
        } catch (error) {
            console.error('Error deleting challenges:', await response.json());
        }
    };

    const columns = [
        { header: 'ID', accessor: '_id' },
        { header: 'Name', accessor: 'name' },
        { header: 'Description', accessor: 'description' },
        { header: 'Deadline', accessor: 'deadline' },
        { header: 'Created At', accessor: 'createdAt' },
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
                onDelete={handleDeleteReports}
            />
        </div>
    );
};

export default AllReports;

import React, { useState, useEffect } from 'react';
import Table from '../../../Table';
import HeaderFooter from './HeaderFooter'
import ReportConfigModal from './ReportConfigModal'


const ReportConfigTable = ({ reportId }) => {
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        const fetchReportConfig = async () => {
            try {
                const response = await fetch(`http://localhost:80/api/reportConfig/${reportId}`);
                const data = await response.json();
                setConfig(data);
            } catch (error) {
                console.error('Error fetching report configuration:', error);
                setError('Failed to fetch report configuration.');
            } finally {
                setLoading(false);
            }
        };

        fetchReportConfig();
    }, [reportId]);

    const columns = [
        { header: 'Feature', accessor: 'feature' },
        { header: 'Content', accessor: 'content' },
    ];

    // const data1 = [
    //     { feature: 'Header', content: configurations.header || 'N/A' },
    //     { feature: 'Footer', content: configurations.footer || 'N/A' },
    //     { feature: 'First Page Text', content: configurations.firstPageText || 'N/A' },
    //     { feature: 'Last Page Text', content: configurations.lastPageText || 'N/A' },
    //     { feature: 'Page Numbers', content: configurations.pageNumbersEnabled ? 'Enabled' : 'Disabled' },
    // ];

    const data = config ? [
        {
            feature: 'Header',
            content: config.header?.imageUrl ? (
                <img
                    src={`http://localhost/uploads/headers/${config.header.imageUrl}`}
                    alt="Header"
                    className="h-12 mx-auto"
                />
            ) : 'No header configured',
        },
        {
            feature: 'Footer',
            content: config.footer?.imageUrl ? (
                <img
                    src={`http://localhost/uploads/footers/${config.footer.imageUrl}`}
                    alt="Footer"
                    className="h-12 mx-auto"
                />
            ) : 'No footer configured',
        },
        {
            feature: 'First Page Text',
            content: config.firstPage?.length ? (
                config.firstPage.map((info, index) => (
                    <div key={index}>
                        <p>{info.text}</p>
                        <p className="text-xs text-gray-500">Margin: {info.margin}, Y: {info.coordinateY}</p>
                    </div>
                ))
            ) : 'No first page text configured',
        },
        {
            feature: 'Last Page Text',
            content: config.lastPage?.length ? (
                config.lastPage.map((info, index) => (
                    <div key={index}>
                        <p>{info.text}</p>
                        <p className="text-xs text-gray-500">Margin: {info.margin}, Y: {info.coordinateY}</p>
                    </div>
                ))
            ) : 'No last page text configured',
        },
        {
            feature: 'Page Numbers Enabled',
            content: config.enablePageNumber ? 'Enabled' : 'Disabled',
        },
    ] : [];


    const handleDelete = () => {
        console.log("Delete action triggered for selected items: ", selectedItems);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    if (!config) {
        return <div>No configuration found for this report.</div>;
    }

    return (
        <div className="container mx-auto px-6">
            <div className="flex flex-row items-center">
                <h2 className="text-2xl font-semibold">Report Configurations</h2>
                <div className="flex flex-row">
                <HeaderFooter reportId={reportId} />
                <ReportConfigModal reportId={reportId} />
            </div>
            </div>
            <Table columns={columns} data={data} onEdit={() => { }} onDelete={() => { }} editButtonReq={false} />
        </div>
    );
};

export default ReportConfigTable;
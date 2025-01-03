import React, { useEffect, useState, useContext } from 'react';
import InfoTable from '../../../Partials/InfoTable'; 
import PageHeader from '../../../../navbar/PageHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStopCircle } from '@fortawesome/free-solid-svg-icons';
import FontContext from '../../../../../../context/FontContext';

const DockerManagement = () => {
    const apiUrl = import.meta.env.VITE_Backend_URL;
    const [images, setImages] = useState([]);
    const [services, setServices] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch font settings from context
    const { navbarFont, headingFont, paraFont } = useContext(FontContext);

    useEffect(() => {
        fetchImages();
        fetchServices();
    }, []);

    const fetchImages = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/docker/images`);
            const data = await response.json();
            setImages(data);
        } catch (error) {
            setError('Failed to fetch images');
        } finally {
            setLoading(false);
        }
    };

    const fetchServices = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/docker/services`);
            const data = await response.json();
            if (Array.isArray(data)) {
                setServices(data);
            } else {
                setServices([]);
                setError('Something went wrong!!');
            }
        } catch (error) {
            setError('Failed to fetch services');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (selectedImages.length === 0) return;

        for (const id of selectedImages) {
            await fetch(`${apiUrl}/api/docker/images/${id}`, {
                method: 'DELETE',
            });
        }

        fetchImages();
        setSelectedImages([]);
    };

    const handleStopContainer = async (containerId) => {
        await fetch(`${apiUrl}/api/docker/stop/container`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ containerId }),
        });

        fetchServices();
    };

    const columns = [
        { header: 'ID', accessor: '_id' },
        { header: 'Image Name', accessor: 'name' },
        { header: 'Port', accessor: 'port' },
    ];

    const serviceColumns = [
        { header: 'Service ID', accessor: 'id' },
        { header: 'Service Name', accessor: 'name' },
        { header: 'Replicas', accessor: 'replicas' },
        { header: 'Image', accessor: 'image' },
        { header: 'Ports', accessor: 'ports' },
    ];

    return (
        <div className="">
            <PageHeader pageTitle="Docker Manager" route="/challenges/docker" checkRoute='' />
            {error && <div style={{ ...paraFont, color: 'red' }}>{error}</div>}
            {loading ? (
                <div style={paraFont}>Loading...</div>
            ) : (
                <div className='m-8'>
                    <h2 style={headingFont} className="mb-4">Docker Images</h2>
                    <InfoTable
                        data={images}
                        columns={columns}
                        selectedItems={selectedImages}
                        onRowClick={(id) => console.log(`Image clicked: ${id}`)}
                        onItemSelect={(id) => {
                            setSelectedImages((prev) =>
                                prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
                            );
                        }}
                        onSelectAll={() => {
                            if (selectedImages.length === images.length) {
                                setSelectedImages([]);
                            } else {
                                setSelectedImages(images.map((image) => image._id));
                            }
                        }}
                        onDelete={handleDelete}
                    />
                    
                    <h2 style={headingFont} className="mb-4">Docker Services</h2>
                    <InfoTable
                        data={services}
                        columns={serviceColumns}
                        selectedItems={selectedServices}
                        onRowClick={(id) => console.log(`Service clicked: ${id}`)}
                        onItemSelect={(id) => {
                            setSelectedServices((prev) =>
                                prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
                            );
                        }}
                        onSelectAll={() => {
                            if (selectedServices.length === services.length) {
                                setSelectedServices([]);
                            } else {
                                setSelectedServices(services.map((service) => service.id));
                            }
                        }}
                        onDelete={() => console.log('Delete services logic here')}
                    />
                    
                    {services && services.map((service) => (
                        <div key={service.id} className="flex items-center justify-between mb-2">
                            <span style={navbarFont}>{service.name}</span>
                            <FontAwesomeIcon
                                icon={faStopCircle}
                                className="text-red-500 cursor-pointer"
                                onClick={() => handleStopContainer(service.id)}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DockerManagement;

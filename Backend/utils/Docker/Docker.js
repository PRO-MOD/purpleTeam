const Docker = require('dockerode');
const docker = new Docker({
    host: '20.84.119.195', // Azure instance public IP
    port: 2375,            // Port Docker is exposed on (2375 for non-TLS, 2376 for TLS)
});

// List all Docker images available locally
const listDockerImages = async () => {
    try {
        const images = await docker.listImages();
        // console.log('Available Images:', images);
        const imageNames = [];
        images.forEach(image => {
            imageNames.push(image.RepoTags[0])
        })

        return imageNames;
    } catch (err) {
        console.error('Error listing images:', err);
    }
};

// Get details of a specific image by name or ID
const getImageDetails = async (imageName) => {
    try {
        const image = docker.getImage(imageName);
        const imageDetails = await image.inspect();
        // console.log('Image Details:', imageDetails);
        return imageDetails;
    } catch (err) {
        console.error('Error fetching image details:', err);
    }
};

const checkImageExists = async (imageName) => {
    try {
        // List all images from Docker
        const images = await docker.listImages();
        
        // Check if the specified image name exists in the list
        return images.some(image => {
            return image.RepoTags && image.RepoTags.includes(imageName)
        });
    } catch (error) {
        console.error('Error checking if Docker image exists:', error);
        throw new Error('Docker image check failed');
    }
};

// Check if an image exists, if not, pull it
const pullDockerImage = async (imageName) => {
    try {
        // Try to get the image details
        const image = docker.getImage(imageName);
        const imageDetails = await image.inspect();

        console.log(`Image ${imageName} already exists locally.`);
        return imageDetails;
    } catch (err) {
        console.log(`Image ${imageName} not found locally. Pulling from Docker Hub...`);

        // Return a promise for pulling the image
        return new Promise((resolve, reject) => {
            docker.pull(imageName, (error, stream) => {
                if (error) {
                    console.error('Error pulling image:', error);
                    return reject(error);
                }

                // Follow the progress of pulling the image
                docker.modem.followProgress(
                    stream,
                    (err, output) => {
                        if (err) {
                            console.error('Error after pulling the image:', err);
                            return reject(err);
                        }
                        console.log(`Image ${imageName} pulled successfully.`);

                        // After pulling, return the image details
                        docker.getImage(imageName).inspect()
                            .then((details) => resolve(details))
                            .catch((err) => reject(err));
                    },
                    onProgress
                );

                // Function to track the progress of pulling the image
                function onProgress(event) {
                    if (event.progressDetail && event.progressDetail.total) {
                        const current = event.progressDetail.current || 0;
                        const total = event.progressDetail.total;
                        const percentage = ((current / total) * 100).toFixed(2);
                        console.log(`Progress: ${percentage}% (${current}/${total})`);
                    } else if (event) {
                        // console.log(event.status);
                    }
                }
            });
        });
    }
};


const deleteDockerImage = async (imageName) => {
    try {
        // Get the list of containers using the image
        const containers = await docker.listContainers({ all: true });

        // Stop and remove containers using the image
        for (const containerInfo of containers) {
            if (containerInfo.Image === imageName) {
                const container = docker.getContainer(containerInfo.Id);
                
                // Stop the container
                await container.stop();
                console.log(`Stopped container ${containerInfo.Id}`);
                
                // Remove the container
                await container.remove();
                console.log(`Removed container ${containerInfo.Id}`);
            }
        }

        // Pull the image
        const image = docker.getImage(imageName);

        // Remove the image
        await image.remove();

        console.log(`Docker image ${imageName} deleted successfully.`);
        return true;
    } catch (error) {
        console.error(`Error deleting Docker image ${imageName}:`, error);
        throw new Error('Failed to delete Docker image.');
    }
};

// creatconatiner of docker is similar to create service of swarm
const createContainer = async (serviceName, imageName, port, flags) => {
    try {
        const service = await docker.createService({
            Name: serviceName,
            TaskTemplate: {
                ContainerSpec: {
                    Image: imageName,
                    Env: Object.keys(flags).map(key => `${key}=${flags[key]}`), // Set environment variables
                    ExposedPorts: {
                        [`${port}/tcp`]: {}
                    },
                },
            },
            Mode: {
                Replicated: {
                    Replicas: 1, // Always set replicas to 1
                },
            },
            EndpointSpec: {
                Ports: [{
                    TargetPort: port, // The port your application listens on inside the container
                    PublishedPort: 0, // Use dynamic port (0 means Docker chooses a random port)
                    Protocol: 'tcp',
                }],
            },
        });

        // console.log(`Service ${serviceName} created successfully.`);

        const serviceInfo = await service.inspect();
        const serviceId = await serviceInfo.ID;
        return serviceId;
    } catch (error) {
        console.error('Error creating service:', error);
        throw error; // It's good to throw the error so it can be handled by the caller
    }
};

// Get the worker node IP and published port for the running service
const getServiceIPandPort = async (serviceName) => {
    return new Promise((resolve, reject) => {
        
        docker.getService(serviceName).inspect((err, serviceData) => {
            if (err) {
                return reject(`Error fetching service: ${err}`);
            }

            // Ensure that there are exposed ports in the service
            if (!serviceData.Endpoint || !serviceData.Endpoint.Ports || serviceData.Endpoint.Ports.length === 0) {
                return reject(`No ports found for service ${serviceName}`);
            }

            const publishedPort = serviceData.Endpoint.Ports[0].PublishedPort;

            // List all tasks and filter for the current service
            docker.listTasks((err, tasks) => {
                if (err) {
                    return reject(`Error listing tasks: ${err}`);
                }

                // Filter tasks related to the specific service
                const serviceTasks = tasks.filter(task => task.ServiceID === serviceData.ID);

                if (serviceTasks.length === 0) {
                    return reject(`No tasks found for service ${serviceName}`);
                }

                for (let task of serviceTasks) {
                    if (task.Status.State === 'running') {
                        const nodeId = task.NodeID;

                        // Fetch node information to get the IP address of the worker node
                        docker.getNode(nodeId).inspect((err, nodeData) => {
                            if (err) {
                                return reject(`Error fetching node data: ${err}`);
                            }

                            const workerNodeIP = nodeData.Status.Addr;  // Get the IP address of the worker node
                            // console.log(`Service is running on worker node IP: ${workerNodeIP}`);

                            // Return the full access URL
                            const accessUrl = `http://${workerNodeIP}:${publishedPort}`;
                            // console.log(`You can access the service at: ${accessUrl}`);
                            return resolve({ accessUrl, workerNodeIP, publishedPort });
                        });

                        return; // Stop after finding the first running task
                    }
                }

                // If no running task is found, reject with an appropriate message
                reject(`No running tasks found for service ${serviceName}`);
            });
        });
    });
};


// Generate a URL by creating the service and fetching the running service details
const generateUrl = async (serviceName, imageName, port, flags) => {
    try {
        // Create the service
        const serviceId = await createContainer(serviceName, imageName, port, flags);
        
        if (serviceId) {
            // Get the IP and port for the running service
            const { accessUrl } = await getServiceIPandPort(serviceName);
            if (accessUrl) {
                return { url: accessUrl, containerId: serviceId };
            }
        }
    } catch (error) {
        console.error('Error generating service URL:', error);
        throw error;
    }
};

const stopContainer = async (containerId) => {
    try {
        // Get the container instance
        const container = docker.getService(containerId);
        
        // Stop the container
        await container.remove(); // deletes container
        // console.log(`Container ${containerId} stopped successfully.`);
    } catch (error) {
        console.error('Error stopping container:', error);
        throw error;
    }
};

// generateUrl('chinmay0910/docker-basic-app');
module.exports = {
    listDockerImages,
    getImageDetails,
    pullDockerImage,
    deleteDockerImage,
    generateUrl,
    stopContainer,
    checkImageExists
}
const Docker = require('dockerode');
const docker = new Docker();

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

const createContainer = async (imageName, ports, flags) => {
    try {
        const container = await docker.createContainer({
            Image: imageName,
            Env: Object.keys(flags).map(key => `${key}=${flags[key]}`),
            ExposedPorts: ports.reduce((acc, port) => {
                acc[`${port}/tcp`] = {};
                return acc;
            }, {}),
            HostConfig: {
                PortBindings: ports.reduce((acc, port) => {
                    acc[`${port}/tcp`] = [{ HostPort: '0' }];
                    return acc;
                }, {})
            }
        });
        
        await container.start();
        
        const containerInfo = await container.inspect();
        const containerId = containerInfo.Id;
        return containerId;
    } catch (error) {
        console.error('Error creating container:', error);
    }
}

const getContainerPort = async (containerId) => {
    try {
        const container = docker.getContainer(containerId);
        const containerInfo = await container.inspect();

        const hostPort = containerInfo.NetworkSettings.Ports['5000/tcp'][0].HostPort;
        
        return hostPort;
    } catch (error) {
        console.error('Error retrieving container port:', error);
    }
}


const generateUrl = async (imageName, port, flags) => {
    const containerId = await createContainer(imageName, [port], flags);
    if (containerId) {
        const hostPort = await getContainerPort(containerId);
        if (hostPort) {
            const url = `http://localhost:${hostPort}`;
            // console.log('Application URL:', url);
            return {"url": url, "containerId": containerId};
        }
    }
}

const stopContainer = async (containerId) => {
    try {
        // Get the container instance
        const container = docker.getContainer(containerId);
        
        // Stop the container
        await container.stop();   // stops running container
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
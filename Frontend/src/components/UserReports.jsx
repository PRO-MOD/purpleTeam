import React, { useState, useEffect, useContext } from "react";
import ColorContext from "../context/ColorContext";
import FontContext from "../context/FontContext";

function UserReports({ userId, route }) {
  const [reports, setReports] = useState([]);
  const {navbarFont, headingFont, paraFont, updateFontSettings}=useContext(FontContext);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [assignedScores, setAssignedScores] = useState([]);
  const [penalty, setPenalty] = useState(0);
  const [images, setImages] = useState([]);
  const [showImagesModal, setShowImagesModal] = useState(false);
  const { bgColor, textColor, sidenavColor, hoverColor } = useContext(ColorContext);

  const viewImages = (responseId) => {
    fetch(`${apiUrl}/api/responses/images/${responseId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Auth-token": localStorage.getItem("Hactify-Auth-token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setImages(data.images);
          setShowImagesModal(true);
        } else {
          console.error("Failed to fetch images");
        }
      })
      .catch((err) => console.error("Error fetching images:", err));
  };

  const openImagesModal = (imagePaths) => {
    setImages(imagePaths);
    setShowImagesModal(true);
  };


  const fetchImageBlob = async (imagePath) => {
    try {
      const response = await fetch(`${apiUrl}/${imagePath}`, {
        method: "GET",
        headers: {
          "Auth-token": localStorage.getItem("Hactify-Auth-token"),
        },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch the image");
      }
  
      // Convert response to a blob
      const blob = await response.blob();
  
      // Create a URL for the blob
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error("Error fetching the image:", error);
      return null; // Return null if an error occurs
    }
  };
  // Modal to display images
  // const ImagesModal = () => (
  //   <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
  //     <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-3xl max-h-[80%] overflow-y-auto">
  //       <h3 className="text-xl font-semibold mb-4">Images</h3>
  //       <div className="flex flex-col gap-4">
  //         {images.map((image, index) => (
  //           <img
  //             key={index}
  //             src={`${apiUrl}/${image}`}
  //             alt={`Image ${index + 1}`}
  //             className="w-full h-auto object-cover rounded"
  //           />
  //         ))}
  //       </div>
  //       <button
  //         onClick={() => setShowImagesModal(false)}
  //         className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mt-4"
  //       >
  //         Close
  //       </button>
  //     </div>
  //   </div>
  // );

  const ImagesModal = () => {
    const [imageURLs, setImageURLs] = useState([]);
  
    // Fetch all image blobs when the modal is shown
    useEffect(() => {
      const fetchAllImages = async () => {
        const urls = await Promise.all(
          images.map((image) => fetchImageBlob(image))
        );
        setImageURLs(urls.filter((url) => url !== null)); // Filter out failed URLs
      };
  
      fetchAllImages();
    }, [images]);
  
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-3xl max-h-[80%] overflow-y-auto">
          <h3 className="text-xl font-semibold mb-4">Images</h3>
          <div className="flex flex-col gap-4">
            {imageURLs.map((imageURL, index) => (
              <img
                key={index}
                src={imageURL}
                alt={`Image ${index + 1}`}
                className="w-full h-auto object-cover rounded"
              />
            ))}
          </div>
          <button
            onClick={() => setShowImagesModal(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mt-4"
          >
            Close
          </button>
        </div>
      </div>
    );
  };

  const apiUrl = import.meta.env.VITE_Backend_URL;

  useEffect(() => {
    if (!userId) return;

    fetch(`${apiUrl}/api/responses/all/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("Hactify-Auth-token"),
      },
    })
      .then((res) => res.json())
      .then((data) => setReports(data))
      .catch((err) => console.error("Error fetching reports:", err));
  }, [userId, apiUrl]);

  const viewDetails = (responseId) => {
    fetch(`${apiUrl}/api/responses/detail/${responseId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("Hactify-Auth-token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setSelectedReport(data);
        setAssignedScores(
          data.responses.map((response) => ({
            ...response,
            assignedScore: response.assignedScore || 0,
          }))
        );
        setPenalty(data.penaltyScore || 0);
        setShowModal(true);
      })
      .catch((err) => console.error("Error fetching response details:", err));
  };

  const viewReport = (reportId, userId, responseId) => {
    // console.log(reportId, userId, responseId);

    fetch(
      `${apiUrl}/api/generatePDF/generateReport/${reportId}/${userId}/${responseId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("Hactify-Auth-token"),
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.fileName) {
          // const pdfUrl = `${apiUrl}/uploads/Report/${data.fileName}`;
          // window.open(pdfUrl, "_blank");
          handleGeneratePDF(data.fileName); 
        } else {
          console.error("Failed to generate or retrieve PDF");
        }
      })
      .catch((err) => console.error("Error viewing report:", err));
  };

  const handleGeneratePDF = async (reportData) => {
    try {
      // Make a fetch request to the backend to retrieve the file
      const response = await fetch(
        `${apiUrl}/uploads/Report/${reportData}`,
        {
          method: "GET",
          headers: {
            "auth-token": localStorage.getItem("Hactify-Auth-token"),
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch the PDF file");
      }

      // Convert the response to a blob
      const blob = await response.blob();

      // Create a URL for the blob and open it in a new tab
      const fileUrl = URL.createObjectURL(blob);
      window.open(fileUrl, "_blank");

      // Clean up the created URL after the file is opened
      URL.revokeObjectURL(fileUrl);
    } catch (error) {
      console.error("Error fetching the PDF:", error);
    }
  };

  const handleScoreChange = (index, value) => {
    setAssignedScores((prevScores) => {
      const updatedScores = [...prevScores];
      updatedScores[index].assignedScore = Math.max(
        0,
        Math.min(value, updatedScores[index].maxScore)
      );
      return updatedScores;
    });
  };

  const handlePenaltyChange = (value) => {
    setPenalty(Math.max(0, value));
  };

  const handleUpdateScores = () => {
    const updatedResponses = assignedScores.map(
      ({ questionId, assignedScore }) => ({
        questionId,
        assignedScore,
      })
    );

    const totalAssignedScore = assignedScores.reduce(
      (sum, { assignedScore }) => sum + assignedScore,
      0
    );
    const finalScore = totalAssignedScore - penalty;

    fetch(`${apiUrl}/api/responses/update/${selectedReport._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("Hactify-Auth-token"),
      },
      body: JSON.stringify({
        updatedResponses,
        penaltyScore: penalty,
        finalScore,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.error) {
          console.error("Error updating scores:", result.error);
          return;
        }
        setShowModal(false);
        setReports(
          reports.map((report) =>
            report._id === selectedReport._id
              ? { ...report, finalScore }
              : report
          )
        );
      })
      .catch((err) => console.error("Error updating scores:", err));
  };

  return (
    <div className="p-4"  style={{ fontFamily: paraFont.fontFamily, fontSize:paraFont.fontSize }}>
      <h2 className="text-2xl font-bold mb-4"style={{ fontFamily: headingFont.fontFamily, fontSize:headingFont.fontSize }}>User Reports</h2>
      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-4 py-2 border-b">Report Name</th>
            <th className="px-4 py-2 border-b">Date</th>
            <th className="px-4 py-2 border-b">Time</th>
            <th className="px-4 py-2 border-b">Total Score</th>
            <th className="px-4 py-2 border-b">Action</th>
            <th className="px-4 py-2 border-b">View Report</th>
            <th className="px-4 py-2 border-b">View images </th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report._id}>
              <td className="px-4 py-2 border-b">{report.reportName}</td>
              <td className="px-4 py-2 border-b">{report.responseDate}</td>
              <td className="px-4 py-2 border-b">{report.responseTime}</td>
              <td className="px-4 py-2 border-b">{report.finalScore || 0}</td>
              <td className="px-4 py-2 border-b">
                <button
                  onClick={() => viewDetails(report._id)}
                  className=" transition duration-300 ease-in-out transform hover:scale-105 text-white font-bold py-2 px-4 rounded" style={{backgroundColor:sidenavColor, fontFamily: navbarFont}}
                >
                  {route === "progress" ? "Detailed Score" : "Assign"}
                </button>
              </td>
              <td className="px-4 py-2 border-b">
                <button
                  onClick={() =>
                    viewReport(report.reportId, userId, report._id)
                  }
                  className=" transition duration-300 ease-in-out transform hover:scale-105 text-white font-bold py-2 px-4 rounded" style={{backgroundColor:sidenavColor, fontFamily: navbarFont}}
                >
                  View
                </button>
              </td>
              <td className="px-4 py-2 border-b">
                <button
                  onClick={() => viewImages(report._id)}
                  className=" transition duration-300 ease-in-out transform hover:scale-105 text-white font-bold py-2 px-4 rounded" style={{backgroundColor:sidenavColor, fontFamily: navbarFont}}
                >
                  View Images
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && selectedReport && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-3xl max-h-[80%] overflow-y-scroll">
            <h3 className="text-xl font-semibold mb-4" style={{ fontFamily: headingFont.fontFamily, fontSize:headingFont.fontSize }}>
              {selectedReport.reportName}
            </h3>
            <p className="mb-2">Date: {selectedReport.responseDate}</p>
            <p className="mb-4">Time: {selectedReport.responseTime}</p>
            <table className="table-auto w-full border-collapse border border-gray-200 mb-4">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-4 py-2 border-b">Question</th>
                  <th className="px-4 py-2 border-b">Answer</th>
                  <th className="px-4 py-2 border-b">Max Score</th>
                  <th className="px-4 py-2 border-b">Assigned Score</th>
                </tr>
              </thead>
              <tbody>
                {assignedScores.map((response, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 border-b">{response.question}</td>
                    <td className="px-4 py-2 border-b">
                      {Array.isArray(response.answer) ? (
                        <div>
                          {response.answer.every((path) =>
                            /\.(png|jpe?g)$/i.test(path)
                          )
                            ? // Case 1: Array of image paths
                              response.answer.map((path, i) => (
                                <button
                                  key={i}
                                  onClick={() =>
                                    openImagesModal(response.answer)
                                  }
                                  className="text-blue-600 hover:underline mr-2"
                                 style={{ fontFamily: navbarFont.fontFamily, fontSize: navbarFont.fontSize }}>
                                  {`img${i + 1}`}
                                </button>
                              ))
                            : // Case 2: Array of strings
                              response.answer.join(", ")}
                        </div>
                      ) : /\.(png|jpe?g)$/i.test(response.answer) ? (
                        // Case 3: Single image path
                        <button
                          onClick={() => openImagesModal([response.answer])}
                          className="text-blue-600 hover:underline"style={{ fontFamily: navbarFont.fontFamily, fontSize: navbarFont.fontSize }}
                        >
                          View Image
                        </button>
                      ) : (
                        // Case 4: Single string
                        response.answer
                      )}
                    </td>

                    <td className="px-4 py-2 border-b">{response.maxScore}</td>
                    <td className="px-4 py-2 border-b">
                      <input
                        type="number"
                        value={response.assignedScore}
                        onChange={(e) =>
                          handleScoreChange(index, Number(e.target.value))
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded"
                        disabled={route === "progress"}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3" className="px-4 py-2 border-b font-semibold">
                    Total Assigned Score:
                  </td>
                  <td className="px-4 py-2 border-b">
                    {assignedScores.reduce(
                      (sum, { assignedScore }) => sum + assignedScore,
                      0
                    )}
                  </td>
                </tr>
                <tr>
                  <td colSpan="3" className="px-4 py-2 border-b font-semibold">
                    Penalty:
                  </td>
                  <td className="px-4 py-2 border-b">
                    <input
                      type="number"
                      value={penalty}
                      onChange={(e) =>
                        handlePenaltyChange(Number(e.target.value))
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded"
                      disabled={route === "progress"}
                    />
                  </td>
                </tr>
                <tr>
                  <td colSpan="3" className="px-4 py-2 font-semibold">
                    Final Score:
                  </td>
                  <td className="px-4 py-2">
                    {assignedScores.reduce(
                      (sum, { assignedScore }) => sum + assignedScore,
                      0
                    ) - penalty}
                  </td>
                </tr>
              </tfoot>
            </table>
            {route !== "progress" && (
              <button
                onClick={handleUpdateScores}
                className=" transition duration-300 ease-in-out transform hover:scale-105 text-white font-bold py-2 px-4 rounded"
                style={{backgroundColor:sidenavColor, fontFamily: navbarFont}}
              >
                Save Scores
              </button>
            )}
            <button
              onClick={() => setShowModal(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 ml-2" style={{ fontFamily: navbarFont.fontFamily, fontSize: navbarFont.fontSize }}
            >
              Close
            </button>
          </div>
        </div>
      )}
      {showImagesModal && <ImagesModal />}
    </div>
  );
}

export default UserReports;

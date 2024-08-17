// import React, { useEffect, useRef, useState } from 'react';
// import Chart from 'chart.js/auto';

// const DataVisualization = ({ jsonData }) => {
//     const reportCountRef = useRef(null);
//     const scoreChartRef = useRef(null);

//     // Function to destroy existing chart
//     const destroyChart = (ref) => {
//         const canvas = ref.current;
//         if (canvas) {
//             const chart = Chart.getChart(canvas);
//             if (chart) {
//                 chart.destroy();
//             }
//         }
//     };

//     useEffect(() => {
//         if (!jsonData) return;

//         // Calculate counts for each report type
//         // const sitrepCount = jsonData.SITREP_Report.length;
//         // const irrepCount = jsonData.IRREP_Report.length;
//         // const notificationCount = jsonData.Notification_Report.length;
//         const sitrepCount = jsonData.SITREP_Report.length;
//         const irrepCount = jsonData.IRREP_Report.length;
//         const notificationCount = jsonData.Notification_Report.length;

        


//         // Create a bar chart for report counts
//         createChart(reportCountRef, 'pie', ['SITREP Reports', 'IRREP Reports', 'Notification Reports'], [{
//             label: 'Report Counts',
//             data: [sitrepCount, irrepCount, notificationCount],
//             backgroundColor: [
//                 'rgba(255, 99, 132, 0.5)',
//                 'rgba(54, 162, 235, 0.5)',
//                 'rgba(255, 206, 86, 0.5)'
//             ],
//             borderColor: [
//                 'rgba(255, 99, 132, 1)',
//                 'rgba(54, 162, 235, 1)',
//                 'rgba(255, 206, 86, 1)'
//             ],
//             borderWidth: 1
//         }], {
//             scales: {
//                 y: {
//                     beginAtZero: true
//                 }
//             }
//         });

//         // Calculate total scores including manual scores
//         const totalScores = jsonData.scores.map(score => score.score + (score.manualScore || 0));

//         // Create a stacked bar chart for scores
//         createChart(scoreChartRef, 'bar', ['Total Score'], [{
//             label: 'Manual Score',
//             data: jsonData.scores.map(score => score.manualScore || 0),
//             backgroundColor: 'rgba(54, 162, 235, 0.5)',
//             borderColor: 'rgba(54, 162, 235, 1)',
//             borderWidth: 1
//         }, {
//             label: 'Scores',
//             data: jsonData.scores.map(score => score.score),
//             backgroundColor: 'rgba(255, 99, 132, 0.5)',
//             borderColor: 'rgba(255, 99, 132, 1)',
//             borderWidth: 1
//         }], {
//             scales: {
//                 y: {
//                     stacked: true,
//                     beginAtZero: true
//                 },
//                 x: {
//                     stacked: true
//                 }
//             }
//         });
//     }, [jsonData]);

//     // Function to create a new chart
//     const createChart = (ref, type, labels, datasets, options = {}) => {
//         destroyChart(ref);
//         const canvas = ref.current;
//         const ctx = canvas.getContext('2d');
//         return new Chart(ctx, {
//             type: type,
//             data: {
//                 labels: labels,
//                 datasets: datasets
//             },
//             options: options
//         });
//     };

//     return (
//         <div className="chart-container" style={{ display: 'flex', flexDirection: "row" }}>
//             <div className="chart" style={{ marginLeft: "20px" }}>
//                 <canvas ref={reportCountRef} height="350vh" ></canvas>
//             </div>
//             <div className="chart" style={{ marginLeft: "40px" }}>
//                 <canvas ref={scoreChartRef} height="350vh" ></canvas>
//             </div>
//         </div>
//     );
// };

// export default DataVisualization;

import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const DataVisualization = ({ jsonData, scoreData }) => {
    const reportCountRef = useRef(null);
    const scoreChartRef = useRef(null);

    const destroyChart = (ref) => {
        const canvas = ref.current;
        if (canvas) {
            const chart = Chart.getChart(canvas);
            if (chart) {
                chart.destroy();
            }
        }
    };

    useEffect(() => {
        if (!jsonData || !scoreData) return;

        // Calculate counts for each report name
        const reportCounts = jsonData.reduce((acc, report) => {
            acc[report.reportName] = (acc[report.reportName] || 0) + 1;
            return acc;
        }, {});

        const reportNames = Object.keys(reportCounts);
        const reportData = Object.values(reportCounts);

        // Create a pie chart for report counts
        createChart(reportCountRef, 'pie', reportNames, [{
            label: 'Report Counts',
            data: reportData,
            backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                'rgba(255, 206, 86, 0.5)',
                'rgba(75, 192, 192, 0.5)',
                'rgba(153, 102, 255, 0.5)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1
        }]);

        // Create a bar chart for scores, removing "Static Score"
        createChart(scoreChartRef, 'bar', ['Manual Score', 'Base Score'], [{
            label: 'Scores',
            data: [scoreData.manualScore, scoreData.score],
            backgroundColor: [
                'rgba(54, 162, 235, 0.5)',
                'rgba(255, 99, 132, 0.5)'
            ],
            borderColor: [
                'rgba(54, 162, 235, 1)',
                'rgba(255, 99, 132, 1)'
            ],
            borderWidth: 1,
            barThickness: 50, // Increase the bar thickness for visibility
        }], {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1, // Adjust step size to make bars more distinct
                    }
                }
            }
        });
    }, [jsonData, scoreData]);

    const createChart = (ref, type, labels, datasets, options = {}) => {
        destroyChart(ref);
        const canvas = ref.current;
        const ctx = canvas.getContext('2d');
        return new Chart(ctx, {
            type: type,
            data: {
                labels: labels,
                datasets: datasets
            },
            options: options
        });
    };

    return (
        <div className="chart-container" style={{ display: 'flex', flexDirection: "row" }}>
            <div className="chart" style={{ marginLeft: "20px" }}>
                <canvas ref={reportCountRef} height="350vh" ></canvas>
            </div>
            <div className="chart" style={{ marginLeft: "40px" }}>
                <canvas ref={scoreChartRef} height="350vh" ></canvas>
            </div>
        </div>
    );
};

export default DataVisualization;

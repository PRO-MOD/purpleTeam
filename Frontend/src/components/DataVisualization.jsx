import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';

const Testchart = () => {
    const [jsonData, setJsonData] = useState(null);
    const scoreChartRef = useRef(null);
    const reportDonutChartRef = useRef(null);
    const totalQuestionsPlotRef = useRef(null);
    const totalScoreOverTimeChartRef = useRef(null);

    useEffect(() => {
        // Fetch JSON data from API
        fetch('http://localhost:5000/api/reports/specific/660c2e4b5ef517e91b02bf00')
            .then(response => response.json())
            .then(data => {
                setJsonData(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    useEffect(() => {
        if (!jsonData) return;

        // Destroy existing charts before creating new ones
        destroyChart(scoreChartRef);
        destroyChart(reportDonutChartRef);
        destroyChart(totalQuestionsPlotRef);
        destroyChart(totalScoreOverTimeChartRef);

        // Create Score Chart
        const scoreNames = jsonData.scores.map(score => score.name);
        const scoreValues = jsonData.scores.map(score => score.score);
        const manualScoreValues = jsonData.scores.map(score => score.manualScore || 0);

        createChart(scoreChartRef, 'bar', scoreNames, [
            {
                label: 'Score',
                data: scoreValues,
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            },
            {
                label: 'Manual Score',
                data: manualScoreValues,
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }
        ], {
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true,
                    beginAtZero: true
                }
            }
        });

        // Create Report Donut Chart
        const reportTypes = {};
        jsonData.reports && jsonData.reports.forEach(report => {
            const type = report.reportType;
            reportTypes[type] = reportTypes[type] ? reportTypes[type] + 1 : 1;
        });
        const labels = Object.keys(reportTypes);
        const counts = Object.values(reportTypes);
        createChart(reportDonutChartRef, 'doughnut', labels, [{
            label: 'Types of Reports',
            data: counts,
            backgroundColor: [
                'rgba(255, 99, 132, 0.5)',
                'rgba(54, 162, 235, 0.5)',
                'rgba(255, 206, 86, 0.5)',
                'rgba(75, 192, 192, 0.5)',
                'rgba(153, 102, 255, 0.5)',
                'rgba(255, 159, 64, 0.5)',
            ],
            hoverOffset: 4
        }]);

        // Create Total Questions Plot
        const totalQuestionsData = [jsonData.SITREP_Report.length, jsonData.IRREP_Report.length, jsonData.Notification_Report.length];
        createChart(totalQuestionsPlotRef, 'bar', ['Total Questions Answered'], [{
            label: 'Total Questions Answered',
            data: totalQuestionsData,
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }], {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        });

        // Create Total Score Over Time Chart
        if (totalScoreOverTimeChartRef.current) {
            const reportCounts = {};
            jsonData.reports.forEach(report => {
                const timestamp = new Date(report.createdAt).getTime();
                if (!reportCounts[timestamp]) reportCounts[timestamp] = {};
                reportCounts[timestamp][report.reportType] = reportCounts[timestamp][report.reportType] ? reportCounts[timestamp][report.reportType] + 1 : 1;
            });

            const chartData = Object.entries(reportCounts).map(([timestamp, counts]) => ({
                x: new Date(parseInt(timestamp)),
                ...counts
            }));

            const datasets = Object.keys(jsonData).filter(key => key.endsWith('_Report')).map(reportType => ({
                label: reportType,
                data: chartData.map(data => data[reportType] || 0),
                backgroundColor: rgba(`${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.5`)
            }));

            createChart(totalScoreOverTimeChartRef, 'scatter', [], datasets, {
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'hour',
                            displayFormats: {
                                'hour': 'MMM dd, HH:mm'
                            }
                        },
                        title: {
                            display: true,
                            text: 'Time'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Number of Reports'
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += context.parsed.y;
                                return label;
                            }
                        }
                    }
                }
            });
        }

    }, [jsonData]);

    // Function to create a new chart
    const createChart = (ref, type, labels, datasets, options) => {
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

    // Function to destroy existing chart
    const destroyChart = (ref) => {
        const canvas = ref.current;
        const chart = Chart.getChart(canvas);
        if (chart) {
            chart.destroy();
        }
    };

    return (
        <div className="max">
            <div className="flex flex-wrap justify-center" style={{ width: "100%" }}>
                <div className="m-12" style={{ width: "16%" }}>
                    <canvas ref={scoreChartRef} width="400" height="400"></canvas>
                </div>
                <div className="m-12" style={{ width: "16%" }}>
                    <canvas ref={reportDonutChartRef} width="400" height="400"></canvas>
                </div>
                <div className="m-12" style={{ width: "16%" }}>
                    <canvas ref={totalQuestionsPlotRef} width="400" height="400"></canvas>
                </div>
            </div>
            <div className="innermax flex flex-wrap justify-center" style={{ height: "55vh", width: "80%" ,paddingLeft: "20%"  }}>
                <canvas ref={totalScoreOverTimeChartRef}></canvas>
            </div>
        </div>
    );
};

export default Testchart;
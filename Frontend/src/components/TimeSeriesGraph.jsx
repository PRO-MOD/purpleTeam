import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const TimeSeriesChart = ({ jsonData }) => {
    const timeSeriesChartRef = useRef(null);

    // Function to destroy existing chart
    const destroyChart = (ref) => {
        const canvas = ref.current;
        if (canvas) {
            const chart = Chart.getChart(canvas);
            if (chart) {
                chart.destroy();
            }
        }
    };

    // Function to create a new chart
    const createChart = (ref, labels, datasets) => {
        destroyChart(ref);
        const canvas = ref.current;
        const ctx = canvas.getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        display: true
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                return `${context.dataset.label}: ${context.raw}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Count'
                        }
                    }
                }
            }
        });
    };

    useEffect(() => {
        if (!jsonData) return;

        // Aggregate reports by report name
        const aggregateReports = (reports) => {
            return reports.reduce((acc, report) => {
                const date = report.responseDate; // Use the responseDate directly
                if (!acc[date]) {
                    acc[date] = {};
                }
                acc[date][report.reportName] = (acc[date][report.reportName] || 0) + 1;
                return acc;
            }, {});
        };

        // Aggregate reports for each report type
        const allReports = jsonData.flatMap(report => ({
            reportName: report.reportName,
            responseDate: report.responseDate // Use responseDate
        }));

        const reportCounts = aggregateReports(allReports);

        // Extract unique dates and sort them
        const allDates = [...new Set(Object.keys(reportCounts))].sort();

        // Prepare data for the chart
        const reportTypes = [...new Set(allReports.map(report => report.reportName))];
        const datasets = reportTypes.map(type => ({
            label: `${type} Reports`,
            data: allDates.map(date => reportCounts[date]?.[type] || 0),
            borderColor: getRandomColor(),
            borderWidth: 2,
            fill: false
        }));

        // Create chart
        createChart(timeSeriesChartRef, allDates, datasets);
    }, [jsonData]);

    // Function to generate random colors for the chart
    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    return (
        <div className="chart" style={{ marginLeft: "40px", width: "550px", paddingLeft: "30px", paddingBottom: "40px" }}>
            <canvas ref={timeSeriesChartRef}></canvas>
        </div>
    );
};

export default TimeSeriesChart;

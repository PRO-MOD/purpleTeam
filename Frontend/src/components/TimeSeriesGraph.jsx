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

    useEffect(() => {
        if (!jsonData) return;

        // Extract timestamps from report data for each report type
        const sitrepTimestamps = jsonData.SITREP_Report.map(report => new Date(report.createdAt).toLocaleDateString());
        const irrepTimestamps = jsonData.IRREP_Report.map(report => new Date(report.createdAt).toLocaleDateString());
        const notificationTimestamps = jsonData.Notification_Report.map(report => new Date(report.createdAt).toLocaleDateString());

        // Count reports created on each date for each report type
        const sitrepReportCounts = sitrepTimestamps.reduce((countMap, date) => {
            countMap[date] = (countMap[date] || 0) + 1;
            return countMap;
        }, {});
        const irrepReportCounts = irrepTimestamps.reduce((countMap, date) => {
            countMap[date] = (countMap[date] || 0) + 1;
            return countMap;
        }, {});
        const notificationReportCounts = notificationTimestamps.reduce((countMap, date) => {
            countMap[date] = (countMap[date] || 0) + 1;
            return countMap;
        }, {});

        // Combine timestamps from all report types and sort them
        const allTimestamps = [...new Set([...sitrepTimestamps, ...irrepTimestamps, ...notificationTimestamps])];
        const sortedDates = allTimestamps.sort((a, b) => new Date(a) - new Date(b));

        // Extract counts for each report type in sorted order
        const sitrepData = sortedDates.map(date => sitrepReportCounts[date] || 0);
        const irrepData = sortedDates.map(date => irrepReportCounts[date] || 0);
        const notificationData = sortedDates.map(date => notificationReportCounts[date] || 0);

        // Create time series line chart
        createChart(timeSeriesChartRef, 'line', sortedDates, [
            {
                label: 'SITREP Reports',
                data: sitrepData,
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2
            },
            {
                label: 'IRREP Reports',
                data: irrepData,
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2
            },
            {
                label: 'Notification Reports',
                data: notificationData,
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 2
            }
        ]);
    }, [jsonData]);

    // Function to create a new chart
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

    // Function to count reports by timestamp
    const countReportsByTimestamp = (timestamps) => {
        return timestamps.reduce((countMap, timestamp) => {
            const date = timestamp.toLocaleDateString();
            const time = timestamp.toLocaleTimeString();
            const dateTime = `${date} ${time}`;
            countMap[dateTime] = (countMap[dateTime] || 0) + 1;
            return countMap;
        }, {});
    };

    useEffect(() => {
        createTimeSeriesChart();
    }, [jsonData]);

    const createTimeSeriesChart = () => {
        if (!jsonData) return;

        // Extract timestamps from report data for each report type
        const sitrepTimestamps = jsonData.SITREP_Report.map(report => new Date(report.createdAt));
        const irrepTimestamps = jsonData.IRREP_Report.map(report => new Date(report.createdAt));
        const notificationTimestamps = jsonData.Notification_Report.map(report => new Date(report.createdAt));

        // Combine timestamps from all report types
        const allTimestamps = [...sitrepTimestamps, ...irrepTimestamps, ...notificationTimestamps];

        // Sort timestamps
        allTimestamps.sort((a, b) => a - b);

        // Extract dates and times from sorted timestamps
        const sortedDates = allTimestamps.map(timestamp => {
            const date = timestamp.toLocaleDateString();
            const time = timestamp.toLocaleTimeString();
            return `${date} ${time}`;
        });

        // Count reports created on each date for each report type
        const sitrepReportCounts = countReportsByTimestamp(sitrepTimestamps);
        const irrepReportCounts = countReportsByTimestamp(irrepTimestamps);
        const notificationReportCounts = countReportsByTimestamp(notificationTimestamps);

        // Filter out entries with zero counts
        const filteredDates = sortedDates.filter(date => 
            sitrepReportCounts[date] !== 0 || irrepReportCounts[date] !== 0 || notificationReportCounts[date] !== 0
        );

        // Extract counts for each report type in filtered dates
        const sitrepData = filteredDates.map(date => sitrepReportCounts[date] || 0);
        const irrepData = filteredDates.map(date => irrepReportCounts[date] || 0);
        const notificationData = filteredDates.map(date => notificationReportCounts[date] || 0);

        // Create time series line chart
        createChart(timeSeriesChartRef, 'line', filteredDates, [
            {
                label: 'SITREP Reports',
                data: sitrepData,
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2
            },
            {
                label: 'IRREP Reports',
                data: irrepData,
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 2
            },
            {
                label: 'Notification Reports',
                data: notificationData,
                borderColor: 'rgba(255, 206, 86, 1)',
                borderWidth: 2
            }
        ]);
    };

    return (
        <div className="chart" style={{ marginLeft: "40px", width: "550px", paddingLeft: "30px", paddingBottom: "40px" }}>
            <canvas ref={timeSeriesChartRef}></canvas>
        </div>
    );
};

export default TimeSeriesChart;

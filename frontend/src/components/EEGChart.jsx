import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export const EEGChart = () => {
    const [chartData, setChartData] = useState({});

    const file_path = '../../public/recordings/glenn_brainwaves_2025-02-14T20:25:57.csv'

    useEffect(() => {
        // Fetch the CSV data
        fetch(file_path)
            .then(response => response.text())
            .then(data => {
                const rows = data.split('\n').slice(1); // Remove header
                const timestamps = [];
                const rawValues = [];

                rows.forEach(row => {
                    const cols = row.split(',');
                    timestamps.push(cols[0]);
                    rawValues.push(parseFloat(cols[1]));
                });

                setChartData({
                    labels: timestamps,
                    datasets: [
                        {
                            label: 'Raw EEG Data',
                            data: rawValues,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        },
                    ],
                });
            });
    }, []);

    return (
        <div>
            <h2>EEG Data Visualization</h2>
            <Line data={chartData} />
        </div>
    );
};


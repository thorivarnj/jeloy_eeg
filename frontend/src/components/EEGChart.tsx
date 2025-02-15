import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export const EEGChart = () => {
    const [chartData, setChartData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch the CSV data
        fetch('../../public/recordings/test.csv')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                console.log('CSV Data:', data); // Log the raw CSV data
                const rows = data.split('\n').slice(1); // Remove header
                const timestamps = [];
                const rawValues = [];

                rows.forEach(row => {
                    const cols = row.split(',');
                    if (cols.length > 1) {
                        timestamps.push(cols[0]);
                        rawValues.push(parseFloat(cols[1]));
                    }
                });

                console.log('Timestamps:', timestamps); // Log the timestamps
                console.log('Raw Values:', rawValues); // Log the raw values

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
            })
            .catch(error => {
                setError(error.message);
            });
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!chartData) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>EEG Data Visualization</h2>
            <Line data={chartData} />
        </div>
    );
};


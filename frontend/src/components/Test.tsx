import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DataComponent = () => {
    const [timestamps, setTimestamps] = useState<string[]>([]);
    const [rawValues, setRawValues] = useState<number[]>([]);
    const [attentionValues, setAttentionValues] = useState<number[]>([]);
    const [meditationValues, setMeditationValues] = useState<number[]>([]);

    const dataset = 'Attention';
    const dataset2 = 'Meditation';
    const dataset3 = 'Raw';

    useEffect(() => {
        const socket = io('http://localhost:8080');
        socket.on('new_data', (newData) => {
            setTimestamps((prevTimestamps) => [...prevTimestamps, newData.Timestamp]);
            setRawValues((prevRawValues) => [...prevRawValues, newData[dataset3]]);
            setAttentionValues((prevAttentionValues) => [...prevAttentionValues, newData[dataset]]);
            setMeditationValues((prevMeditationValues) => [...prevMeditationValues, newData[dataset2]]);
        });
        return () => {
            socket.disconnect();
        };
    }, []);

    const startRecording = () => {
        fetch('http://localhost:8080/start')
            .then(response => response.json())
            .then(data => {
                console.log(data.message);
            })
            .catch(error => {
                console.error('There was an error starting the recording!', error);
            });
    };

    const stopRecording = () => {
        fetch('http://localhost:8080/stop')
            .then(response => response.json())
            .then(data => {
                console.log(data.message);
            })
            .catch(error => {
                console.error('There was an error stopping the recording!', error);
            });
    };

    const chartData = {
        labels: timestamps.slice(-400),
        datasets: [
            {
                label: dataset,
                data: attentionValues.slice(-400),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: false,
            },
            {
                label: dataset2,
                data: meditationValues.slice(-400),
                borderColor: 'rgba(130, 80, 192, 1)',
                backgroundColor: 'rgba(130, 80, 192, 0.2)',
                fill: false,
            }
        ],
    };

    const options = {
        animations: false,
        scales: {
            y: {
                max: 100,
                min: 0,
                beginAtZero: true,
            },
        },
    };

    const options2 = {
        animations: false,
        scales: {
            y: {
                max: 3000,
                min: -3000,
            },
			x: {
                ticks: {
                    maxTicksLimit: 10
                }
            },
        },
    };

    return (
        <div>
            <h1>Real-Time Data Visualization</h1>
            <button onClick={startRecording}>Start Recording</button>
            <button onClick={stopRecording}>Stop Recording</button>
            <Line className='chart' data={chartData} options={options} />

            <h2>Raw Data</h2>
            <Line className='chart' data={{ labels: timestamps.slice(-400), datasets: [{ label: dataset3, data: rawValues.slice(-400), borderColor: 'rgba(255, 99, 132, 1)', backgroundColor: 'rgba(255, 99, 132, 0.2)', fill: false }] }} options={options2} />
        </div>
    );
};

export default DataComponent;
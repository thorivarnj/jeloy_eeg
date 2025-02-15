import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DataComponent = () => {
    const [data, setData] = useState([]);
    const [timestamps, setTimestamps] = useState([]);
    const [rawValues, setRawValues] = useState([]);
    const [meditationValues, setMeditationValues] = useState([])

    const dataset = 'Attention'
    const dataset2 = 'theta'

    useEffect(() => {
        const socket = io('http://localhost:8080');
        socket.on('new_data', (newData) => {
            console.log(newData);
            setData((prevData) => [...prevData, newData]);
            setTimestamps((prevTimestamps) => [...prevTimestamps, newData.Timestamp]);
            setRawValues((prevRawValues) => [...prevRawValues, newData[dataset]]);
            setMeditationValues((prevMeditationValues) => [...prevMeditationValues, newData[dataset2]])
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
        labels: timestamps,
        datasets: [
            {
                label: dataset,
                data: rawValues,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: false,
            },
            {
                label: dataset2,
                data: meditationValues,
                borderColor: 'rgba(130, 80, 192, 1)',
                backgroundColor: 'rgba(130,80, 192, 0.2)',
                fill: false,
            }
        ],
    };

    return (
        <div>
            <h1>Real-Time Data Visualization</h1>
            <button onClick={startRecording}>Start Recording</button>
            <button onClick={stopRecording}>Stop Recording</button>
            <Line data={chartData} options={options} />
        </div>
    );
};

export default DataComponent;

import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DataComponent = () => {
    const [data, setData] = useState([]);
    const [timestamps, setTimestamps] = useState([]);
    const [rawValues, setRawValues] = useState([]);

    useEffect(() => {
        const socket = io('http://localhost:8080');
        socket.on('new_data', (newData) => {
            console.log(newData);
            setData((prevData) => [...prevData, newData]);
            setTimestamps((prevTimestamps) => [...prevTimestamps, newData.Timestamp]);
            setRawValues((prevRawValues) => [...prevRawValues, newData.Attention]);
        });
        return () => {
            socket.disconnect();
        };
    }, []);

	useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            const tenSecondsAgo = now - 10000;

            setTimestamps((prevTimestamps) => prevTimestamps.filter(timestamp => new Date(timestamp).getTime() > tenSecondsAgo));
            setRawValues((prevRawValues, prevTimestamps) => prevRawValues.filter((_, index) => new Date(prevTimestamps[index]).getTime() > tenSecondsAgo));
        }, 1000);

        return () => clearInterval(interval);
    }, [timestamps, rawValues]);

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
                label: 'Raw Values',
                data: rawValues,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: false,
            },
        ],
    };

    const options = {
        animations: false
    }
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

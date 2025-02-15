import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import './eegchart.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export const EEGChart = () => {
    const [rawData, setRawData] = useState(null);
    const [attentionData, setAttentionData] = useState(null);
    const [meditationData, setMeditationData] = useState(null);
    const [deltaData, setDeltaData] = useState(null);
    const [thetaData, setThetaData] = useState(null);
    const [lowAlphaData, setLowAlphaData] = useState(null);
    const [highAlphaData, setHighAlphaData] = useState(null);
    const [lowBetaData, setLowBetaData] = useState(null);
    const [highBetaData, setHighBetaData] = useState(null);
    const [lowGammaData, setLowGammaData] = useState(null);
    const [midGammaData, setMidGammaData] = useState(null);
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
                const rows = data.split('\n').slice(1); // Remove header
                const timestamps:string[] = [];
                const rawValues:number[] = [];
                const attention:number[] = [];
                const meditation:number[] = [];
                const delta:number[] = [];
                const theta:number[] = [];
                const low_alpha:number[] = [];
                const high_alpha:number[] = [];
                const low_beta:number[] = [];
                const high_beta:number[] = [];
                const low_gamma:number[] = [];
                const mid_gamma:number[] = [];

                rows.forEach(row => {
                    const cols = row.split(',');
                    if (cols.length > 1) {
                        timestamps.push(cols[0]);
                        rawValues.push(parseFloat(cols[1]));
                        attention.push(parseFloat(cols[2]));
                        meditation.push(parseFloat(cols[3]));
                        delta.push(parseFloat(cols[4]));
                        theta.push(parseFloat(cols[5]));
                        low_alpha.push(parseFloat(cols[6]));
                        high_alpha.push(parseFloat(cols[7]));
                        low_beta.push(parseFloat(cols[8]));
                        high_beta.push(parseFloat(cols[9]));
                        low_gamma.push(parseFloat(cols[10]));
                        mid_gamma.push(parseFloat(cols[11]));
                    }
                });

                setRawData({
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

                setAttentionData({
                    labels: timestamps,
                    datasets: [
                        {
                            label: 'Raw EEG Data',
                            data: attention,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        },
                    ],
                });

                setMeditationData({
                    labels: timestamps,
                    datasets: [
                        {
                            label: 'Raw EEG Data',
                            data: meditation,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        },
                    ],
                });

                setDeltaData({
                    labels: timestamps,
                    datasets: [
                        {
                            label: 'Raw EEG Data',
                            data: delta,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        },
                    ],
                });

                setThetaData({
                    labels: timestamps,
                    datasets: [
                        {
                            label: 'Raw EEG Data',
                            data: theta,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        },
                    ],
                });

                setLowAlphaData({
                    labels: timestamps,
                    datasets: [
                        {
                            label: 'Raw EEG Data',
                            data: low_alpha,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        },
                    ],
                });

                setHighAlphaData({
                    labels: timestamps,
                    datasets: [
                        {
                            label: 'Raw EEG Data',
                            data: high_alpha,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        },
                    ],
                });

                setLowBetaData({
                    labels: timestamps,
                    datasets: [
                        {
                            label: 'Raw EEG Data',
                            data: low_beta,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        },
                    ],
                });

                setHighBetaData({
                    labels: timestamps,
                    datasets: [
                        {
                            label: 'Raw EEG Data',
                            data: high_beta,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        },
                    ],
                });

                setLowGammaData({
                    labels: timestamps,
                    datasets: [
                        {
                            label: 'Raw EEG Data',
                            data: low_gamma,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        },
                    ],
                });

                setMidGammaData({
                    labels: timestamps,
                    datasets: [
                        {
                            label: 'Raw EEG Data',
                            data: mid_gamma,
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

    if (!rawData || !attentionData || !meditationData || !deltaData || !thetaData || !lowAlphaData || !highAlphaData || !lowBetaData || !highBetaData || !lowGammaData || !midGammaData) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>EEG Data Visualization</h1>
            <h2>Raw Data</h2>
            <Line className='line-chart' data={rawData} />

            <h2>Attention</h2>
            <Line className='line-chart' data={attentionData} />

            <h2>Meditation</h2>
            <Line className='line-chart' data={meditationData} />

            <h2>Delta</h2>
            <Line className='line-chart' data={deltaData} />

            <h2>Theta</h2>
            <Line className='line-chart' data={thetaData} />

            <h2>Low Alpha</h2>
            <Line className='line-chart' data={lowAlphaData} />

            <h2>High Alpha</h2>
            <Line className='line-chart' data={highAlphaData} />

            <h2>Low Beta</h2>
            <Line className='line-chart' data={lowBetaData} />

            <h2>High Beta</h2>
            <Line className='line-chart' data={highBetaData} />

            <h2>Low Gamma</h2>
            <Line className='line-chart' data={lowGammaData} />

            <h2>Mid Gamma</h2>
            <Line className='line-chart' data={midGammaData} />
        </div>
    );
};


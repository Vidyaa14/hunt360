import React from 'react';
import PropTypes from 'prop-types';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    BarElement,
    ArcElement,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    BarElement,
    ArcElement,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
);

const ChartCard = ({ title, children }) => (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>
        <div className="relative h-64">{children}</div>
    </div>
);

ChartCard.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};

const GenderDistributionChart = () => {
    const data = {
        labels: ['Male', 'Female', 'Other'],
        datasets: [
            {
                data: [55, 40, 5],
                backgroundColor: ['#3B82F6', '#8B5CF6', '#F59E0B'],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: { color: '#374151', font: { size: 14 } },
            },
        },
    };

    return (
        <ChartCard title="Gender Distribution">
            <Pie data={data} options={options} />
        </ChartCard>
    );
};

export default GenderDistributionChart;

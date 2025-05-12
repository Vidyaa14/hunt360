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

const MonthlyRegistrationsChart = () => {
    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Registrations',
                data: [50, 60, 70, 65, 80, 90],
                borderColor: '#6366F1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#6366F1',
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: { color: '#374151' },
            },
        },
        scales: {
            y: { beginAtZero: true, grid: { color: '#F3F4F6' } },
            x: { grid: { display: false } },
        },
    };

    return (
        <ChartCard title="Monthly Registrations">
            <Line data={data} options={options} />
        </ChartCard>
    );
};

export default MonthlyRegistrationsChart;

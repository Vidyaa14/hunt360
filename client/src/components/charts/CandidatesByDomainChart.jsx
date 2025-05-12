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

const CandidatesByDomainChart = () => {
    const data = {
        labels: ['IT', 'HR', 'Finance', 'Marketing', 'Operations'],
        datasets: [
            {
                label: 'Candidates',
                data: [40, 25, 30, 20, 15],
                backgroundColor: '#6366F1',
                borderRadius: 8,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
        },
        scales: {
            y: { beginAtZero: true, grid: { color: '#E5E7EB' } },
            x: { grid: { display: false } },
        },
    };

    return (
        <ChartCard title="Candidates by Domain">
            <Bar data={data} options={options} />
        </ChartCard>
    );
};

export default CandidatesByDomainChart;

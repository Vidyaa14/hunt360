import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LineElement,
    PointElement,
    Tooltip,
    LinearScale,
} from 'chart.js';
import PropTypes from 'prop-types';
import React from 'react';
import { Bar } from 'react-chartjs-2';

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

const SubdomainDistributionChart = () => {
    const data = {
        labels: ['Recruitment', 'Payroll', 'Audit', 'Digital', 'Support'],
        datasets: [
            {
                label: 'Count',
                data: [20, 15, 25, 30, 10],
                backgroundColor: '#06B6D4',
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
        <ChartCard title="Subdomain Distribution">
            <Bar data={data} options={options} />
        </ChartCard>
    );
};

export default SubdomainDistributionChart;

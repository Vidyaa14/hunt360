/* eslint-disable no-unused-vars */
import axios from 'axios';
import { FileText, Lock, Upload, UserCheck, Users } from 'lucide-react';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import CandidatesByDomainChart from '../components/charts/CandidatesByDomainChart';
import GenderDistributionChart from '../components/charts/GenderDistributionChart';
import MonthlyRegistrationsChart from '../components/charts/MonthlyRegistrationsChart';
import RegistrationsByYearChart from '../components/charts/RegistrationsByYearChart';
import SubdomainDistributionChart from '../components/charts/SubdomainDistributionChart';

const CandidateDashboard = ({ isSidebarCollapsed = false }) => {
    const [userCount, setUserCount] = useState(0);
    const [candidateCount, setCandidateCount] = useState(0);
    const [form1Total, setForm1Total] = useState(0);
    const [genderData, setGenderData] = useState({});
    const [franchiseCount, setFranchiseCount] = useState(0);
    const [importedCount, setImportedCount] = useState(0);
    const [domainData, setDomainData] = useState([]);
    const [subdomainData, setSubdomainData] = useState([]);
    const [yearlyData, setYearlyData] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);
    const [isDataSidebarOpen, setDataSidebarOpen] = useState(false);

    const toggleDataSidebar = useCallback(() => {
        setDataSidebarOpen((prev) => !prev);
    }, []);

    const closeDataSidebar = useCallback(() => {
        setDataSidebarOpen(false);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    usersRes,
                    candidatesRes,
                    form1Res,
                    franchiseRes,
                    importedRes,
                    domainRes,
                    subdomainRes,
                    yearlyRes,
                    monthlyRes,
                ] = await Promise.all([
                    axios.get('/api/users'),
                    axios.get('/api/candidate-count'),
                    axios.get('/api/candidate_details'),
                    axios.get('/api/franchiselogindata'),
                    axios.get('/api/importeddata'),
                    axios.get('/api/candidate-by-domain'),
                    axios.get('/api/candidate-by-subdomain'),
                    axios.get('/api/candidate-by-date?group=year'),
                    axios.get('/api/candidate-by-date?group=month&filter=2024'),
                ]);

                setUserCount(usersRes.data.total || 0);
                setCandidateCount(candidatesRes.data.total || 0);
                setForm1Total(form1Res.data.total || 0);
                setGenderData(form1Res.data.genders || {});
                setFranchiseCount(franchiseRes.data.total || 0);
                setImportedCount(importedRes.data.total || 0);
                setDomainData(domainRes.data || []);
                setSubdomainData(subdomainRes.data || []);
                setYearlyData(yearlyRes.data || []);
                setMonthlyData(monthlyRes.data || []);
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    const cards = [
        { title: 'Total Admins', count: userCount, icon: Users },
        { title: 'Candidates (Filtered)', count: candidateCount, icon: UserCheck },
        { title: 'Fresher Entries', count: form1Total, icon: FileText },
        { title: 'Franchise Logins', count: franchiseCount, icon: Lock },
        { title: 'Imported Data', count: importedCount, icon: Upload },
    ];

    return (
        <div className="flex min-h-screen bg-gray-100">
            <div
                className={`flex-1 p-6 transition-all duration-300 ${isSidebarCollapsed ? 'ml-16' : ''
                    }`}
            >
                <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                    Talent Corner Dashboard
                </h1>

                <div className="flex flex-wrap gap-4 mb-8">
                    {cards.map(({ title, count, icon: Icon }) => (
                        <div
                            key={title}
                            className="flex-1 min-w-[140px] max-w-[220px] bg-white p-4 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center"
                        >
                            <Icon className="w-8 h-8 text-[#6a4fb4] mx-auto mb-2" />
                            <p className="text-sm text-gray-600">{title}</p>
                            <h3 className="text-lg font-bold text-gray-800 mt-1">{count}</h3>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <CandidatesByDomainChart data={domainData} />
                    <GenderDistributionChart data={genderData} />
                    <MonthlyRegistrationsChart data={monthlyData} />
                    <RegistrationsByYearChart data={yearlyData} />
                    <SubdomainDistributionChart data={subdomainData} />
                </div>
            </div>
        </div>
    );
};

CandidateDashboard.propTypes = {
    isSidebarCollapsed: PropTypes.bool,
};

CandidateDashboard.defaultProps = {
    isSidebarCollapsed: false,
};

export default CandidateDashboard;
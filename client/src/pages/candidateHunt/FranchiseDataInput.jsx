import React, { useEffect, useState } from 'react';
import FranchiseSidebar from '../../components/sidebar/FranchiseSidebar';

const FranchiseDataInput = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const org = encodeURIComponent(localStorage.getItem('orgName'));
            try {
                const res = await fetch(`/candidate-data?org=${org}`);
                const json = await res.json();
                setData(json);
            } catch (error) {
                console.error('Error fetching candidate data:', error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-100">
            <div className="bg-white shadow-lg">
                <FranchiseSidebar />
            </div>
            <div className="flex-1 p-6">
                <h2 className="text-2xl font-bold mb-6">Candidate Details</h2>
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="p-4 font-semibold">#</th>
                                <th className="p-4 font-semibold">Name</th>
                                <th className="p-4 font-semibold">Email</th>
                                <th className="p-4 font-semibold">Phone</th>
                                <th className="p-4 font-semibold">Domain</th>
                                <th className="p-4 font-semibold">Subdomain</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="p-4 text-center text-gray-500"
                                    >
                                        No data available
                                    </td>
                                </tr>
                            ) : (
                                data.map((item, index) => (
                                    <tr
                                        key={item.id || index}
                                        className="border-t hover:bg-gray-50"
                                    >
                                        <td className="p-4">{index + 1}</td>
                                        <td className="p-4">{item.name}</td>
                                        <td className="p-4">{item.email}</td>
                                        <td className="p-4">{item.phone}</td>
                                        <td className="p-4">{item.domain}</td>
                                        <td className="p-4">
                                            {item.subdomain}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default FranchiseDataInput;

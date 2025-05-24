import React, { useState, useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import Card from '../../../components/campus/Card';
import HrForm from '../forms/HRForm';
import * as apiService from '../../../api/campus.js';

const useSearchForm = () => {
    const [college, setCollege] = useState('');
    const [location, setLocation] = useState([]);
    const [course, setCourse] = useState([]);
    const [showUpdatedOnly, setShowUpdatedOnly] = useState(false);

    const locationOptions = [
        { value: 'Mumbai', label: 'Mumbai' },
        { value: 'Delhi', label: 'Delhi' },
        { value: 'Pune', label: 'Pune' },
        { value: 'Chennai', label: 'Chennai' },
        { value: 'Bangalore', label: 'Bangalore' },
    ];

    const courseOptions = [
        { value: 'BE/B.Tech', label: 'BE/B.Tech' },
        { value: 'MTech', label: 'MTech' },
        { value: 'MBA', label: 'MBA' },
        { value: 'BCA', label: 'BCA' },
        { value: 'MCA', label: 'MCA' },
        { value: 'BSc IT', label: 'BSc IT' },
        { value: 'Pharmacy', label: 'Pharmacy' },
    ];

    const resetForm = useCallback(() => {
        setCollege('');
        setLocation([]);
        setCourse([]);
        setShowUpdatedOnly(false);
    }, []);

    return {
        college,
        setCollege,
        location,
        setLocation,
        course,
        setCourse,
        showUpdatedOnly,
        setShowUpdatedOnly,
        locationOptions,
        courseOptions,
        resetForm,
    };
};

// Custom hook for college data and API logic
const useCollegeData = () => {
    const [colleges, setColleges] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [editingCollege, setEditingCollege] = useState(null);
    const [showEditForm, setShowEditForm] = useState(false);
    const [updatedData, setUpdatedData] = useState({
        College_Name: '',
        State: '',
        District: '',
        Course: '',
        Annual_fees: '', // Fixed typo: Anual_fees → Annual_fees
        Placement_fees: '',
        Ranking: '',
        Address: '',
        Phone: '',
        Director_name: '',
        Director_number: '',
        Director_email: '',
        Placement_coor_name: '',
        Placement_coor_contact: '',
        Placement_coor_email: '',
        Hr_team_name: '',
        Spoke_for_placement: '',
        Resume_received: '',
        Interview_status: '',
        Total_num_students: '',
        Hired_students: '',
        Data_updated_by_name: '',
        Term: '',
        Clg_ID: '',
        Date_of_Contact: '',
        Date_of_Next_Contact: '',
        Send_proposal: '',
        Total_payment: '',
        Payment_received: '',
        Payment_period: '',
        Replacement_period: '',
        Placed_on_Month: '',
        Placed_on_Year: '',
        Update_timestamp: '',
    });

    const handleSearch = useCallback(async (college, location, course) => {
        if (!college && location.length === 0 && course.length === 0) {
            setError('Please enter College Name, Location, or Course.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await apiService.searchColleges({
                college,
                location: location.map((l) => l.value).join(','),
                course: course.map((c) => c.value).join(','),
            });
            setColleges(response);
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to fetch college data.');
        } finally {
            setLoading(false);
        }
    }, []);

    const handleEdit = useCallback(
        (collegeId) => {
            const collegeToEdit = colleges.find(
                (col) => col.Clg_ID === collegeId
            );
            setEditingCollege(collegeToEdit);
            setShowEditForm(true);
            setUpdatedData({ ...collegeToEdit });
        },
        [colleges]
    );

    const handleUpdate = useCallback(async () => {
        const updatedCollege = {
            ...updatedData,
            Annual_fees: updatedData.Annual_fees, // Fixed typo
            Update_timestamp: new Date()
                .toISOString()
                .slice(0, 19)
                .replace('T', ' '),
        };

        setLoading(true);
        setError('');

        try {
            await apiService.updateCollege(
                editingCollege.Clg_ID,
                updatedCollege
            );
            setColleges((prev) =>
                prev.map((col) =>
                    col.Clg_ID === editingCollege.Clg_ID
                        ? { ...col, ...updatedCollege }
                        : col
                )
            );
            setEditingCollege(null);
            setShowEditForm(false);
        } catch (err) {
            console.error('Error updating data:', err);
            setError('Failed to update college data.');
        } finally {
            setLoading(false);
        }
    }, [editingCollege, updatedData]);

    const handleDelete = useCallback(async (collegeId) => {
        const confirmDelete = window.confirm(
            'Are you sure you want to delete this record?'
        );
        if (!confirmDelete) return;

        setLoading(true);
        setError('');

        try {
            await apiService.deleteCollege(collegeId);
            setColleges((prev) =>
                prev.filter((col) => col.Clg_ID !== collegeId)
            );
        } catch (err) {
            console.error('Error deleting data:', err);
            setError('Failed to delete college data.');
        } finally {
            setLoading(false);
        }
    }, []);

    const handleCloseEditForm = useCallback(() => {
        setShowEditForm(false);
        setEditingCollege(null);
        setUpdatedData({
            College_Name: '',
            State: '',
            District: '',
            Course: '',
            Annual_fees: '',
            Placement_fees: '',
            Ranking: '',
            Address: '',
            Phone: '',
            Director_name: '',
            Director_number: '',
            Director_email: '',
            Placement_coor_name: '',
            Placement_coor_contact: '',
            Placement_coor_email: '',
            Hr_team_name: '',
            Spoke_for_placement: '',
            Resume_received: '',
            Interview_status: '',
            Total_num_students: '',
            Hired_students: '',
            Data_updated_by_name: '',
            Term: '',
            Clg_ID: '',
            Date_of_Contact: '',
            Date_of_Next_Contact: '',
            Send_proposal: '',
            Total_payment: '',
            Payment_received: '',
            Payment_period: '',
            Replacement_period: '',
            Placed_on_Month: '',
            Placed_on_Year: '',
            Update_timestamp: '',
        });
    }, []);

    return {
        colleges,
        loading,
        error,
        editingCollege,
        showEditForm,
        updatedData,
        setUpdatedData,
        handleSearch,
        handleEdit,
        handleUpdate,
        handleDelete,
        handleCloseEditForm,
    };
};

const HrData = ({ className = '' }) => {
    const {
        college,
        setCollege,
        location,
        setLocation,
        course,
        setCourse,
        showUpdatedOnly,
        setShowUpdatedOnly,
        locationOptions,
        courseOptions,
        resetForm,
    } = useSearchForm();
    const {
        colleges,
        loading,
        error,
        editingCollege,
        showEditForm,
        updatedData,
        setUpdatedData,
        handleSearch,
        handleEdit,
        handleUpdate,
        handleDelete,
        handleCloseEditForm,
    } = useCollegeData();

    const filteredColleges = showUpdatedOnly
        ? colleges.filter((college) => college.Update_timestamp !== null)
        : colleges;

    const tableHeaders = [
        'College ID',
        'College Name',
        'District',
        'State',
        'Courses',
        'Annual Fees',
        'Placement Fees',
        'Ranking',
        'Phone',
        'Address',
        'Director Name',
        'Director Email',
        'Director Contact',
        'Placement Coordinator Name',
        'Placement Coordinator Email',
        'Placement Coordinator Contact',
        'Date of Contact',
        'Date of Next Contact',
        'Hr team name',
        'Send proposal',
        'Total payment',
        'Payment received',
        'Payment period',
        'Replacement period',
        'Spoke for placement',
        'Resume received',
        'Interview status',
        'Total number of student',
        'Hired student',
        'Term',
        'Update By',
        'Placed on Month',
        'Placed on Year',
        'Update Timestamp',
        'Update',
    ];

    return (
        <div className={`p-6 max-w-full ${className}`}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-5">
                HR Data Editing
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-500 font-semibold mt-1">
                Dashboard - HR Data Edit
            </p>

            {/* Search Form */}
            <Card className="mt-5">
                <h2 className="text-xl font-bold text-gray-400 mb-5">
                    HR Data Search
                </h2>
                {error && <p className="text-red-600 mb-4">{error}</p>}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                        <label
                            htmlFor="college-name"
                            className="block text-xl mb-2 font-medium text-gray-700"
                        >
                            College Name
                        </label>
                        <input
                            id="college-name"
                            type="text"
                            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                            placeholder="Enter college name"
                            value={college}
                            onChange={(e) => setCollege(e.target.value)}
                            disabled={loading}
                            aria-describedby={
                                error ? 'college-name-error' : undefined
                            }
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="location"
                            className="block text-xl mb-2 font-medium text-gray-700"
                        >
                            Location/City
                        </label>
                        <Select
                            id="location"
                            isMulti
                            isSearchable
                            placeholder="Select locations"
                            options={locationOptions}
                            value={location}
                            onChange={setLocation}
                            menuPortalTarget={document.body}
                            styles={{
                                menuPortal: (base) => ({
                                    ...base,
                                    zIndex: 9999,
                                }),
                            }}
                            isDisabled={loading}
                            aria-describedby={
                                error ? 'location-error' : undefined
                            }
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="courses"
                            className="block text-xl mb-2 font-medium text-gray-700"
                        >
                            Courses
                        </label>
                        <Select
                            id="courses"
                            isMulti
                            isSearchable
                            placeholder="Select Courses"
                            options={courseOptions}
                            value={course}
                            onChange={setCourse}
                            menuPortalTarget={document.body}
                            styles={{
                                menuPortal: (base) => ({
                                    ...base,
                                    zIndex: 9999,
                                }),
                            }}
                            isDisabled={loading}
                            aria-describedby={
                                error ? 'courses-error' : undefined
                            }
                        />
                    </div>
                </div>

                <label className="flex items-center gap-2 mb-6 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={showUpdatedOnly}
                        onChange={() => setShowUpdatedOnly(!showUpdatedOnly)}
                        disabled={loading}
                        aria-label="Show updated data only"
                    />
                    <span>Show Updated Data Only</span>
                </label>

                <div className="flex gap-4 mb-10">
                    <button
                        type="button"
                        className="bg-gray-900 shadow-md text-white px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-50"
                        onClick={() => handleSearch(college, location, course)}
                        disabled={loading}
                        aria-label="Search colleges"
                    >
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                    <button
                        type="button"
                        className="bg-gray-300 shadow-md text-black px-4 py-2 rounded hover:bg-gray-400 disabled:opacity-50"
                        onClick={() => {
                            resetForm();
                            setCollege([]);
                        }}
                        disabled={loading}
                        aria-label="Clear filters"
                    >
                        Clear Filters
                    </button>
                </div>
            </Card>

            {/* Search Results */}
            <Card className="mt-5">
                <div className="overflow-auto">
                    <h2 className="text-xl font-bold text-gray-400 mb-5">
                        Search Results
                    </h2>
                    {loading ? (
                        <p className="text-gray-500">Loading...</p>
                    ) : error ? (
                        <p className="text-red-600">{error}</p>
                    ) : filteredColleges.length > 0 ? (
                        <table
                            className="min-w-[1200px] w-full table-auto border border-gray-300"
                            aria-label="College search results"
                        >
                            <thead>
                                <tr className="bg-gray-100 text-sm">
                                    {tableHeaders.map((header, idx) => (
                                        <th
                                            key={idx}
                                            scope="col"
                                            className="border px-3 py-2"
                                        >
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredColleges.map((college) => (
                                    <tr
                                        key={college.Clg_ID}
                                        className="text-sm text-center border-t"
                                    >
                                        <td className="border px-3 py-2">
                                            {college.Clg_ID}
                                        </td>
                                        <td className="border px-3 py-2">
                                            {college.College_Name}
                                        </td>
                                        <td className="border px-3 py-2">
                                            {college.District}
                                        </td>
                                        <td className="border px-3 py-2">
                                            {college.State}
                                        </td>
                                        <td className="border px-3 py-2">
                                            {college.Course}
                                        </td>
                                        <td className="border px-3 py-2">
                                            {college.Annual_fees}
                                        </td>
                                        <td className="border px-3 py-2">
                                            {college.Placement_fees}
                                        </td>
                                        <td className="border px-3 py-2">
                                            {college.Ranking}
                                        </td>
                                        <td className="border px-3 py-2">
                                            {college.Phone}
                                        </td>
                                        <td className="border px-3 py-2">
                                            {college.Address}
                                        </td>
                                        <td className="border px-3 py-2">
                                            {college.Director_name}
                                        </td>
                                        <td className="border px-3 py-2">
                                            {college.Director_email}
                                        </td>
                                        <td className="border px-3 py-2">
                                            {college.Director_number}
                                        </td>
                                        <td className="border px-3 py-2">
                                            {college.Placement_coor_name}
                                        </td>
                                        <td className="border px-3 py-2">
                                            {college.Placement_coor_email}
                                        </td>
                                        <td className="border px-3 py-2">
                                            {college.Placement_coor_contact}
                                        </td>
                                        <td className="border px-3 py-2">
                                            {college.Date_of_Contact}
                                        </td>
                                        <td className="border px-3 py-2">
                                            {college.Date_of_Next_Contact}
                                        </td>
                                        <td className="border px-3 py-2">
                                            {college.Hr_team_name}
                                        </td>
                                        <td className="border px-3 py-2">
                                            {college.Send_proposal}
                                        </td>
                                        <td className="border px-3 py-2">
                                            {college.Total_payment}
                                        </td>
                                        <td className="border px-3 py-2">
                                            {college.Payment_received}
                                        </td>
                                        <td className="border px-3 py-2">
                                            {college.Payment_period}
                                        </td>
                                        <td className="border px-3 py-2">
                                            {college.Replacement_period}
                                        </td>
                                        <td className="border px-3 py-2">
                                            {college.Spoke_for_placement}
                                        </td>
                                        <td className="border px-3 py-2">
                                            {college.Resume_received}
                                        </td>
                                        <td className="border px-3 py-2">
                                            {college.Interview_status}
                                        </td>
                                        <td className="border px-3 py-2">
                                            {college.Total_num_students}
                                        </td>
                                        <td className="border px-3 py-2">
                                            {college.Hired_students}
                                        </td>
                                        <td className="border px-3 py-2">
                                            {college.Term}
                                        </td>
                                        <td className="border px-3 py-2">
                                            {college.Data_updated_by_name}
                                        </td>
                                        <td className="border px-3 py-2">
                                            {college.Placed_on_Month}
                                        </td>
                                        <td className="border px-3 py-2">
                                            {college.Placed_on_Year}
                                        </td>
                                        <td className="border px-3 py-2">
                                            {college.Update_timestamp}
                                        </td>
                                        <td className="flex flex-col gap-1 justify-center items-center py-2">
                                            <button
                                                onClick={() =>
                                                    handleEdit(college.Clg_ID)
                                                }
                                                className="bg-yellow-400 shadow-md text-sm px-3 py-1 rounded hover:bg-yellow-500 disabled:opacity-50"
                                                disabled={loading}
                                                aria-label={`Edit details of college ${college.College_Name}`}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(college.Clg_ID)
                                                }
                                                className="bg-red-500 shadow-md text-white text-sm px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50"
                                                disabled={loading}
                                                aria-label={`Delete college ${college.College_Name}`}
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-gray-500">No results found</p>
                    )}
                </div>
            </Card>

            {/* Edit Form Modal */}
            {showEditForm && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="editFormTitle"
                    onClick={handleCloseEditForm}
                >
                    <div
                        className="bg-white p-6 rounded-lg shadow-lg w-[95%] max-w-4xl max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2
                            id="editFormTitle"
                            className="text-2xl font-bold text-gray-800 mb-4"
                        >
                            Edit College Details
                        </h2>
                        <HrForm
                            college={editingCollege}
                            updatedData={updatedData}
                            setUpdatedData={setUpdatedData}
                            onClose={handleCloseEditForm}
                            onSave={handleUpdate}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

HrData.propTypes = {
    className: PropTypes.string,
};

export default memo(HrData);

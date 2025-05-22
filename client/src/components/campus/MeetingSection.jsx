/* eslint-disable no-unused-vars */
import React, { useState, useCallback, useEffect, memo } from 'react';
import PropTypes from 'prop-types';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import * as apiService from '../../api/campus.js';

// Custom hook for meeting management
const useMeetings = () => {
    const [meetings, setMeetings] = useState([
        { date: new Date(2025, 4, 15), title: 'Team Sync' },
        { date: new Date(2025, 4, 20), title: 'Campus Drive' },
        { date: new Date(2025, 4, 16), title: 'Campus Drive' },
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Fetch meetings from backend
    const fetchMeetings = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await apiService.fetchMeetings();
            setMeetings(
                response.map((m) => ({ ...m, date: new Date(m.date) })) // Ensure date is Date object
            );
            setError('');
        } catch (err) {
            console.error('Error fetching meetings:', err);
            setError('Failed to load meetings');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Save meeting to backend
    const saveMeeting = useCallback(async (meeting, editIndex) => {
        setIsLoading(true);
        try {
            if (editIndex !== null) {
                await apiService.updateMeeting(meeting, editIndex);
            } else {
                await apiService.addMeeting(meeting);
            }
            await fetchMeetings();
            setError('');
        } catch (err) {
            console.error('Error saving meeting:', err);
            setError('Failed to save meeting');
        } finally {
            setIsLoading(false);
        }
    }, [fetchMeetings]);

    const deleteMeeting = useCallback(async (index) => {
        setIsLoading(true);
        try {
            await apiService.deleteMeeting(index);
            await fetchMeetings();
            setError('');
        } catch (err) {
            console.error('Error deleting meeting:', err);
            setError('Failed to delete meeting');
        } finally {
            setIsLoading(false);
        }
    }, [fetchMeetings]);

    useEffect(() => {
        fetchMeetings();
    }, [fetchMeetings]);

    return { meetings, isLoading, error, saveMeeting, deleteMeeting, setMeetings };
};

// Custom hook for form management
const useMeetingForm = ({ saveMeeting }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [title, setTitle] = useState('');
    const [editIndex, setEditIndex] = useState(null);
    const [formError, setFormError] = useState('');

    const handleScheduleMeeting = useCallback(() => {
        if (!title.trim()) {
            setFormError('Meeting title is required');
            return;
        }

        const newMeeting = { date: selectedDate, title };
        saveMeeting(newMeeting, editIndex);
        setTitle('');
        setEditIndex(null);
        setFormError('');
    }, [title, selectedDate, editIndex, saveMeeting]);

    const handleEdit = useCallback((index, meeting) => {
        setSelectedDate(meeting.date);
        setTitle(meeting.title);
        setEditIndex(index);
        setFormError('');
    }, []);

    return {
        selectedDate,
        setSelectedDate,
        title,
        setTitle,
        editIndex,
        setEditIndex,
        formError,
        handleScheduleMeeting,
        handleEdit,
    };
};

const MeetingSection = ({ className = '' }) => {
    const { meetings, isLoading, error, saveMeeting, deleteMeeting, setMeetings } =
        useMeetings();
    const {
        selectedDate,
        setSelectedDate,
        title,
        setTitle,
        editIndex,
        formError,
        handleScheduleMeeting,
        handleEdit,
    } = useMeetingForm({ saveMeeting });

    // Calendar tile styling
    const tileClassName = useCallback(
        ({ date, view }) => {
            if (
                view === 'month' &&
                meetings.find((m) => date.toDateString() === m.date.toDateString())
            ) {
                return 'bg-purple-800 text-blue-600 font-bold rounded-full';
            }
            return null;
        },
        [meetings]
    );

    return (
        <div className={`flex flex-col lg:flex-row gap-6 w-full ${className}`}>
            {/* Notifications */}
            <div className="w-full lg:w-1/2 bg-white p-4 rounded-xl shadow-md">
                <h2 className="text-xl font-bold text-gray-600 mb-5">Notifications</h2>
                {isLoading ? (
                    <p className="text-gray-500">Loading meetings...</p>
                ) : error ? (
                    <p className="text-red-600">{error}</p>
                ) : meetings.length === 0 ? (
                    <p className="text-gray-500">No meetings scheduled.</p>
                ) : (
                    <ul className="space-y-3" aria-label="Scheduled meetings">
                        {meetings.map((meeting, index) => (
                            <li
                                key={index}
                                className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-gray-100 p-3 rounded-lg"
                            >
                                <div className="mb-2 sm:mb-0">
                                    <p className="font-semibold">{meeting.title}</p>
                                    <p className="text-sm text-gray-600">
                                        {meeting.date.toLocaleDateString('en-US', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => handleEdit(index, meeting)}
                                        className="text-blue-600 hover:text-blue-800 text-sm disabled:text-gray-400"
                                        disabled={isLoading}
                                        aria-label={`Edit ${meeting.title} meeting`}
                                    >
                                        ✏️ Edit
                                    </button>
                                    <button
                                        onClick={() => deleteMeeting(index)}
                                        className="text-red-600 hover:text-red-800 text-sm disabled:text-gray-400"
                                        disabled={isLoading}
                                        aria-label={`Delete ${meeting.title} meeting`}
                                    >
                                        🗑️ Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Calendar + Scheduling */}
            <div className="w-full lg:w-1/2 bg-white p-4 rounded-xl shadow-md">
                <h2 className="text-xl font-bold text-gray-600 mb-5">Meeting Calendar</h2>
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                    <Calendar
                        value={selectedDate}
                        onChange={setSelectedDate}
                        tileClassName={tileClassName}
                        className="w-full max-w-sm"
                        aria-label="Select meeting date"
                    />
                    <div className="flex flex-col gap-3 mt-4 lg:mt-0 w-full max-w-xs">
                        <div>
                            <input
                                type="text"
                                placeholder="Meeting Title"
                                className="border w-full p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                disabled={isLoading}
                                aria-invalid={!!formError}
                                aria-describedby={formError ? 'title-error' : undefined}
                            />
                            {formError && (
                                <p id="title-error" className="text-red-600 text-sm mt-1">
                                    {formError}
                                </p>
                            )}
                        </div>
                        <button
                            className={`${editIndex !== null
                                ? 'bg-yellow-600 hover:bg-yellow-700'
                                : 'bg-gray-900 hover:bg-gray-950'
                                } text-white px-4 py-2 rounded-lg disabled:bg-gray-400`}
                            onClick={handleScheduleMeeting}
                            disabled={isLoading}
                            aria-label={editIndex !== null ? 'Update meeting' : 'Schedule meeting'}
                        >
                            {isLoading
                                ? 'Processing...'
                                : editIndex !== null
                                    ? 'Update Meeting'
                                    : 'Schedule Meeting'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

MeetingSection.propTypes = {
    className: PropTypes.string,
};


export default memo(MeetingSection);
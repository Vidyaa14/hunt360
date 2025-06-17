/* eslint-disable no-unused-vars */
import React, { useState } from "react";
//import EmailGenerator from "./EmailGenerator";
import 'toastify-js/src/toastify.css';

const baseURL = import.meta.env.VITE_API_BASE_URL
    ? `${import.meta.env.VITE_API_BASE_URL}/email-service`
    : 'http://localhost:3000/api/email-service';

const SendEmail = () => {
    const [formData, setFormData] = useState({
        recipient: '',
        describe: '',
        subject: '',
        body: '',
        numEmails: 1,
        sendIn: 0,
    });
    const [attachments, setAttachments] = useState([null]);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.recipient) newErrors.recipient = 'Recipient email is required';
        if (!formData.subject) newErrors.subject = 'Subject is required';
        if (!formData.body) newErrors.body = 'Body is required';
        if (formData.numEmails < 1) newErrors.numEmails = 'Number of emails must be at least 1';
        if (formData.sendIn < 0) newErrors.sendIn = 'Send time cannot be negative';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const addAttachment = () => {
        setAttachments([...attachments, null]);
    };

    const removeAttachment = (index) => {
        setAttachments(attachments.filter((_, i) => i !== index));
    };

    const updateAttachment = (file, index) => {
        const newAttachments = [...attachments];
        newAttachments[index] = file;
        setAttachments(newAttachments);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'numEmails' || name === 'sendIn' ? Number(value) : value,
        }));
        setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const sendEmail = async () => {
        if (!validateForm()) {
            window.Toastify({
                text: 'Please fix the form errors before submitting',
                duration: 3000,
                style: { background: 'red' },
            }).showToast();
            return;
        }

        setIsLoading(true);
        const data = new FormData();
        data.append('recipient', formData.recipient);
        data.append('describe', formData.describe);
        data.append('subject', formData.subject);
        data.append('body', formData.body);
        data.append('numEmails', formData.numEmails);
        data.append('sendIn', formData.sendIn);
        data.append('userId', 1);

        attachments.forEach((file, index) => {
            if (file) data.append('attachments', file);
        });

        try {
            const response = await fetch(`${baseURL}/send-email`, {
                method: 'POST',
                body: data,
            });

            const result = await response.json();
            if (response.ok) {
                window.Toastify({
                    text: result.message || 'Email(s) scheduled successfully!',
                    duration: 3000,
                    style: { background: 'green' },
                }).showToast();
                setFormData({
                    recipient: '',
                    describe: '',
                    subject: '',
                    body: '',
                    numEmails: 1,
                    sendIn: 0,
                });
                setAttachments([null]);
            } else {
                window.Toastify({
                    text: result.message || 'Failed to send email',
                    duration: 3000,
                    style: { background: 'red' },
                }).showToast();
            }
        } catch (error) {
            window.Toastify({
                text: `Error sending email: ${error.message}`,
                duration: 3000,
                style: { background: 'red' },
            }).showToast();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full bg-white shadow-lg rounded-lg p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Send Email</h2>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Recipient Email</label>
                        <input
                            type="email"
                            name="recipient"
                            className={`mt-1 w-full border rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500 ${errors.recipient ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="recipient@example.com"
                            value={formData.recipient}
                            onChange={handleInputChange}
                        />
                        {errors.recipient && <p className="text-red-500 text-sm mt-1">{errors.recipient}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Describe the Email</label>
                        <input
                            type="text"
                            name="describe"
                            className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
                            placeholder="Describe the email content"
                            value={formData.describe}
                            onChange={handleInputChange}
                        />
                    </div>

                    <button
                        className="w-full bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition duration-200"
                        onClick={() => window.Toastify({ text: 'Generate email feature not implemented', duration: 3000, style: { background: 'orange' } }).showToast()}
                    >
                        Generate Email Content
                    </button>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Subject</label>
                        <input
                            type="text"
                            name="subject"
                            className={`mt-1 w-full border rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500 ${errors.subject ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Email Subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                        />
                        {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Body</label>
                        <textarea
                            name="body"
                            rows="6"
                            className={`mt-1 w-full border rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500 ${errors.body ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Write the body of the email"
                            value={formData.body}
                            onChange={handleInputChange}
                        ></textarea>
                        {errors.body && <p className="text-red-500 text-sm mt-1">{errors.body}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Attachments</label>
                        <div className="mt-1 border border-gray-300 rounded-md p-4 space-y-3">
                            {attachments.map((file, index) => (
                                <div key={index} className="flex items-center space-x-3">
                                    <input
                                        type="file"
                                        className="w-full border border-gray-300 rounded-md p-1 text-sm"
                                        onChange={(e) => updateAttachment(e.target.files[0] || null, index)}
                                    />
                                    {index > 0 && (
                                        <button
                                            onClick={() => removeAttachment(index)}
                                            className="text-red-500 hover:text-red-700 font-bold"
                                            type="button"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addAttachment}
                                className="mt-2 bg-purple-600 text-white px-4 py-1 rounded-md hover:bg-purple-700 transition duration-200"
                            >
                                Add More Files
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Number of Emails</label>
                        <input
                            type="number"
                            name="numEmails"
                            min="1"
                            className={`mt-1 w-full border rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500 ${errors.numEmails ? 'border-red-500' : 'border-gray-300'}`}
                            value={formData.numEmails}
                            onChange={handleInputChange}
                        />
                        {errors.numEmails && <p className="text-red-500 text-sm mt-1">{errors.numEmails}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">Send in (minutes)</label>
                        <input
                            type="number"
                            name="sendIn"
                            min="0"
                            className={`mt-1 w-full border rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500 ${errors.sendIn ? 'border-red-500' : 'border-gray-300'}`}
                            value={formData.sendIn}
                            onChange={handleInputChange}
                        />
                        {errors.sendIn && <p className="text-red-500 text-sm mt-1">{errors.sendIn}</p>}
                    </div>

                    <button
                        onClick={sendEmail}
                        disabled={isLoading}
                        className={`w-full bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        type="button"
                    >
                        {isLoading ? 'Sending...' : 'Send Emails'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SendEmail;
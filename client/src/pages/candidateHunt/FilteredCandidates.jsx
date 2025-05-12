import React, { useState } from "react";
import { useLocation } from "react-router-dom";

const FilteredCandidates = () => {
    const location = useLocation();
    const [candidates, setCandidates] = useState(location.state?.candidates || []);

    const handleSendEmail = async (candidate, index) => {
        try {
            const response = await fetch("/sendCandidateEmail", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    candidateEmail: candidate.Email,
                    candidateName: candidate.Full_Name,
                    domain: candidate.Domain,
                    subDomain: candidate.Sub_Domain,
                }),
            });

            const result = await response.json();

            if (result.success) {
                alert(result.message || "Email sent successfully!");
                const updatedCandidates = [...candidates];
                updatedCandidates[index].email_status = 1;
                setCandidates(updatedCandidates);
            } else {
                alert("Failed to send email: " + result.error);
            }
        } catch (error) {
            console.error("Error sending email:", error);
            alert("Error sending email");
        }
    };

    return (
        <div className="p-5 bg-gray-100 min-h-screen">
            <h2 className="text-2xl text-purple-800 mb-5 text-center">Filtered Candidates</h2>
            <div className="flex flex-wrap gap-5 justify-center">
                {candidates.length === 0 ? (
                    <p>No candidates found.</p>
                ) : (
                    candidates.map((candidate, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 shadow-md w-72 flex flex-col gap-2">
                            <h3 className="text-lg text-gray-800">{candidate.Full_Name}</h3>
                            <p className="text-gray-600">Email: {candidate.Email}</p>
                            <p className="text-gray-600">Phone: {candidate.Phone_No}</p>
                            <p className="text-gray-600">Domain: {candidate.Domain}</p>
                            <p className="text-gray-600">Sub Domain: {candidate.Sub_Domain}</p>
                            <p className={`font-bold ${candidate.email_status === 1 ? "text-green-600" : "text-red-600"}`}>
                                Email Status: {candidate.email_status === 1 ? "Sent" : "Not Sent"}
                            </p>
                            <button
                                className={`mt-2 py-2 px-4 rounded text-white ${candidate.email_status === 1 ? "bg-gray-400" : "bg-purple-800 hover:bg-purple-700"}`}
                                disabled={candidate.email_status === 1}
                                onClick={() => handleSendEmail(candidate, index)}
                            >
                                {candidate.email_status === 1 ? "Email Sent" : "Send Email"}
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default FilteredCandidates;
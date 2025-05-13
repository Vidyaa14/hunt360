import db from '../config/database.js';
import { sendMailWithRetry } from '../utils/emailservice.js';

export const ensureLoggedIn = (req, res, next) => {
    console.log('Session data:', req.session);
    if (req.session && req.session.orgEmail && req.session.orgName) {
        next();
    } else {
        res.status(401).json({ success: false, error: "Organization not logged in." });
    }
};

export const filterCandidates = async (req, res) => {
    const { domain, subDomain } = req.body;
    const orgEmail = req.session.orgEmail;
    const orgName = req.session.orgName;

    if (!domain || !subDomain) {
        return res.status(200).json({ success: false, error: "Domain and SubDomain are required." });
    }

    try {
        const [results] = await db.query(
            `SELECT 
                cr.Full_Name, 
                cr.Email, 
                cr.Phone_No, 
                cr.Domain, 
                cr.Sub_Domain, 
                cr.Date, 
                cr.Month, 
                cr.Year,
                COALESCE(ces.email_status, 0) AS email_status
            FROM \`candidate ranking\` cr
            LEFT JOIN candidate_email_status ces 
                ON LOWER(cr.Email) = LOWER(ces.candidateEmail)
                AND LOWER(ces.orgName) = LOWER(?)
            WHERE LOWER(cr.Domain) = LOWER(?)
                AND LOWER(cr.Sub_Domain) = LOWER(?)
            ORDER BY cr.\`Rank\`
            LIMIT 3`,
            [orgName, domain, subDomain]
        );

        if (results.length === 0) {
            return res.status(200).json({ success: false, error: "No candidate data found for the selected filters." });
        }
        res.json({ success: true, data: results });
    } catch (error) {
        console.error("Error fetching candidates:", error);
        res.status(200).json({ success: false, error: error.message });
    }
};

export const sendCandidateEmail = async (req, res) => {
    const orgEmail = req.session.orgEmail;
    const orgName = req.session.orgName;
    const { candidateEmail, candidateName, domain, subDomain } = req.body;

    if (!candidateEmail || !candidateName || !domain || !subDomain) {
        return res.status(400).json({ success: false, error: "All candidate and domain fields are required." });
    }

    try {
        const [checkResults] = await db.query(
            `SELECT email_status 
            FROM candidate_email_status
            WHERE LOWER(candidateEmail) = LOWER(?)
            AND LOWER(orgName) = LOWER(?)
            LIMIT 1`,
            [candidateEmail, orgName]
        );

        if (checkResults.length > 0 && checkResults[0].email_status == 1) {
            return res.json({ success: true, message: "Email already sent." });
        }

        const mailOptions = {
            from: `"${orgName}" <${orgEmail}>`,
            replyTo: orgEmail,
            to: candidateEmail,
            subject: `${orgName}: Talent Corner Opportunity`,
            text: `Dear ${candidateName},\n\nWe are pleased to inform you about a new opportunity in the ${subDomain} domain.\n\nBest regards,\n${orgName}\n${orgEmail}`
        };

        const info = await sendMailWithRetry(mailOptions);
        console.log(`Candidate email sent to ${candidateEmail}: ${info.response}`);

        await db.query(
            `INSERT INTO candidate_email_status (candidateEmail, orgName, email_status, candidateName, subDomain)
            VALUES (?, ?, 1, ?, ?)
            ON DUPLICATE KEY UPDATE 
                email_status = 1, 
                candidateName = VALUES(candidateName), 
                subDomain = VALUES(subDomain)`,
            [candidateEmail, orgName, candidateName, subDomain]
        );

        res.json({ success: true, message: "Candidate email sent and status updated." });
    } catch (error) {
        console.error(`Error sending email to ${candidateEmail}:`, error);
        res.status(500).json({ success: false, error: "Error sending candidate email: " + error.message });
    }
};

export const getOrgEmailCount = async (req, res) => {
    try {
        const [results] = await db.query(
            `SELECT orgName, email_sent_count FROM org_email_counts ORDER BY email_sent_count DESC`
        );
        res.json({ success: true, data: results });
    } catch (error) {
        console.error("Error fetching org email count:", error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getDashboardData = async (req, res) => {
    const orgName = req.query.org;

    if (!orgName) {
        return res.status(400).json({ error: 'Organization name is required' });
    }

    try {
        let dashboardData = {};

        const [signupResults] = await db.query(
            'SELECT COUNT(*) AS totalSignups FROM franchiselogindata'
        );
        dashboardData.totalSignups = signupResults[0].totalSignups;

        const [orgEmailResults] = await db.query(
            'SELECT email_sent_count FROM org_email_counts WHERE orgName = ?',
            [orgName]
        );
        dashboardData.totalEmailsSent = orgEmailResults.length > 0 ? orgEmailResults[0].email_sent_count : 0;

        const [candidateResults] = await db.query(
            'SELECT COUNT(*) AS totalCandidates FROM `candidate ranking`'
        );
        dashboardData.totalCandidates = candidateResults[0].totalCandidates;

        const [dailyResults] = await db.query(
            `SELECT DATE(Timestamp) AS signupDate, COUNT(*) AS signupCount 
            FROM franchiselogindata
            GROUP BY DATE(Timestamp)
            ORDER BY DATE(Timestamp)`
        );
        dashboardData.signupDates = dailyResults.map(row => row.signupDate);
        dashboardData.signupCounts = dailyResults.map(row => row.signupCount);

        res.json(dashboardData);
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).json({ error: error.message });
    }
};

export const getCandidateByYear = async (req, res) => {
    try {
        const [results] = await db.query(
            `SELECT Year, COUNT(*) AS count 
            FROM \`candidate ranking\`
            GROUP BY Year
            ORDER BY YEAR`
        );
        res.json(results);
    } catch (error) {
        console.error("Error fetching candidate by year:", error);
        res.status(500).json({ error: error.message });
    }
};

export const getCandidateByDomain = async (req, res) => {
    const filter = req.query.filter;
    let sql = 'SELECT Domain, COUNT(*) AS count FROM `candidate ranking`';
    let params = [];

    if (filter) {
        sql += ' WHERE Year = ?';
        params.push(filter);
    }
    sql += ' GROUP BY Domain';

    try {
        const [results] = await db.query(sql, params);
        res.json(results);
    } catch (error) {
        console.error("Error fetching candidate by domain:", error);
        res.status(500).json({ error: error.message });
    }
};

export const getCandidateBySubdomain = async (req, res) => {
    const filter = req.query.filter;
    let sql = 'SELECT Sub_Domain, COUNT(*) AS count FROM `candidate ranking`';
    let params = [];

    if (filter) {
        sql += ' WHERE Year = ?';
        params.push(filter);
    }
    sql += ' GROUP BY Sub_Domain';

    try {
        const [results] = await db.query(sql, params);
        res.json(results);
    } catch (error) {
        console.error("Error fetching candidate by subdomain:", error);
        res.status(500).json({ error: error.message });
    }
};

export const verifyToken = async (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ success: false, error: 'Token is required.' });
    }

    try {
        const [results] = await db.query(
            'SELECT * FROM tokens WHERE token = ? AND used = 0',
            [token]
        );
        if (results.length === 0) {
            return res.status(400).json({ success: false, error: 'Invalid or used token.' });
        }
        res.json({ success: true });
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const submitCandidate = async (req, res) => {
    const {
        token, Full_Name, Email, Phone_No, Domain, Sub_Domain, dob, gender, location,
        pincode, state, city, country, emergencyPhone, contactName, contactRelation,
        highestQualification, degree, courseName, collegeName, universityName,
        yearOfPassing, marks, internship_experience, skills, resume_url
    } = req.body;
    const resume = req.files?.resume;

    try {
        const [tokenResults] = await db.query(
            'SELECT * FROM tokens WHERE token = ? AND used = 0',
            [token]
        );
        if (tokenResults.length === 0) {
            return res.status(400).json({ success: false, error: 'Invalid or used token.' });
        }

        await db.query('UPDATE tokens SET used = 1 WHERE token = ?', [token]);

        let resumePath = resume_url || '';
        if (resume) {
            resumePath = `/uploads/resumes/${Date.now()}_${resume.name}`;
            // Implement file saving logic here (e.g., using multer)
        }

        await db.query(
            `INSERT INTO \`candidate ranking\` (
                Full_Name, Email, Phone_No, Domain, Sub_Domain, Date, Month, Year,
                dob, gender, location, pincode, state, city, country, emergencyPhone,
                contactName, contactRelation, highestQualification, degree, courseName,
                collegeName, universityName, yearOfPassing, marks, internship_experience,
                skills, resume_url
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                Full_Name, Email, Phone_No, Domain, Sub_Domain,
                new Date().getDate(), new Date().getMonth() + 1, new Date().getFullYear(),
                dob, gender, location, pincode, state, city, country, emergencyPhone,
                contactName, contactRelation, highestQualification, degree, courseName,
                collegeName, universityName, yearOfPassing, marks, internship_experience,
                skills, resumePath
            ]
        );

        res.json({ success: true });
    } catch (error) {
        console.error('Candidate submission error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};
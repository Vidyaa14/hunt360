import nodemailer from 'nodemailer';
import db from '../config/database.js';
import { promises as fs } from 'fs';
import path from 'path';

export const saveEmail = async (emailData) => {
    const { userId, describe, subject, body, attachments, numEmails, sendIn } = emailData;

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Insert email record
        const [emailResult] = await connection.query(
            `INSERT INTO Emails (UserId, Description, Subject, Body, NumberOfEmails, SendAfterMinutes, Status)
             VALUES (?, ?, ?, ?, ?, ?, 'Pending')`,
            [userId, describe, subject, body, numEmails, sendIn]
        );

        const emailId = emailResult.insertId;

        // Save attachments and insert into EmailAttachments
        for (const attachment of attachments) {
            if (attachment) {
                const filePath = path.join('uploads', `${Date.now()}_${attachment.filename}`);
                await fs.writeFile(filePath, attachment.content);

                await connection.query(
                    `INSERT INTO EmailAttachments (EmailID, FileName, FilePath, UploadedAt)
                     VALUES (?, ?, ?, NOW())`,
                    [emailId, attachment.filename, filePath]
                );
            }
        }

        // Insert initial log
        await connection.query(
            `INSERT INTO EmailLogs (EmailID, Status, Message, Timestamp)
             VALUES (?, 'Queued', 'Email scheduled for sending', NOW())`,
            [emailId]
        );

        await connection.commit();
        return { emailId, status: 'Pending' };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

export const updateEmailStatus = async (emailId, status, message) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Update email status
        await connection.query(
            `UPDATE Emails SET Status = ? WHERE EmailID = ?`,
            [status, emailId]
        );

        // Insert log entry
        await connection.query(
            `INSERT INTO EmailLogs (EmailID, Status, Message, Timestamp)
             VALUES (?, ?, ?, NOW())`,
            [emailId, status, message]
        );

        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

export const sendEmail = async (req, res) => {
    try {
        const { recipients, describe, subject, body, numEmails, sendIn } = req.body;
        const attachments = req.files;
        const userId = req.body.userId || 1;

        if (!recipients || !subject || !body || !userId) {
            return res.status(400).json({ message: 'Recipients, subject, body, and userId are required' });
        }

        // Parse recipients from JSON string to array
        let recipientList;
        try {
            recipientList = JSON.parse(recipients);
            if (!Array.isArray(recipientList) || recipientList.length === 0) {
                return res.status(400).json({ message: 'Recipients must be a non-empty array' });
            }
        } catch (error) {
            return res.status(400).json({ message: 'Invalid recipients format' });
        }

        const { emailId } = await saveEmail({
            userId,
            describe,
            subject,
            body,
            recipients: recipientList, // Store recipient list in DB
            attachments: attachments?.map(file => ({
                filename: file.originalname,
                content: file.buffer,
            })) || [],
            numEmails,
            sendIn,
        });

        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE || 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const emailAttachments = attachments?.map(file => ({
            filename: file.originalname,
            content: file.buffer,
        })) || [];

        const sendTime = sendIn ? Date.now() + sendIn * 60 * 1000 : Date.now();

        // Send email to each recipient
        for (const recipient of recipientList) {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: recipient,
                subject,
                text: body,
                attachments: emailAttachments,
            };

            for (let i = 0; i < numEmails; i++) {
                setTimeout(async () => {
                    try {
                        await transporter.sendMail(mailOptions);
                        await updateEmailStatus(emailId, 'Sent', `Email sent successfully to ${recipient}`);
                    } catch (error) {
                        await updateEmailStatus(emailId, 'Failed', `Error sending email to ${recipient}: ${error.message}`);
                    }
                }, sendTime - Date.now());
            }
        }

        res.status(200).json({ message: 'Email(s) scheduled successfully', emailId });
    } catch (error) {
        await updateEmailStatus(emailId, 'Failed', `Error: ${error.message}`);
        res.status(500).json({ message: `Error: ${error.message}` });
    }
};

export const getEmailStatus = async (req, res) => {
    try {
        const { page = 1, pageSize = 10 } = req.query;
        const offset = (page - 1) * pageSize;

        // Query to fetch all email statuses
        const [rows] = await db.query(
            `
            SELECT 
                el.LogID AS logId,
                e.Subject AS subject,
                el.Status AS status,
                el.Timestamp AS timestamp,
                e.Body AS recipient,
                e.UserId AS userId
            FROM EmailLogs el
            JOIN Emails e ON el.EmailID = e.EmailID
            ORDER BY el.Timestamp DESC
            LIMIT ? OFFSET ?
            `,
            [parseInt(pageSize), parseInt(offset)]
        );

        // Get total count
        const [countResult] = await db.query(
            `
            SELECT COUNT(*) AS total
            FROM EmailLogs el
            JOIN Emails e ON el.EmailID = e.EmailID
            `
        );

        const totalRecords = countResult[0].total;
        const totalPages = Math.ceil(totalRecords / pageSize);

        res.status(200).json({
            data: rows,
            totalPages,
            currentPage: parseInt(page),
        });
    } catch (error) {
        res.status(500).json({ message: `Error fetching email status: ${error.message}` });
    }
};

export const getEmailHistory = async (req, res) => {
    try {
        const { page = 1, pageSize = 10 } = req.query;
        const offset = (page - 1) * pageSize;

        // Fetch all email history
        const [rows] = await db.query(
            `
            SELECT 
                EmailID AS emailId,
                Recipient AS recipient,
                Subject AS subject,
                UserId AS userId,
                CreatedAt AS sentAt
            FROM Emails
            ORDER BY CreatedAt DESC
            LIMIT ? OFFSET ?
            `,
            [parseInt(pageSize), parseInt(offset)]
        );

        // Get total count
        const [countResult] = await db.query(
            `SELECT COUNT(*) AS total FROM Emails`
        );

        const totalRecords = countResult[0].total;
        const totalPages = Math.ceil(totalRecords / pageSize);

        res.status(200).json({
            data: rows,
            totalPages,
            currentPage: parseInt(page),
        });
    } catch (error) {
        res.status(500).json({ message: `Error fetching email history: ${error.message}` });
    }
};

export const getUsers = async (req, res) => {
    try {
        const { page = 1, pageSize = 10 } = req.query;
        const offset = (page - 1) * pageSize;

        // Query to fetch users with pagination
        const [rows] = await db.query(
            `
            SELECT 
                UserId AS userId,
                Email AS email,
                Name AS name,
                PhoneNumber AS phone,
                Role AS role
            FROM EmailUsers
            ORDER BY UserId ASC
            LIMIT ? OFFSET ?
            `,
            [parseInt(pageSize), parseInt(offset)]
        );

        // Get total count for pagination
        const [countResult] = await db.query(
            `
            SELECT COUNT(*) AS total
            FROM EmailUsers
            `
        );
        const totalRecords = countResult[0].total;
        const totalPages = Math.ceil(totalRecords / pageSize);

        res.status(200).json({
            data: rows,
            totalPages,
            currentPage: parseInt(page),
        });
    } catch (error) {
        res.status(500).json({ message: `Error fetching users: ${error.message}` });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { email, name, phone, role } = req.body;

        if (!email || !name || !role) {
            return res.status(400).json({ message: 'Email, name, and role are required' });
        }

        // Validate email format
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Validate phone if provided
        if (phone && !/^\+?\d{10,15}$/.test(phone)) {
            return res.status(400).json({ message: 'Invalid phone number format (10-15 digits)' });
        }

        // Check for duplicate email (excluding the current user)
        const [existingEmail] = await db.query(
            `SELECT UserId FROM EmailUsers WHERE Email = ? AND UserId != ?`,
            [email, userId]
        );
        if (existingEmail.length > 0) {
            return res.status(400).json({ message: 'Email already in use by another user' });
        }

        // Update user
        const [result] = await db.query(
            `
            UPDATE EmailUsers
            SET Email = ?, Name = ?, PhoneNumber = ?, Role = ?
            WHERE UserId = ?
            `,
            [email, name, phone || null, role, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ message: `Error updating user: ${error.message}` });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // Check if user exists
        const [user] = await db.query(`SELECT UserId FROM EmailUsers WHERE UserId = ?`, [userId]);
        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check for associated emails
        const [emails] = await db.query(`SELECT EmailID FROM Emails WHERE UserId = ?`, [userId]);
        if (emails.length > 0) {
            return res.status(400).json({ message: 'Cannot delete user with associated emails' });
        }

        // Delete user
        const [result] = await db.query(`DELETE FROM EmailUsers WHERE UserId = ?`, [userId]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: `Error deleting user: ${error.message}` });
    }
};
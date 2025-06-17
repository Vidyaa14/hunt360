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
        const { describe, subject, body, numEmails, sendIn } = req.body;
        const attachments = req.files;
        const userId = req.body.userId || 1;

        if (!subject || !body || !userId) {
            return res.status(400).json({ message: 'Subject, body, and userId are required' });
        }

        const { emailId } = await saveEmail({
            userId,
            describe,
            subject,
            body,
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

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.DEFAULT_RECIPIENT || 'recipient@example.com',
            subject,
            text: body,
            attachments: emailAttachments,
        };

        const sendTime = sendIn ? Date.now() + sendIn * 60 * 1000 : Date.now();

        for (let i = 0; i < numEmails; i++) {
            setTimeout(async () => {
                try {
                    await transporter.sendMail(mailOptions);
                    await updateEmailStatus(emailId, 'Sent', 'Email sent successfully');
                } catch (error) {
                    await updateEmailStatus(emailId, 'Failed', `Error sending email: ${error.message}`);
                }
            }, sendTime - Date.now());
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
        const userId = req.body.userId || 1; // Placeholder: Replace with actual user authentication

        // Query to fetch email status with pagination
        const [rows] = await db.query(
            `
            SELECT 
                el.LogID AS logId,
                e.Subject AS subject,
                el.Status AS status,
                el.Timestamp AS timestamp,
                e.Body AS recipient
            FROM EmailLogs el
            JOIN Emails e ON el.EmailID = e.EmailID
            WHERE e.UserId = ?
            ORDER BY el.Timestamp DESC
            LIMIT ? OFFSET ?
            `,
            [userId, parseInt(pageSize), parseInt(offset)]
        );

        // Get total count for pagination
        const [countResult] = await db.query(
            `
            SELECT COUNT(*) AS total
            FROM EmailLogs el
            JOIN Emails e ON el.EmailID = e.EmailID
            WHERE e.UserId = ?
            `,
            [userId]
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
        const userId = req.body.userId || 1; // Placeholder: Replace with actual user authentication

        // Query to fetch email history with pagination
        const [rows] = await db.query(
            `
            SELECT 
                EmailID AS emailId,
                Recipient AS recipient,
                Subject AS subject,
                CreatedAt AS sentAt
            FROM Emails
            WHERE UserId = ?
            ORDER BY CreatedAt DESC
            LIMIT ? OFFSET ?
            `,
            [userId, parseInt(pageSize), parseInt(offset)]
        );

        // Get total count for pagination
        const [countResult] = await db.query(
            `
            SELECT COUNT(*) AS total
            FROM Emails
            WHERE UserId = ?
            `,
            [userId]
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
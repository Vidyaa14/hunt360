import db from '../config/database.js';

export const createResponse = async (req, res, next) => {
    try {
        const {
            name,
            contact,
            date_of_contact,
            number_of_times_contacted,
            contacted_by,
            contacted_person,
            feedback_notes
        } = req.body;

        const sql = `
      INSERT INTO response_log 
      (name, contact, date_of_contact, number_of_times_contacted, contacted_by, contacted_person, feedback_notes)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

        const [result] = await db.query(sql, [
            name,
            contact,
            date_of_contact,
            number_of_times_contacted,
            contacted_by,
            contacted_person,
            feedback_notes
        ]);

        res.status(200).json({ message: 'Response saved successfully!', id: result.insertId });
    } catch (err) {
        next(err);
    }
};

export const getResponses = async (req, res, next) => {
    try {
        const [results] = await db.query('SELECT * FROM response_log');
        res.status(200).json(results);
    } catch (err) {
        next(err);
    }
};
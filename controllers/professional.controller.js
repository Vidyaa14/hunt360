import db from '../config/database.js';

const knownDesignations = [
    'Senior HRBP',
    'Senior HR Manager',
    'HRBP Manager',
    'HRBP Lead',
    'HR Manager',
    'HR Director',
    'HR Business Partner'
];

const knownLocations = [
    'Bengaluru',
    'Mumbai',
    'Delhi NCR',
    'Pune',
    'Bangalore',
    'Gurgaon',
    'Chennai',
    'Noida',
    'Ahmedabad',
    'Varanasi'
];

export const filterProfessionals = async (req, res, next) => {
    try {
        const { industry, location, designation, experience } = req.body;

        let sql = `SELECT Name AS name, Designation AS title, Company AS company, Location AS location, \`LinkedIn URL\` AS linkedin FROM hr_details WHERE 1=1`;
        const params = [];

        if (industry) {
            sql += ' AND industry = ?';
            params.push(industry);
        }

        if (location) {
            if (location === 'Other') {
                sql += ` AND location NOT IN (${knownLocations.map(() => '?').join(',')})`;
                params.push(...knownLocations);
            } else {
                sql += ' AND location = ?';
                params.push(location);
            }
        }

        if (designation) {
            if (designation === 'Other') {
                sql += ` AND designation NOT IN (${knownDesignations.map(() => '?').join(',')})`;
                params.push(...knownDesignations);
            } else {
                sql += ' AND designation = ?';
                params.push(designation);
            }
        }

        if (experience) {
            sql += ' AND experience = ?';
            params.push(experience);
        }

        console.log('Received body:', req.body);
        console.log('SQL:', sql);
        console.log('Params:', params);

        const [results] = await db.query(sql, params);
        console.log('Data is getting fetched');
        res.status(200).json(results);
    } catch (err) {
        console.error('QUERY ERROR:', err);
        next(err);
    }
};
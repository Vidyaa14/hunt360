import db from '../config/database.js';

export const getTotalColleges = async (req, res) => {
    const { team, state, district } = req.query;

    try {
        let query = 'SELECT COUNT(*) AS total FROM new_table WHERE 1=1';
        const params = [];

        if (team) {
            query += ' AND Hr_team_name = ?';
            params.push(team);
        }
        if (state) {
            query += ' AND state = ?';
            params.push(state);
        }
        if (district) {
            query += ' AND district = ?';
            params.push(district);
        }

        const [results] = await db.query(query, params);
        res.json(results[0]);
    } catch (err) {
        console.error('MySQL Query Error:', err);
        res.status(500).json({ error: err.message });
    }
};

export const getTotalHired = async (req, res) => {
    const { team, state, district } = req.query;

    try {
        let query =
            'SELECT SUM(Hired_students) AS total_hired FROM new_table WHERE 1=1';
        const params = [];

        if (team) {
            query += ' AND Hr_team_name = ?';
            params.push(team);
        }
        if (state) {
            query += ' AND state = ?';
            params.push(state);
        }
        if (district) {
            query += ' AND district = ?';
            params.push(district);
        }

        const [results] = await db.query(query, params);
        res.json(results[0]);
    } catch (err) {
        console.error('MySQL Query Error:', err);
        res.status(500).json({ error: err.message });
    }
};

export const getTotalStudents = async (req, res) => {
    const { team, state, district } = req.query;

    try {
        let query =
            'SELECT SUM(Total_num_students) AS total_students FROM new_table WHERE 1=1';
        const params = [];

        if (team) {
            query += ' AND Hr_team_name = ?';
            params.push(team);
        }
        if (state) {
            query += ' AND state = ?';
            params.push(state);
        }
        if (district) {
            query += ' AND district = ?';
            params.push(district);
        }

        const [results] = await db.query(query, params);
        res.json(results[0]);
    } catch (err) {
        console.error('MySQL Query Error:', err);
        res.status(500).json({ error: err.message });
    }
};

export const getHrChart = async (req, res) => {
    const { state, district, team } = req.query;

    try {
        let query = `
            SELECT Hr_team_name, SUM(Hired_students) AS total_hired
            FROM new_table
            WHERE 1=1
        `;
        let values = [];

        if (state) {
            query += ' AND State = ?';
            values.push(state);
        }
        if (district) {
            query += ' AND District = ?';
            values.push(district);
        }
        if (team) {
            query += ' AND Hr_team_name = ?';
            values.push(team);
        }

        query += ' GROUP BY Hr_team_name';

        const [results] = await db.query(query, values);
        const chartData = results.map((row) => ({
            team: row.Hr_team_name,
            total_hired: row.total_hired ? parseInt(row.total_hired, 10) : 0,
        }));

        res.json({ chartData });
    } catch (err) {
        console.error('MySQL Chart Data Error (HR Team):', err);
        res.status(500).json({ error: err.message });
    }
};

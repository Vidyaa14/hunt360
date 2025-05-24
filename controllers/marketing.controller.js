import db from '../config/database.js';

export const getTotalColleges = async (req, res) => {
    const { team, proposal, state, district } = req.query;

    try {
        let query = 'SELECT COUNT(*) AS total FROM new_table WHERE 1=1';
        const params = [];

        if (team) {
            query += ' AND Marketing_team_name = ?';
            params.push(team);
        }
        if (proposal) {
            query += ' AND Send_proposal = ?';
            params.push(proposal);
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

export const getTotalPayment = async (req, res) => {
    const { team, proposal, state, district } = req.query;

    try {
        let query =
            "SELECT SUM(CAST(Total_payment AS UNSIGNED)) AS total_payment FROM new_table WHERE Payment_received = 'yes'";
        const params = [];

        if (team) {
            query += ' AND Marketing_team_name = ?';
            params.push(team);
        }
        if (proposal) {
            query += ' AND Send_proposal = ?';
            params.push(proposal);
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

export const getMarketingChart = async (req, res) => {
    const { state, district, team, sendProposal } = req.query;

    try {
        let query =
            'SELECT Marketing_team_name, COUNT(College_name) AS total_college FROM new_table WHERE 1=1';
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
            query += ' AND Marketing_team_name = ?';
            values.push(team);
        }
        if (sendProposal) {
            query += ' AND Send_proposal = ?';
            values.push(sendProposal);
        }

        query += ' GROUP BY Marketing_team_name';

        const [results] = await db.query(query, values);
        const chartData = results.map((row) => ({
            team: row.Marketing_team_name,
            total_college:
                row.total_college === null
                    ? 0
                    : parseInt(row.total_college, 10),
        }));

        res.json({ chartData });
    } catch (err) {
        console.error('MySQL Chart Data Error (Marketing Team):', err);
        res.status(500).json({ error: err.message });
    }
};


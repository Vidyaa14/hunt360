import db from '../config/database.js';

export const getDashboard = async (req, res) => {
    const queries = {
        total: 'SELECT COUNT(*) AS count FROM scraped_data',
        reviewed: `SELECT COUNT(*) AS count FROM scraped_data WHERE lead_status = "Closed" AND communication_status="Interested" AND updated="yes"`,
        pending: `SELECT COUNT(*) AS count FROM scraped_data WHERE lead_status = "In Progress" AND communication_status="Pending Call" AND updated="yes"`,
        marketing: `SELECT COUNT(*) AS count FROM scraped_data WHERE updated = "yes"`,
        growth: `
          SELECT ROUND(
              (COUNT(*) - (SELECT COUNT(*) FROM scraped_data WHERE MONTH(created_at) = MONTH(CURDATE()) - 1))
              / COUNT(*) * 100, 1
          ) AS rate 
          FROM scraped_data 
          WHERE MONTH(created_at) = MONTH(CURDATE())
      `,
        avgReview: `
          SELECT ROUND(AVG(DATEDIFF(updated_at, created_at)), 1) AS avg_review_time 
          FROM scraped_data 
          WHERE updated_at IS NOT NULL
      `,
        completion: `
          SELECT ROUND(COUNT(*) / (SELECT COUNT(*) FROM scraped_data) * 100, 0) AS completion_rate 
          FROM scraped_data 
          WHERE lead_status = "Closed"
      `,
        members: `
          SELECT COUNT(DISTINCT bd_name) AS count 
          FROM scraped_data 
          WHERE bd_name IS NOT NULL
      `,
    };

    try {
        const results = {};
        for (const key of Object.keys(queries)) {
            const [rows] = await db.query(queries[key]);
            results[key] = rows[0];
        }
        res.json(results);
    } catch (err) {
        console.error('Error fetching dashboard data:', err);
        res.status(500).json({ error: err.message });
    }
};

export const getUpcomingMeetings = async (req, res) => {
    try {
        const [results] = await db.query(`
          SELECT company_name, meeting_date 
          FROM scraped_data 
          WHERE meeting_date IS NOT NULL 
            AND DATE(meeting_date) BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 3 DAY)
          ORDER BY meeting_date ASC
      `);
        res.json(results);
    } catch (err) {
        console.error('Error fetching meetings:', err);
        res.status(500).json({ error: 'Failed to fetch meetings' });
    }
};

export const getDistinctFiles = async (req, res) => {
    try {
        const query = 'SELECT DISTINCT File FROM new_table';
        const [results] = await db.query(query);
        res.json(results);
    } catch (err) {
        console.error('MySQL Query Error:', err);
        res.status(500).json({ error: err.message });
    }
};

export const getHiringColleges = async (req, res) => {
    try {
        const query =
            "SELECT COUNT(*) as hiring FROM new_table WHERE Hiring = 'yes'";
        const [results] = await db.query(query);
        res.json({ total: results[0].hiring });
    } catch (err) {
        console.error('MySQL Query Error:', err);
        res.status(500).json({ error: err.message });
    }
};

export const getHiringCollegesConsultant = async (req, res) => {
    try {
        const query =
            "SELECT COUNT(*) as hiring FROM new_table WHERE Hiring_from_consultant = 'yes'";
        const [results] = await db.query(query);
        res.json({ total: results[0].hiring });
    } catch (err) {
        console.error('MySQL Query Error:', err);
        res.status(500).json({ error: err.message });
    }
};

export const getTotalScraped = async (req, res) => {
    try {
        const query =
            'SELECT COUNT(DISTINCT File) as total_scraped FROM new_table';
        const [results] = await db.query(query);
        res.json({ total: results[0].total_scraped });
    } catch (err) {
        console.error('MySQL Query Error:', err);
        res.status(500).json({ error: err.message });
    }
};

export const getLastFiveRows = async (req, res) => {
    try {
        const query = 'SELECT * FROM new_table ORDER BY Clg_ID DESC LIMIT 5';
        const [results] = await db.query(query);
        res.json(results);
    } catch (err) {
        console.error('MySQL Query Error:', err);
        res.status(500).json({ error: err.message });
    }
};

export const getMarketingTeamChart = async (req, res) => {
    try {
        const query = `
          SELECT Marketing_team_name, COUNT(College_name) AS total_college
          FROM new_table
          GROUP BY Marketing_team_name
      `;
        const [results] = await db.query(query);
        res.json(results);
    } catch (err) {
        console.error('MySQL Query Error:', err);
        res.status(500).json({ error: err.message });
    }
};

export const getHrTeamChart = async (req, res) => {
    try {
        const query = `
          SELECT Hr_team_name, SUM(Hired_students) AS total_hired
          FROM new_table
          GROUP BY Hr_team_name
      `;
        const [results] = await db.query(query);
        res.json(results);
    } catch (err) {
        console.error('MySQL Query Error:', err);
        res.status(500).json({ error: err.message });
    }
};

export const getCourseCollege = async (req, res) => {
    try {
        const query = `
          SELECT Course, COUNT(College_Name) AS total_College
          FROM new_table
          GROUP BY Course
      `;
        const [results] = await db.query(query);
        res.json(results);
    } catch (err) {
        console.error('SQL query error:', err);
        res.status(500).json({ error: 'Database query failed' });
    }
};

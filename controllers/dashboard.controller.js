import db from '../config/database.js';

export const getDashboard = async (req, res) => {
  const queries = {
    total: "SELECT COUNT(*) AS count FROM scraped_data",
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
    console.error("Error fetching dashboard data:", err);
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
    console.error("Error fetching meetings:", err);
    res.status(500).json({ error: "Failed to fetch meetings" });
  }
};
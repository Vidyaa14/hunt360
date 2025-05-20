import db from '../config/database.js';

export const getAnalytics = async (req, res) => {
  try {
    const [sectorRows] = await db.query(`
          SELECT job_title AS sectors, COUNT(*) AS count
          FROM scraped_data
          WHERE job_title IS NOT NULL AND job_title != '' AND job_title NOT IN ('Unknown', 'N/A')
          GROUP BY job_title
          ORDER BY count DESC
          LIMIT 5;
      `);

    const [statusRows] = await db.query(`
          SELECT communication_status AS status, COUNT(*) AS count
          FROM scraped_data
          GROUP BY communication_status;
      `);

    res.json({ sectors: sectorRows, status: statusRows });
  } catch (err) {
    console.error("Error in getAnalytics:", err);
    res.status(500).json({ error: err.message });
  }
};


export const getYearlyTrends = async (req, res) => {
  try {
    const [rows] = await db.query(`
          SELECT YEAR(created_at) AS year,
                 SUM(lead_status = 'Closed') AS Closed,
                 SUM(lead_status = 'In Progress') AS InProgress,
                 SUM(lead_status = 'Dropped') AS Dropped,
                 SUM(lead_status = 'New') AS New
          FROM scraped_data
          WHERE created_at IS NOT NULL
          GROUP BY YEAR(created_at)
          ORDER BY year ASC;
      `);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching yearly trends:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


export const getCompanyYearTrends = async (req, res) => {
  try {
    const [rows] = await db.query(`
          SELECT company_name, YEAR(created_at) AS year, COUNT(*) AS total
          FROM scraped_data
          WHERE company_name IN (
            SELECT company_name FROM (
              SELECT company_name
              FROM scraped_data
              GROUP BY company_name
              ORDER BY COUNT(*) DESC
              LIMIT 5
            ) AS top_companies
          )
          AND created_at IS NOT NULL
          GROUP BY company_name, year
          ORDER BY company_name, year;
      `);

    const grouped = {};
    rows.forEach(({ company_name, year, total }) => {
      if (!grouped[year]) grouped[year] = { year };
      grouped[year][company_name] = total;
    });

    res.json(Object.values(grouped));
  } catch (err) {
    console.error("Error fetching company trends:", err);
    res.status(500).json({ error: "Failed to fetch company trend data" });
  }
};

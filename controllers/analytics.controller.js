import db from '../config/database.js';

export const getAnalytics = (req, res) => {
    const queries = {
        sectors: `
      SELECT 
        job_title AS sectors,
        COUNT(*) AS count
      FROM scraped_data
      WHERE job_title IS NOT NULL 
        AND job_title != '' 
        AND job_title NOT IN ('Unknown', 'N/A')
      GROUP BY job_title
      ORDER BY count DESC
      LIMIT 5;
    `,
        status: `
      SELECT 
        communication_status AS status,
        COUNT(*) AS count
      FROM scraped_data
      GROUP BY communication_status
    `,
    };

    const results = {};

    db.query(queries.sectors, (err1, sectorRows) => {
        if (err1) {
            console.error("Error fetching sectors:", err1);
            return res.status(500).json({ error: err1.message });
        }

        results.sectors = sectorRows;

        db.query(queries.status, (err2, statusRows) => {
            if (err2) {
                console.error("Error fetching status:", err2);
                return res.status(500).json({ error: err2.message });
            }

            results.status = statusRows;
            res.json(results);
        });
    });
};

export const getYearlyTrends = (req, res) => {
    db.query(
        `
    SELECT YEAR(created_at) AS year,
           SUM(lead_status = 'Closed') AS Closed,
           SUM(lead_status = 'In Progress') AS InProgress,
           SUM(lead_status = 'Dropped') AS Dropped,
           SUM(lead_status = 'New') AS New
    FROM scraped_data
    WHERE created_at IS NOT NULL
    GROUP BY YEAR(created_at)
    ORDER BY year ASC
  `,
        (err, rows) => {
            if (err) {
                console.error("Error fetching yearly trends:", err);
                return res.status(500).json({ error: "Internal Server Error" });
            }
            res.json(rows);
        }
    );
};

export const getCompanyYearTrends = (req, res) => {
    db.query(
        `
    SELECT 
      company_name, 
      YEAR(created_at) AS year, 
      COUNT(*) AS total
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
  `,
        (err, rows) => {
            if (err) {
                console.error("Error fetching company trends:", err);
                return res.status(500).json({ error: "Failed to fetch company trend data" });
            }

            const grouped = {};
            rows.forEach(({ company_name, year, total }) => {
                if (!grouped[year]) grouped[year] = { year };
                grouped[year][company_name] = total;
            });

            const chartData = Object.values(grouped);
            res.json(chartData);
        }
    );
};

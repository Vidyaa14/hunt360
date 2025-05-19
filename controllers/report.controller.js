import db from '../config/database.js';
import { buildFilterConditions } from '../utils/filterUtils.js';

export const getLatestCommunication = (req, res) => {
    const query = `
    SELECT
      bd_name,
      company_name,
      DATE(updated_at) AS date, 
      communication_status
    FROM scraped_data
    WHERE bd_name IS NOT NULL AND bd_name != '' 
      AND company_name IS NOT NULL AND company_name != '' 
      AND communication_status IS NOT NULL AND communication_status != ''
    ORDER BY updated_at DESC
    LIMIT 3
  `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching latest communication:", err);
            return res.status(500).json({ error: "Failed to fetch latest communication" });
        }
        res.json(results);
    });
};

export const getReportSummary = (req, res) => {
    const hrQuery = `
    SELECT COUNT(*) AS count 
    FROM scraped_data
    WHERE updated = 'yes' 
      AND phone_number IS NOT NULL 
      AND phone_number != 'N/A'
  `;

    const marketingQuery = `
    SELECT COUNT(*) AS count 
    FROM scraped_data 
    WHERE lead_status = 'Closed' 
      AND communication_status = 'Interested' 
      AND updated = 'yes'
  `;

    const editsQuery = `
    SELECT COUNT(*) AS count 
    FROM scraped_data
    WHERE updated = 'yes'
  `;

    db.query(hrQuery, (err1, hrResults) => {
        if (err1) {
            console.error("[/report-summary] HR Query Error:", err1);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        const hrResult = hrResults[0];

        db.query(marketingQuery, (err2, marketingResults) => {
            if (err2) {
                console.error("[/report-summary] Marketing Query Error:", err2);
                return res.status(500).json({ error: "Internal Server Error" });
            }

            const marketingResult = marketingResults[0];

            db.query(editsQuery, (err3, editsResults) => {
                if (err3) {
                    console.error("[/report-summary] Edits Query Error:", err3);
                    return res.status(500).json({ error: "Internal Server Error" });
                }

                const editsResult = editsResults[0];

                const result = {
                    hrContacts: hrResult.count,
                    campaigns: marketingResult.count,
                    recordsEdited: editsResult.count,
                };

                res.json(result);
            });
        });
    });
};

export const getBdComparison = (req, res) => {
    const { bdName } = req.query;

    let query = `
    SELECT
      bd_name,
      COUNT(*) AS total_work,
      SUM(CASE WHEN communication_status = 'Interested' THEN 1 ELSE 0 END) AS interested,
      SUM(CASE WHEN communication_status = 'Not Interested' THEN 1 ELSE 0 END) AS not_interested,
      SUM(CASE WHEN communication_status = 'Pending Call' THEN 1 ELSE 0 END) AS pending_call,
      SUM(CASE WHEN communication_status = 'Follow-up Needed' THEN 1 ELSE 0 END) AS follow_up_needed
    FROM scraped_data
    WHERE bd_name IS NOT NULL AND bd_name != ''
  `;

    const queryParams = [];
    if (bdName) {
        query += ` AND bd_name = ?`;
        queryParams.push(bdName);
    }

    query += `
    GROUP BY bd_name
    ORDER BY total_work DESC
  `;

    db.query(query, queryParams, (err1, rows) => {
        if (err1) {
            console.error("[/bd-comparison] Main Query Error:", err1);
            return res.status(500).json({ error: "Failed to fetch BD comparison" });
        }

        const allBdQuery = `
      SELECT DISTINCT bd_name
      FROM scraped_data
      WHERE bd_name IS NOT NULL AND bd_name != ''
      ORDER BY bd_name
    `;

        db.query(allBdQuery, (err2, allBdNamesResult) => {
            if (err2) {
                console.error("[/bd-comparison] All BD Names Error:", err2);
                return res.status(500).json({ error: "Failed to fetch BD names" });
            }

            const allBdNames = allBdNamesResult.map((row) => row.bd_name);
            res.json({ chartData: rows, allBdNames });
        });
    });
};

export const getLeadStatusDistribution = (req, res) => {
    const filters = req.query;
    const { whereClause, params } = buildFilterConditions(filters);

    const query = `
    SELECT
      lead_status,
      COUNT(*) AS count
    FROM scraped_data
    ${whereClause}
    GROUP BY lead_status
    ORDER BY count DESC
  `;

    db.query(query, params, (err, rows) => {
        if (err) {
            console.error("[/lead-status-distribution] Query Error:", err);
            return res.status(500).json({ error: "Failed to fetch lead status distribution" });
        }

        res.json({ chartData: rows });
    });
};

export const getCommunicationStatusOverview = (req, res) => {
    const filters = req.query;
    const { whereClause, params } = buildFilterConditions(filters);

    const query = `
    SELECT
      communication_status,
      COUNT(*) AS count
    FROM scraped_data
    ${whereClause}
    GROUP BY communication_status
    ORDER BY count DESC
  `;

    db.query(query, params, (err, rows) => {
        if (err) {
            console.error("[/communication-status-overview] Query Error:", err);
            return res.status(500).json({ error: "Failed to fetch communication status overview" });
        }

        res.json({ chartData: rows });
    });
};

export const getLocationWiseLeadCount = (req, res) => {
    const filters = req.query;
    const { whereClause, params } = buildFilterConditions(filters);

    const query = `
    SELECT
      location,
      COUNT(*) AS count
    FROM scraped_data
    ${whereClause}
    GROUP BY location
    ORDER BY count DESC
    LIMIT 5
  `;

    db.query(query, params, (err, rows) => {
        if (err) {
            console.error("[/location-wise-lead-count] Query Error:", err);
            return res.status(500).json({ error: "Failed to fetch location-wise lead count" });
        }

        res.json({ chartData: rows });
    });
};

export const getStateWiseBdActivities = (req, res) => {
    const filters = req.query;
    const { whereClause, params } = buildFilterConditions(filters);

    const query = `
    SELECT
      state,
      COUNT(*) AS count
    FROM scraped_data
    ${whereClause}
    GROUP BY state
    ORDER BY count DESC
    LIMIT 5
  `;

    db.query(query, params, (err, rows) => {
        if (err) {
            console.error("[/state-wise-bd-activities] Query Error:", err);
            return res.status(500).json({ error: "Failed to fetch state-wise BD activities" });
        }

        res.json({ chartData: rows });
    });
};

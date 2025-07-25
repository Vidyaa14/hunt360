import db from '../config/database.js';
import { buildFilterConditions } from '../utils/filterUtils.js';

export const getLatestCommunication = async (req, res) => {
  try {
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
    const [results] = await db.query(query);
    res.json(results);
  } catch (err) {
    console.error('Error fetching latest communication:', err);
    res.status(500).json({ error: 'Failed to fetch latest communication' });
  }
};

export const getReportSummary = async (req, res) => {
  try {
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

    const [[hrResult], [marketingResult], [editsResult]] =
      await Promise.all([
        db.query(hrQuery),
        db.query(marketingQuery),
        db.query(editsQuery),
      ]);

    const result = {
      hrContacts: hrResult.count,
      campaigns: marketingResult.count,
      recordsEdited: editsResult.count,
    };

    res.json(result);
  } catch (err) {
    console.error('Error fetching report summary:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getBdComparison = async (req, res) => {
  try {
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
    const [rows] = await db.query(query, queryParams);

    const allBdQuery = `
      SELECT DISTINCT bd_name
      FROM scraped_data
      WHERE bd_name IS NOT NULL AND bd_name != ''
      ORDER BY bd_name
    `;
    const [allBdNamesResult] = await db.query(allBdQuery);
    const allBdNames = allBdNamesResult.map((row) => row.bd_name);

    res.json({ chartData: rows, allBdNames });
  } catch (err) {
    console.error('Error fetching BD comparison:', err);
    res.status(500).json({ error: 'Failed to fetch BD comparison' });
  }
};

export const getLeadStatusDistribution = async (req, res) => {
  try {
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
    const [rows] = await db.query(query, params);
    res.json({ chartData: rows });
  } catch (err) {
    console.error('Error fetching lead status distribution:', err);
    res.status(500).json({
      error: 'Failed to fetch lead status distribution',
    });
  }
};

export const getCommunicationStatusOverview = async (req, res) => {
  try {
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
    const [rows] = await db.query(query, params);
    res.json({ chartData: rows });
  } catch (err) {
    console.error('Error fetching communication status overview:', err);
    res.status(500).json({
      error: 'Failed to fetch communication status overview',
    });
  }
};

export const getLocationWiseLeadCount = async (req, res) => {
  try {
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
    const [rows] = await db.query(query, params);
    res.json({ chartData: rows });
  } catch (err) {
    console.error('Error fetching location-wise lead count:', err);
    res.status(500).json({
      error: 'Failed to fetch location-wise lead count',
    });
  }
};

export const getStateWiseBdActivities = async (req, res) => {
  try {
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
    const [rows] = await db.query(query, params);
    res.json({ chartData: rows });
  } catch (err) {
    console.error('Error fetching state-wise BD activities:', err);
    res.status(500).json({
      error: 'Failed to fetch state-wise BD activities',
    });
  }
};

export const reportsCSV = async (req, res) => {
  const filters = req.body;
  const { whereClause, params } = buildFilterConditions(filters);

  const updatedCondition = 'updated = ?';
  const updatedParam = 'yes';

  const finalWhereClause = whereClause
    ? `${whereClause} AND ${updatedCondition}`
    : `WHERE ${updatedCondition}`;

  const query = `
    SELECT
      id, company_name, industry AS name, location, job_title, address, phone_number,
      website_link AS url, contact_person_name, email, state, country, pincode,
      gst_number, bd_name, industry, sub_industry, communication_status, notes,
      meeting_date, lead_status, created_at, updated_at, mobile
    FROM scraped ungdom_data
    ${finalWhereClause}
  `;

  const finalParams = whereClause ? [...params, updatedParam] : [updatedParam];

  try {
    const [rows] = await db.query(query, finalParams);

    const formattedRows = rows.map(row => ({
      ...row,
      location: row.location ? row.location.split(',')[0].trim() : 'N/A',
      name: row.name ? row.name.split(',')[0].trim() : 'N/A',
    }));

    res.json(formattedRows);
  } catch (error) {
    console.error('[/reports] Query Error:', error);
    return res.status(500).json({ error: 'Failed to generate report' });
  }
};

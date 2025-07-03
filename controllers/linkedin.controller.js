import xlsx from 'xlsx';
import db from '../config/database.js';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getPreviousScrapes = async (req, res) => {
    try {
        const query = `
            SELECT name, company, location, follower, connection, url 
            FROM linkedin_profiles 
            ORDER BY id DESC 
            LIMIT 10
        `;
        const [results] = await db.query(query);
        res.json(results);
    } catch (err) {
        console.error('MySQL Fetch Error:', err.message);
        res.status(500).json({ error: 'Failed to fetch previous scraped data' });
    }
};

export const scrapeProfiles = async (req, res) => {
    const { search } = req.body;

    if (!search) {
        return res.status(400).json({ error: 'Search query is required.' });
    }

    console.log(`Scraping started for search: ${search}`);

    const scriptPath = path.join(__dirname, '../scripts/linkedin.js');
    const nodeProcess = spawn('node', [scriptPath, search]);

    let scrapedData = '';

    nodeProcess.stdout.on('data', (data) => {
        scrapedData += data.toString();
        console.log('Raw Node Output:\n', data.toString());
    });

    nodeProcess.stderr.on('data', (data) => {
        console.error(`Node Error: ${data.toString()}`);
    });

    nodeProcess.on('close', async (code) => {
        if (!scrapedData.trim()) {
            return res.status(500).json({ error: 'No data scraped.' });
        }

        const rows = scrapedData
            .trim()
            .split('\n')
            .map((row) => {
                const match = row.match(
                    /(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(.+)/
                );
                return match
                    ? [
                        match[1].trim(),
                        match[2].trim(),
                        match[3].trim(),
                        match[4].trim(),
                        match[5].trim(),
                        match[6].trim(),
                    ]
                    : null;
            })
            .filter(Boolean);

        if (rows.length === 0) {
            return res.status(500).json({ error: 'No valid data parsed.' });
        }

        try {
            for (const [name, company, location, follower, connection, url] of rows) {
                const query = `
                    INSERT INTO linkedin_profiles (name, company, location, follower, connection, url)
                    VALUES (?, ?, ?, ?, ?, ?)
                `;
                await db.query(query, [name, company, location, follower, connection, url]);
            }
            console.log(`Saved ${rows.length} records to database.`);

            res.json({
                message: `Scraping completed and ${rows.length} records saved.`,
                data: rows.map(([name, company, location, follower, connection, url]) => ({
                    name,
                    company,
                    location,
                    follower,
                    connection,
                    url,
                })),
            });
        } catch (err) {
            console.error(`[DB] Error saving data: ${err.message}`);
            res.status(500).json({ error: 'Failed to save data to database.' });
        }
    });

    nodeProcess.on('error', (err) => {
        console.error(`Failed to start Node script: ${err.message}`);
        res.status(500).json({ error: 'Failed to execute script' });
    });
};

export const uploadFile = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        if (sheetData.length > 0) {
            console.log('Excel column names:', Object.keys(sheetData[0]));
        }
        console.log('Uploaded sheet data:', sheetData);

        if (sheetData.length === 0) {
            return res.status(400).json({ error: 'Empty file uploaded' });
        }

        const insertQuery = `
            INSERT INTO linkedin_profiles (name, company, location, follower, connection, url)
            VALUES ?
        `;
        const values = sheetData.map((row) => [
            row['name'] || '',
            row['company'] || '',
            row['location'] || '',
            row['follower'] || '',
            row['connection'] || '',
            row['url'] || '',
        ]);

        const [result] = await db.query(insertQuery, [values]);
        res.status(200).json({ message: `Uploaded ${result.affectedRows} records successfully` });
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).json({ error: 'Failed to process the uploaded file' });
    }
};

export const cleanDuplicates = async (req, res) => {
    const deleteQuery = `
        DELETE t1 FROM linkedin_profiles t1
        INNER JOIN linkedin_profiles t2 
        ON LOWER(TRIM(t1.name)) = LOWER(TRIM(t2.name))
        WHERE t1.id > t2.id
    `;

    try {
        const [result] = await db.query(deleteQuery);
        res.status(200).json({ message: `Removed ${result.affectedRows} duplicate records successfully` });
    } catch (error) {
        console.error('MySQL Delete Error:', error);
        res.status(500).json({ error: 'Failed to remove duplicates' });
    }
};

export const getDataStats = async (req, res) => {
    try {
        const stats = {};

        const [totalResult] = await db.query('SELECT COUNT(*) AS total FROM linkedin_profiles');
        stats.total = totalResult[0].total || 0;

        const [missingResult] = await db.query(`
            SELECT 
                COUNT(*) AS total,
                SUM(CASE WHEN name IS NULL OR name = '' OR name = 'N/A' OR name = '-' OR name = 'NULL' OR name = 'Not Found' THEN 1 ELSE 0 END) AS name,
                SUM(CASE WHEN company IS NULL OR company = '' OR company = 'N/A' OR company = '-' OR company = 'NULL' OR company = 'Not Found' THEN 1 ELSE 0 END) AS company,
                SUM(CASE WHEN location IS NULL OR location = '' OR location = 'N/A' OR location = '-' OR location = 'NULL' OR location = 'Not Found' THEN 1 ELSE 0 END) AS location,
                SUM(CASE WHEN follower IS NULL OR follower = '' OR follower = 'N/A' OR follower = '-' OR follower = 'NULL' OR follower = 'Not Found' THEN 1 ELSE 0 END) AS follower,
                SUM(CASE WHEN connection IS NULL OR connection = '' OR connection = 'N/A' OR connection = '-' OR connection = 'NULL' OR connection = 'Not Found' THEN 1 ELSE 0 END) AS connection,
                SUM(CASE WHEN url IS NULL OR url = '' OR url = 'N/A' OR url = '-' OR url = 'NULL' OR url = 'Not Found' THEN 1 ELSE 0 END) AS url
            FROM linkedin_profiles;
        `);

        stats.missing = {
            name: missingResult[0].name || 0,
            company: missingResult[0].company || 0,
            location: missingResult[0].location || 0,
            follower: missingResult[0].follower || 0,
            connection: missingResult[0].connection || 0,
            url: missingResult[0].url || 0,
        };

        const [dupResult] = await db.query(`
            SELECT SUM(dupe_count - 1) AS duplicates FROM (
                SELECT COUNT(*) AS dupe_count
                FROM linkedin_profiles
                GROUP BY TRIM(LOWER(name))
                HAVING COUNT(*) > 1
            ) AS dup
        `);

        stats.duplicates = dupResult[0].duplicates || 0;

        res.status(200).json(stats);
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Failed to fetch data stats' });
    }
};

export const searchCompanies = async (req, res) => {
    try {
        const { company = '', location = '', updated = '', page = 1, limit = 10 } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);

        let baseQuery = 'FROM linkedin_profiles WHERE 1=1';
        const values = [];

        if (company) {
            baseQuery += ' AND LOWER(company) LIKE ?';
            values.push(`%${company.toLowerCase()}%`);
        }

        if (location) {
            baseQuery += ' AND LOWER(location) LIKE ?';
            values.push(`%${location.toLowerCase()}%`);
        }

        if (updated.toLowerCase() === 'yes') {
            baseQuery += " AND updated = 'Yes'";
        } else if (updated.toLowerCase() === 'no') {
            baseQuery += " AND (updated = 'No' OR updated IS NULL)";
        }

        const dataQuery = `SELECT id, name, company, location, follower, connection, url, updated, DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') AS updated_at ${baseQuery} LIMIT ? OFFSET ?`;
        const countQuery = `SELECT COUNT(*) AS total ${baseQuery}`;

        const dataParams = [...values, parseInt(limit), offset];

        const [results] = await db.query(dataQuery, dataParams);
        const [countResult] = await db.query(countQuery, values);

        const total = countResult[0].total;
        const totalPages = Math.ceil(total / parseInt(limit));

        res.json({
            data: results,
            total,
            totalPages,
            currentPage: parseInt(page),
            limit: parseInt(limit),
        });
    } catch (error) {
        console.error('Search companies error:', error);
        res.status(500).json({ error: 'Search failed' });
    }
};

export const searchProfiles = async (req, res) => {
    try {
        const { company = '', location = '', page = 1, limit = 10 } = req.query;
        const offset = (parseInt(page) - 1) * parseInt(limit);

        let baseQuery = "FROM linkedin_profiles WHERE updated = 'Yes'";
        const values = [];

        if (company) {
            baseQuery += ' AND LOWER(company) LIKE ?';
            values.push(`%${company.toLowerCase()}%`);
        }

        if (location) {
            baseQuery += ' AND LOWER(location) LIKE ?';
            values.push(`%${location.toLowerCase()}%`);
        }

        const dataQuery = `SELECT id, name, company, location, follower, connection, url, updated, updated_at ${baseQuery} LIMIT ? OFFSET ?`;
        const countQuery = `SELECT COUNT(*) AS total ${baseQuery}`;

        const dataParams = [...values, parseInt(limit), offset];

        const [results] = await db.query(dataQuery, dataParams);
        const [countResult] = await db.query(countQuery, values);

        const total = countResult[0].total;
        const totalPages = Math.ceil(total / parseInt(limit));

        res.json({
            data: results,
            total,
            totalPages,
            currentPage: parseInt(page),
            limit: parseInt(limit),
        });
    } catch (error) {
        console.error('Search profiles error:', error);
        res.status(500).json({ error: 'Search failed' });
    }
};

export const saveSingleEdit = async (req, res) => {
    try {
        const { id, name, company, location, follower, connection, url, updated } = req.body;

        if (!id) return res.status(400).json({ error: 'Missing ID' });

        const updateQuery = `
            UPDATE linkedin_profiles
            SET
                name = ?,
                company = ?,
                location = ?,
                follower = ?,
                connection = ?,
                url = ?,
                updated = ?,
                updated_at = NOW()
            WHERE id = ?
        `;
        const values = [name, company, location, follower, connection, url, updated, id];

        const [result] = await db.query(updateQuery, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'No matching record found to update' });
        }

        const [updatedRows] = await db.query(
            `SELECT 
                id, name, company, location, follower, connection, url, updated,
                DATE_FORMAT(updated_at, '%Y-%m-%d %H:%i:%s') AS updated_at
            FROM linkedin_profiles 
            WHERE id = ?`,
            [id]
        );

        res.json({
            message: 'Form data updated successfully!',
            updatedCompany: updatedRows[0],
        });
    } catch (error) {
        console.error('Update single edit form error:', error.message, error.sqlMessage);
        res.status(500).json({ error: 'Failed to update form data' });
    }
};

export const saveFinalProfile = async (req, res) => {
    try {
        const { id, name, company, location, follower, connection, url, status } = req.body;

        if (!id) {
            return res.status(400).json({ error: 'Missing ID' });
        }
        if (!name || !company) {
            return res.status(400).json({ error: 'Name and Company are required' });
        }

        const updateQuery = `
            UPDATE linkedin_profiles
            SET
                name = ?,
                company = ?,
                location = ?,
                follower = ?,
                connection = ?,
                url = ?,
                status = ?
            WHERE id = ?
        `;

        const values = [name, company, location, follower, connection, url, status, id];

        const [result] = await db.query(updateQuery, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'No matching record found to update' });
        }

        res.json({ message: 'Form data updated successfully!' });
    } catch (error) {
        console.error('Update final profile form error:', error.message, error.sqlMessage);
        res.status(500).json({ error: 'Failed to update form data' });
    }
};

export const deleteProfile = async (req, res) => {
    const { id } = req.params;

    const deleteQuery = 'DELETE FROM linkedin_profiles WHERE id = ?';

    try {
        const [result] = await db.query(deleteQuery, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Record not found' });
        }
        res.status(200).json({ message: `Record with ID ${id} deleted successfully` });
    } catch (error) {
        console.error('MySQL Delete Error:', error);
        res.status(500).json({ error: 'Failed to delete the record' });
    }
};

export const getDashboard = async (req, res) => {
    const queries = {
        totalProfiles: 'SELECT COUNT(*) AS count FROM linkedin_profiles',
        updatedProfiles: 'SELECT COUNT(*) AS count FROM linkedin_profiles WHERE updated = \'Yes\'',
        newThisWeek: `
            SELECT COUNT(*) AS count 
            FROM linkedin_profiles 
            WHERE WEEK(created_at) = WEEK(CURRENT_TIMESTAMP) 
            AND YEAR(created_at) = YEAR(CURRENT_TIMESTAMP)
        `,
        newThisMonth: `
            SELECT COUNT(*) AS count 
            FROM linkedin_profiles 
            WHERE MONTH(created_at) = MONTH(CURRENT_TIMESTAMP) 
            AND YEAR(created_at) = YEAR(CURRENT_TIMESTAMP)
        `,
    };

    try {
        const results = {};
        const keys = Object.keys(queries);

        for (const key of keys) {
            const [rows] = await db.query(queries[key]);
            results[key] = rows[0];
        }

        res.json(results);
    } catch (error) {
        console.error('Dashboard query error:', error);
        res.status(500).json({ error: error.message });
    }
};

export const getAnalytics = async (req, res) => {
    const queries = {
        status: `
            SELECT 
                status,
                COUNT(*) AS count
            FROM linkedin_profiles
            WHERE status IN ('Interested', 'Not Interested', 'Pending')
            GROUP BY status
        `,
        locations: `
            SELECT 
                location,
                COUNT(*) AS count
            FROM linkedin_profiles
            WHERE location IS NOT NULL 
                AND location != '' 
                AND location NOT IN ('Not Found', 'N/A')
            GROUP BY location
            ORDER BY count DESC
            LIMIT 10
        `,
        companies: `
            SELECT 
                company,
                COUNT(*) AS count
            FROM linkedin_profiles
            WHERE company IS NOT NULL 
                AND company != '' 
                AND company NOT IN ('Not Found', 'N/A')
            GROUP BY company
            ORDER BY count DESC
            LIMIT 5
        `,
        followerRanges: `
            SELECT 
                CASE 
                    WHEN follower IS NULL OR follower = 'Not Found' THEN 'Unknown'
                    WHEN follower LIKE '%K followers' THEN 
                        CASE 
                            WHEN CAST(REPLACE(SUBSTRING_INDEX(follower, 'K', 1), ' ', '') AS DECIMAL(10,2)) * 1000 < 500 THEN '<500'
                            WHEN CAST(REPLACE(SUBSTRING_INDEX(follower, 'K', 1), ' ', '') AS DECIMAL(10,2)) * 1000 BETWEEN 500 AND 1000 THEN '500-1000'
                            WHEN CAST(REPLACE(SUBSTRING_INDEX(follower, 'K', 1), ' ', '') AS DECIMAL(10,2)) * 1000 BETWEEN 1001 AND 5000 THEN '1000-5000'
                            ELSE '>5000'
                        END
                    ELSE 'Unknown'
                END AS rang,
                COUNT(*) AS count
            FROM linkedin_profiles
            GROUP BY 
                CASE 
                    WHEN follower IS NULL OR follower = 'Not Found' THEN 'Unknown'
                    WHEN follower LIKE '%K followers' THEN 
                        CASE 
                            WHEN CAST(REPLACE(SUBSTRING_INDEX(follower, 'K', 1), ' ', '') AS DECIMAL(10,2)) * 1000 < 500 THEN '<500'
                            WHEN CAST(REPLACE(SUBSTRING_INDEX(follower, 'K', 1), ' ', '') AS DECIMAL(10,2)) * 1000 BETWEEN 500 AND 1000 THEN '500-1000'
                            WHEN CAST(REPLACE(SUBSTRING_INDEX(follower, 'K', 1), ' ', '') AS DECIMAL(10,2)) * 1000 BETWEEN 1001 AND 5000 THEN '1000-5000'
                            ELSE '>5000'
                        END
                    ELSE 'Unknown'
                END
            ORDER BY FIELD(rang, '<500', '500-1000', '1000-5000', '>5000', 'Unknown')
        `,
    };

    try {
        const results = {};
        const keys = Object.keys(queries);

        for (const key of keys) {
            const [rows] = await db.query(queries[key]);
            results[key] = rows;
        }

        res.json(results);
    } catch (error) {
        console.error('Analytics query error:', error);
        res.status(500).json({ error: error.message });
    }
};

export const getReports = async (req, res) => {
    const { date, status, location } = req.body;
    let sql = 'SELECT * FROM linkedin_profiles WHERE 1=1';
    const params = [];

    if (date) {
        sql += ' AND DATE(created_at) = ?';
        params.push(date);
    }
    if (status) {
        sql += ' AND status = ?';
        params.push(status);
    }
    if (location) {
        sql += ' AND location LIKE ?';
        params.push(`%${location}%`);
    }

    try {
        const [results] = await db.query(sql, params);
        res.json(results);
    } catch (error) {
        console.error('Error fetching reports:', error.message, error.sqlMessage);
        res.status(500).json({ error: 'Failed to fetch reports', details: error.message });
    }
};
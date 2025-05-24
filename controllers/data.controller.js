import multer from 'multer';
import xlsx from 'xlsx';
import db from '../config/database.js';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const uploadFile = [
    upload.single('file'),
    async (req, res) => {
        if (!req.file)
            return res.status(400).json({ error: 'No file uploaded' });

        try {
            const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
            const sheet = workbook.SheetNames[0];
            const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheet]);

            if (data.length === 0)
                return res.status(400).json({ error: 'Empty file uploaded' });

            const insertQuery = `
        INSERT INTO scraped_data 
        (company_name, location, address, phone_number, website_link, job_title, gst_number)
        VALUES ?
      `;

            const values = data.map((row) => [
                row['Company_Name'] || '',
                row.Location ? row.Location.split(',')[0].trim() : '',
                row['Address'] || '',
                row['Phone'] || '',
                row['Website'] || '',
                row['Job_Title'] || '',
                row['GST Number(s)']
                    ? row['GST Number(s)'].split(',')[0].trim()
                    : '',
            ]);

            const [result] = await db.query(insertQuery, [values]);
            res.json({
                message: `Uploaded ${result.affectedRows} records successfully`,
            });
        } catch (error) {
            console.error('Upload error:', error);
            res.status(500).json({ error: 'Failed to process uploaded file' });
        }
    },
];

export const cleanDuplicates = async (req, res) => {
    try {
        const deleteQuery = `
      DELETE t1 FROM scraped_data t1
      INNER JOIN scraped_data t2 
      ON t1.company_name = t2.company_name 
      AND t1.location = t2.location
      WHERE t1.id > t2.id
    `;
        const [result] = await db.query(deleteQuery);
        res.json({
            message: `Removed ${result.affectedRows} duplicate records successfully`,
        });
    } catch (err) {
        console.error('Deduplication error:', err);
        res.status(500).json({ error: 'Failed to remove duplicates' });
    }
};

export const getDataStats = async (req, res) => {
    try {
        const [totalResult] = await db.query(
            'SELECT COUNT(*) AS total FROM scraped_data'
        );
        const stats = { total: totalResult[0].total };

        const [missingResult] = await db.query(`
      SELECT 
        COUNT(*) AS total,
        SUM(company_name IS NULL OR company_name = '' OR company_name IN ('N/A','-')) AS company_name,
        SUM(location IS NULL OR location = '' OR location IN ('N/A','-')) AS location,
        SUM(job_title IS NULL OR job_title = '' OR job_title IN ('N/A','-')) AS job_title,
        SUM(address IS NULL OR address = '' OR address IN ('N/A','-')) AS address,
        SUM(phone_number IS NULL OR phone_number = '' OR phone_number IN ('N/A','-')) AS phone_number,
        SUM(website_link IS NULL OR website_link = '' OR website_link IN ('N/A','-')) AS website_link
      FROM scraped_data
    `);

        stats.missing = {
            company_name: missingResult[0].company_name,
            location: missingResult[0].location,
            job_title: missingResult[0].job_title,
            address: missingResult[0].address,
            phone_number: missingResult[0].phone_number,
            website_link: missingResult[0].website_link,
        };

        const [dupResult] = await db.query(`
      SELECT SUM(dupe_count - 1) AS duplicates FROM (
        SELECT COUNT(*) AS dupe_count
        FROM scraped_data
        GROUP BY TRIM(LOWER(company_name)), TRIM(LOWER(location))
        HAVING COUNT(*) > 1
      ) AS dup
    `);

        stats.duplicates = dupResult[0].duplicates;
        res.json(stats);
    } catch (err) {
        console.error('Stats error:', err);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
};

export const getPreviousScrapes = async (req, res) => {
    try {
        const [results] = await db.query(`
      SELECT job_title, company_name, location 
      FROM scraped_data 
      ORDER BY id DESC 
      LIMIT 10
    `);
        res.json(results);
    } catch (err) {
        console.error('Fetch error:', err);
        res.status(500).json({
            error: 'Failed to fetch previous scraped data',
        });
    }
};

export const searchCompanies = async (req, res) => {
    const {
        name = '',
        city = '',
        updated = '',
        page = 1,
        limit = 10,
    } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let baseQuery = 'FROM scraped_data WHERE 1=1';
    const values = [];

    if (name) {
        baseQuery += ' AND LOWER(company_name) LIKE ?';
        values.push(`%${name.toLowerCase()}%`);
    }

    if (city) {
        baseQuery += ' AND LOWER(location) LIKE ?';
        values.push(`%${city.toLowerCase()}%`);
    }

    if (updated.toLowerCase() === 'yes') {
        baseQuery += " AND updated = 'yes'";
    } else if (updated.toLowerCase() === 'no') {
        baseQuery += " AND (updated = 'no' OR updated IS NULL)";
    }

    try {
        const [data] = await db.query(
            `SELECT *, updated_at ${baseQuery} LIMIT ? OFFSET ?`,
            [...values, parseInt(limit), offset]
        );
        const [count] = await db.query(
            `SELECT COUNT(*) AS total ${baseQuery}`,
            values
        );
        const total = count[0].total;
        res.json({
            data,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            limit: parseInt(limit),
        });
    } catch (err) {
        console.error('Search error:', err);
        res.status(500).json({ error: 'Search failed' });
    }
};

export const searchMarketingData = async (req, res) => {
    const {
        name = '',
        city = '',
        communication_status = '',
        lead_status = '',
        page = 1,
        limit = 10,
    } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let baseQuery = "FROM scraped_data WHERE updated = 'yes'";
    const values = [];

    if (name) {
        baseQuery += ' AND LOWER(company_name) LIKE ?';
        values.push(`%${name.toLowerCase()}%`);
    }

    if (city) {
        baseQuery += ' AND LOWER(location) LIKE ?';
        values.push(`%${city.toLowerCase()}%`);
    }

    if (communication_status) {
        baseQuery += ' AND communication_status = ?';
        values.push(communication_status);
    }

    if (lead_status) {
        baseQuery += ' AND lead_status = ?';
        values.push(lead_status);
    }

    try {
        const [data] = await db.query(
            `SELECT * ${baseQuery} LIMIT ? OFFSET ?`,
            [...values, parseInt(limit), offset]
        );
        const [count] = await db.query(
            `SELECT COUNT(*) AS total ${baseQuery}`,
            values
        );
        const total = count[0].total;

        res.json({
            data,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            limit: parseInt(limit),
        });
    } catch (err) {
        console.error('Marketing search error:', err);
        res.status(500).json({ error: 'Search failed' });
    }
};

export const saveForm = async (req, res) => {
    const {
        id,
        company_name,
        contact_person_name,
        mobile,
        email,
        location,
        state,
        country,
        pincode,
        gst_number,
        bd_name,
        phone_number,
        industry,
        sub_industry,
        website_link,
        updated,
        communication_status,
        notes,
        meeting_date,
        lead_status,
        address,
    } = req.body;

    if (!id) return res.status(400).json({ error: 'Missing company ID' });

    const formattedMeetingDate = meeting_date
        ? new Date(meeting_date).toISOString().split('T')[0]
        : null;

    const updateQuery = `
    UPDATE scraped_data SET
      company_name = ?, contact_person_name = ?, mobile = ?, email = ?, location = ?,
      state = ?, country = ?, pincode = ?, gst_number = ?, bd_name = ?, phone_number = ?,
      industry = ?, sub_industry = ?, website_link = ?, updated = ?, communication_status = ?,
      notes = ?, meeting_date = ?, lead_status = ?, address = ?, updated_at = NOW()
    WHERE id = ?
  `;

    const values = [
        company_name,
        contact_person_name,
        mobile,
        email,
        location,
        state,
        country,
        pincode,
        gst_number,
        bd_name,
        phone_number,
        industry,
        sub_industry,
        website_link,
        updated,
        communication_status,
        notes,
        formattedMeetingDate,
        lead_status,
        address,
        id,
    ];

    try {
        const [result] = await db.query(updateQuery, values);
        if (result.affectedRows === 0)
            return res.status(404).json({ error: 'No matching record found' });

        res.json({ message: 'Form data updated successfully!' });
    } catch (err) {
        console.error('Update form error:', err);
        res.status(500).json({ error: 'Failed to update form data' });
    }
};

export const deleteRecord = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query(
            'DELETE FROM scraped_data WHERE id = ?',
            [id]
        );
        res.status(200).json({ message: 'Record deleted successfully' });
    } catch (err) {
        console.error('Delete error:', err);
        res.status(500).json({ error: 'Failed to delete the record' });
    }
};

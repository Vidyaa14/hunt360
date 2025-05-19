import multer from "multer";
import xlsx from "xlsx";
import db from '../config/database.js';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const uploadFile = [
    upload.single("file"),
    (req, res) => {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        try {
            const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
            const sheetName = workbook.SheetNames[0];
            const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

            if (sheetData.length === 0) {
                return res.status(400).json({ error: "Empty file uploaded" });
            }

            const insertQuery =
                "INSERT INTO scraped_data (company_name, location, address, phone_number, website_link, job_title, gst_number) VALUES ?";
            const values = sheetData.map((row) => [
                row["Company_Name"] || "",
                row.Location ? row.Location.split(",")[0].trim() : "",
                row["Address"] || "",
                row["Phone"] || "",
                row["Website"] || "",
                row["Job_Title"] || "",
                row["GST Number(s)"] ? row["GST Number(s)"].split(",")[0].trim() : "",
            ]);

            db.query(insertQuery, [values], (err, result) => {
                if (err) {
                    console.error("MySQL Insert Error:", err);
                    return res.status(500).json({ error: "Database insert failed" });
                }
                res.json({ message: `Uploaded ${result.affectedRows} records successfully` });
            });
        } catch (error) {
            console.error("Error processing file:", error);
            return res.status(500).json({ error: "Failed to process the uploaded file" });
        }
    },
];

export const cleanDuplicates = (req, res) => {
    const deleteQuery = `
      DELETE t1 FROM scraped_data t1
      INNER JOIN scraped_data t2 
      ON t1.company_name = t2.company_name 
      AND t1.location = t2.location
      WHERE t1.id > t2.id;
    `;

    db.query(deleteQuery, (err, result) => {
        if (err) {
            console.error("MySQL Delete Error:", err);
            return res.status(500).json({ error: "Failed to remove duplicates" });
        }
        res.json({ message: `Removed ${result.affectedRows} duplicate records successfully` });
    });
};

export const getDataStats = (req, res) => {
    const stats = {};

    db.query("SELECT COUNT(*) AS total FROM scraped_data", (err, totalResult) => {
        if (err) return res.status(500).json({ error: "Failed to get total count" });

        stats.total = totalResult[0].total;

        db.query(
            `SELECT 
          COUNT(*) AS total,
          SUM(CASE WHEN company_name IS NULL OR company_name = '' OR company_name = 'N/A' OR company_name = '-' THEN 1 ELSE 0 END) AS company_name,
          SUM(CASE WHEN location IS NULL OR location = '' OR location = 'N/A' OR location = '-' THEN 1 ELSE 0 END) AS location,
          SUM(CASE WHEN job_title IS NULL OR job_title = '' OR job_title = 'N/A' OR job_title = '-' THEN 1 ELSE 0 END) AS job_title,
          SUM(CASE WHEN address IS NULL OR address = '' OR address = 'N/A' OR address = '-' THEN 1 ELSE 0 END) AS address,
          SUM(CASE WHEN phone_number IS NULL OR phone_number = '' OR phone_number = 'N/A' OR phone_number = '-' THEN 1 ELSE 0 END) AS phone_number,
          SUM(CASE WHEN website_link IS NULL OR website_link = '' OR website_link = 'N/A' OR website_link = '-' THEN 1 ELSE 0 END) AS website_link
        FROM scraped_data`,
            (err, result) => {
                if (err) return res.status(500).json({ error: "Failed to get missing count" });

                stats.missing = {
                    company_name: result[0].company_name,
                    location: result[0].location,
                    job_title: result[0].job_title,
                    address: result[0].address,
                    phone_number: result[0].phone_number,
                    website_link: result[0].website_link,
                };
                stats.total = result[0].total;

                db.query(
                    `SELECT SUM(dupe_count - 1) AS duplicates FROM (
              SELECT COUNT(*) AS dupe_count
              FROM scraped_data
              GROUP BY TRIM(LOWER(company_name)), TRIM(LOWER(location))
              HAVING COUNT(*) > 1
            ) AS dup;`,
                    (err, dupResult) => {
                        if (err) return res.status(500).json({ error: "Failed to get duplicate count" });

                        stats.duplicates = dupResult[0].duplicates;
                        res.json(stats);
                    }
                );
            }
        );
    });
};

export const getPreviousScrapes = (req, res) => {
    const query = "SELECT job_title, company_name, location FROM scraped_data ORDER BY id DESC LIMIT 10";

    db.query(query, (err, results) => {
        if (err) {
            console.error("MySQL Fetch Error:", err);
            return res.status(500).json({ error: "Failed to fetch previous scraped data" });
        }
        res.json(results);
    });
};

export const searchCompanies = (req, res) => {
    const { name = "", city = "", updated = "", page = 1, limit = 10 } = req.query;

    let baseQuery = "FROM scraped_data WHERE 1=1";
    const values = [];

    if (name) {
        baseQuery += " AND LOWER(company_name) LIKE ?";
        values.push(`%${name.toLowerCase()}%`);
    }

    if (city) {
        baseQuery += " AND LOWER(location) LIKE ?";
        values.push(`%${city.toLowerCase()}%`);
    }

    if (updated.toLowerCase() === "yes") {
        baseQuery += " AND updated = 'yes'";
    } else if (updated.toLowerCase() === "no") {
        baseQuery += " AND (updated = 'no' OR updated IS NULL)";
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const dataQuery = `SELECT *, updated_at ${baseQuery} LIMIT ? OFFSET ?`;
    const countQuery = `SELECT COUNT(*) AS total ${baseQuery}`;
    const dataParams = [...values, parseInt(limit), offset];

    db.query(dataQuery, dataParams, (err, results) => {
        if (err) {
            console.error("Data query failed:", err);
            return res.status(500).json({ error: "Search failed" });
        }

        db.query(countQuery, values, (err, countResult) => {
            if (err) {
                console.error("Count query failed:", err);
                return res.status(500).json({ error: "Count failed" });
            }

            const total = countResult[0].total;
            const totalPages = Math.ceil(total / limit);

            res.json({
                data: results,
                total,
                totalPages,
                currentPage: parseInt(page),
                limit: parseInt(limit),
            });
        });
    });
};

export const searchMarketingData = (req, res) => {
    const { name = "", city = "", communication_status = "", lead_status = "", page = 1, limit = 10 } = req.query;

    let baseQuery = "FROM scraped_data WHERE updated = 'yes'";
    const values = [];

    if (name) {
        baseQuery += " AND LOWER(company_name) LIKE ?";
        values.push(`%${name.toLowerCase()}%`);
    }

    if (city) {
        baseQuery += " AND LOWER(location) LIKE ?";
        values.push(`%${city.toLowerCase()}%`);
    }

    if (communication_status) {
        baseQuery += " AND communication_status = ?";
        values.push(communication_status);
    }

    if (lead_status) {
        baseQuery += " AND lead_status = ?";
        values.push(lead_status);
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const dataQuery = `SELECT * ${baseQuery} LIMIT ? OFFSET ?`;
    const countQuery = `SELECT COUNT(*) AS total ${baseQuery}`;
    const dataParams = [...values, parseInt(limit), offset];

    db.query(dataQuery, dataParams, (err, results) => {
        if (err) {
            console.error("Marketing data query failed:", err);
            return res.status(500).json({ error: "Search failed" });
        }

        db.query(countQuery, values, (err, countResult) => {
            if (err) {
                console.error("Marketing count query failed:", err);
                return res.status(500).json({ error: "Count failed" });
            }

            const total = countResult[0].total;
            const totalPages = Math.ceil(total / limit);

            res.json({
                data: results,
                total,
                totalPages,
                currentPage: parseInt(page),
                limit: parseInt(limit),
            });
        });
    });
};

export const saveForm = (req, res) => {
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

    if (!id) {
        return res.status(400).json({ error: "Missing company ID" });
    }

    let formattedMeetingDate = meeting_date;
    if (meeting_date) {
        formattedMeetingDate = new Date(meeting_date).toISOString().split("T")[0];
    }

    const updateQuery = `
      UPDATE scraped_data SET
        company_name = ?,
        contact_person_name = ?,
        mobile = ?,
        email = ?,
        location = ?,
        state = ?,
        country = ?,
        pincode = ?,
        gst_number = ?,
        bd_name = ?,
        phone_number = ?,
        industry = ?,
        sub_industry = ?,
        website_link = ?,
        updated = ?,
        communication_status = ?,
        notes = ?,
        meeting_date = ?,
        lead_status = ?,
        address = ?,
        updated_at = NOW()
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

    db.query(updateQuery, values, (err, result) => {
        if (err) {
            console.error("Update form error:", err);
            return res.status(500).json({ error: "Failed to update form data" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "No matching record found to update" });
        }

        res.json({ message: "Form data updated successfully!" });
    });
};

export const deleteRecord = (req, res) => {
    const { id } = req.params;

    const query = "DELETE FROM scraped_data WHERE id = ?";
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error("Error deleting record:", err);
            return res.status(500).json({ error: "Failed to delete the record" });
        }

        res.status(200).json({ message: "Record deleted successfully" });
    });
};
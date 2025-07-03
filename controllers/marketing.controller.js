import db from '../config/database.js';
import xlsx from 'xlsx';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

export const searchColleges = async (req, res) => {
    try {
        const { college, location, course } = req.query;

        let query = "SELECT * FROM new_table WHERE 1=1";
        let values = [];

        if (college) {
            query += " AND College_Name LIKE ?";
            values.push(`%${college}%`);
        }

        if (location) {
            const locations = location.split(',');
            const placeholders = locations.map(() => "(State LIKE ? OR District LIKE ?)").join(' OR ');
            query += ` AND (${placeholders})`;
            locations.forEach(loc => {
                values.push(`%${loc}%`, `%${loc}%`);
            });
        }

        if (course) {
            const courses = course.split(',');
            const placeholders = courses.map(() => "( Course LIKE ?)").join(' OR ');
            query += ` AND (${placeholders})`;
            courses.forEach(c => {
                values.push(`%${c}%`, `%${c}%`);
            });
        }

        console.log("Executing query:", query, "with values:", values);

        const [results] = await db.query(query, values);
        res.json(results);
    } catch (err) {
        console.error("❌ MySQL Search Error:", err);
        res.status(500).json({ error: err.message });
    }
};

export const updateCollege = async (req, res) => {
    try {
        const collegeId = Number(req.params.id);

        if (isNaN(collegeId)) {
            return res.status(400).json({ error: "Invalid college ID. It must be a number." });
        }

        const updatedData = req.body;

        const updateQuery = `
            UPDATE new_table
            SET
                College_Name = ?, State = ?, District = ?, Course = ?, Anual_fees = ?, 
                Placement_fees = ?, Address = ?, Phone = ?, update_timestamp = ?, 
                Director_name = ?, Director_number = ?, Director_email = ?, 
                Placement_coor_name = ?, Placement_coor_contact = ?, Placement_coor_email = ?, 
                Data_updated_by_name = ?, Marketing_team_name = ?, Hiring = ?, 
                Hiring_from_consultant = ?, Final_outcome = ?, Send_proposal = ?, 
                Spoke_for_placement = ?, Resume_received = ?, Interview_status = ?, 
                Total_num_candidates = ?, Placed_candidates = ?, Total_num_students = ?, 
                Hired_students = ?, Hr_team_name = ?, Total_payment = ?, Payment_received = ?, 
                Replacement_period = ?, Term = ?, Ranking = ?, Date_of_Contact = ?, 
                Date_of_Next_Contact = ?, Placed_on_Year = ?, Placed_on_Month = ?
            WHERE Clg_ID = ?`;

        const values = [
            updatedData.College_Name || null,
            updatedData.State || null,
            updatedData.District || null,
            updatedData.Course || null,
            updatedData.Anual_fees || null,
            updatedData.Placement_fees || null,
            updatedData.Address || null,
            updatedData.Phone || null,
            new Date().toISOString().slice(0, 19).replace('T', ' '),
            updatedData.Director_name || null,
            updatedData.Director_number || null,
            updatedData.Director_email || null,
            updatedData.Placement_coor_name || null,
            updatedData.Placement_coor_contact || null,
            updatedData.Placement_coor_email || null,
            updatedData.Data_updated_by_name || null,
            updatedData.Marketing_team_name || null,
            updatedData.Hiring || null,
            updatedData.Hiring_from_consultant || null,
            updatedData.Final_outcome || null,
            updatedData.Send_proposal || null,
            updatedData.Spoke_for_placement || null,
            updatedData.Resume_received || null,
            updatedData.Interview_status || null,
            updatedData.Total_num_candidates || null,
            updatedData.Placed_candidates || null,
            updatedData.Total_num_students || null,
            updatedData.Hired_students || null,
            updatedData.Hr_team_name || null,
            updatedData.Total_payment || null,
            updatedData.Payment_received || null,
            updatedData.Replacement_period || null,
            updatedData.Term || null,
            updatedData.Ranking || null,
            updatedData.Date_of_Contact || null,
            updatedData.Date_of_Next_Contact || null,
            updatedData.Placed_on_Year || null,
            updatedData.Placed_on_Month || null,
            collegeId
        ];

        const [result] = await db.query(updateQuery, values);

        if (result.affectedRows > 0) {
            res.json({ message: "✅ Data updated successfully" });
        } else {
            res.status(400).json({ message: "No changes made or record not found" });
        }
    } catch (err) {
        console.error("❌ MySQL Update Error:", err);
        res.status(500).json({ error: "Database update failed" });
    }
};

export const deleteCollege = async (req, res) => {
    try {
        const collegeId = req.params.id;
        const deleteQuery = `DELETE FROM new_table WHERE Clg_ID = ?`;
        const [result] = await db.query(deleteQuery, [collegeId]);

        if (result.affectedRows > 0) {
            res.json({ message: "✅ Data deleted successfully" });
        } else {
            res.status(400).json({ message: "College not found or already deleted" });
        }
    } catch (err) {
        console.error("❌ MySQL Delete Error:", err);
        res.status(500).json({ error: "Database delete failed" });
    }
};

export const uploadFile = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        const filePath = req.file.path;
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        if (sheetData.length === 0) return res.status(400).json({ error: "Empty file uploaded" });

        const insertQuery = `
            INSERT INTO new_table (File, College_Name, State, District, Course, Anual_fees, Placement_fees, Ranking, Address, Phone)
            VALUES ?`;

        const values = sheetData.map((row) => [
            row["File"] || null,
            row["College Name"] || null,
            row["State"] || null,
            row["District"] || null,
            row["Course"] || null,
            row["Anual_fees"] || null,
            row["Placement_fees"] || null,
            row["Ranking"] || null,
            row["Address"] || null,
            row["Phone"] || null
        ]);

        const [result] = await db.query(insertQuery, [values]);
        res.json({ message: `✅ Uploaded ${result.affectedRows} records successfully` });
    } catch (err) {
        console.error("❌ MySQL Insert Error:", err);
        res.status(500).json({ error: "Database insert failed" });
    }
};

export const scrapeData = async (req, res) => {
    try {
        const { state, city, stream } = req.body;

        if (!state || !city) {
            return res.status(400).json({ error: "State and City are required." });
        }

        const isFullSearch = state && city && stream;
        const scriptToRun = isFullSearch ? "./Scripts/clgd_scrap.js" : "./Scripts/scrap.js";
        const scriptArgs = isFullSearch ? [state, city, stream] : [state, city];
        const scriptPath = path.resolve(__dirname, scriptToRun);

        console.log(`📡 Running script: ${scriptPath} with args: ${scriptArgs.join(", ")}`);

        const jsProcess = spawn("node", [scriptPath, ...scriptArgs]);

        let dataBuffer = "";
        let generatedFileName = null;

        jsProcess.stdout.on("data", (data) => {
            const output = data.toString();
            console.log(`📝 Output: ${output}`);
            dataBuffer += output;

            const match = output.match(/Saving data to:\s*(.*\.xlsx)/);
            if (match && match[1]) {
                generatedFileName = match[1].trim();
                console.log(`✅ File detected: ${generatedFileName}`);
            }
        });

        jsProcess.stderr.on("data", (data) => {
            console.error(`❌ Error: ${data.toString()}`);
        });

        jsProcess.on("close", (code) => {
            console.log(`✅ Script exited with code ${code}`);
            res.status(200).json({
                message: "Scraping completed",
                data: dataBuffer.trim(),
                fileName: generatedFileName
            });
        });

        jsProcess.on("error", (err) => {
            console.error(`❌ Failed to run script: ${err.message}`);
            res.status(500).json({ error: "Failed to execute script" });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const addCollege = async (req, res) => {
    try {
        const data = req.body;

        const insertQuery = `
            INSERT INTO new_table (
                College_Name, State, District, Course, Anual_fees, Placement_fees, Ranking, Address, Phone
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
            SELECT * FROM new_table WHERE Clg_ID = LAST_INSERT_ID();
        `;

        const values = [
            data.College_Name || null,
            data.State || null,
            data.District || null,
            data.Course || null,
            data.Anual_fees || null,
            data.Placement_fees || null,
            data.Ranking || null,
            data.Address || null,
            data.Phone || null
        ];

        const [result] = await db.query(insertQuery, values);
        const insertedCollege = result[1][0];
        res.status(200).json(insertedCollege);
    } catch (err) {
        console.error('❌ Insert Error:', err);
        res.status(500).json({ error: 'Insert failed' });
    }
};
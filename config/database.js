import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 25060,
    ssl: {
        ca: process.env.CA_CERT,
        rejectUnauthorized: false
    },
    waitForConnections: true,
    connectionLimit: 50,
    connectTimeout: 60000,
    queueLimit: 0,
    multipleStatements: true
});

(async () => {
    try {
        const connection = await db.getConnection();
        console.log('Connected to MySQL');
        connection.release();
    } catch (err) {
        console.error('MySQL connection failed:', err.message);
    }
})();

export default db;

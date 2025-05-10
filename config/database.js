import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        ca: process.env.CA_CERT
    },
    waitForConnections: true,
    queueLimit: 0,
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
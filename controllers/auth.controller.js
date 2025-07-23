import db from '../config/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const SECRET = process.env.JWT_SECRET || 'secretkey';

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
        },
        SECRET,
        { expiresIn: '7d' }
    );
};

export const signUp = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const [existing] = await db.execute(
            'SELECT * FROM users WHERE username = ? OR email = ? LIMIT 1',
            [username, email]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                success: false,
                error: 'Username or email already in use',
            });
        }

        const hashed = await bcrypt.hash(password, 10);

        const [result] = await db.execute(
            'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            [username, email, hashed]
        );

        const [newUserData] = await db.execute(
            'SELECT id, username, email, role FROM users WHERE id = ? LIMIT 1',
            [result.insertId]
        );

        const user = newUserData[0];
        const token = generateToken(user);

        res.status(201).json({ success: true, user, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Something went wrong' });
    }
};

export const login = async (req, res) => {
    const { identifier, password } = req.body;

    try {
        const [rows] = await db.execute(
            'SELECT * FROM users WHERE username = ? OR email = ? LIMIT 1',
            [identifier, identifier]
        );

        const user = rows[0];

        if (!user) {
            return res
                .status(401)
                .json({ success: false, error: 'Invalid credentials' });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res
                .status(401)
                .json({ success: false, error: 'Invalid credentials' });
        }

        const { id, username, email, role } = user;
        const token = generateToken({ id, username, email, role });

        res.json({
            success: true,
            user: { id, username, email, role },
            token,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Something went wrong' });
    }
};

import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import multer from 'multer';
import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';
import authRoutes from './routes/auth.routes.js';
import candidateRoutes from './routes/candidate.routes.js';

dotenv.config();

const app = express();
const upload = multer({ dest: 'uploads/resumes/' });
const allowedOrigins = ['http://localhost:5173', 'https://hunt360.vercel.app', 'https://hunt360.onrender.com'];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.options('*', cors({
    origin: allowedOrigins,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET || 'ashlokchaudhary',
    resave: false,
    saveUninitialized: false
}));
app.use(upload.any());
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(YAML.load('./docs/endpoints.yaml')));
app.use('/api/auth', authRoutes);
app.use('/api/candidate', candidateRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

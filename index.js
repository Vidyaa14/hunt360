import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import multer from 'multer';
import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';
import authRoutes from './routes/auth.routes.js';
import corporateRoutes from './routes/corporate.routes.js';

dotenv.config();

const app = express();
const upload = multer({ dest: 'uploads/resumes/' });
const allowedOrigins = ['http://localhost:5173', 'https://hunt360.vercel.app', 'https://hunt360.onrender.com', 'http://localhost:3000'];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, origin);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
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
app.use('/api/corporate', corporateRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

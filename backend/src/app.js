import express, { json } from 'express';
import cors from "cors";
import { globalLimiter, authLimiter } from './middleware/rateLimit.js';
import codeRouter from './routes/codeRoutes.js';
import participantRouter from './routes/participantRoutes.js';
import problemRouter from './routes/problemRoutes.js';
import roundRouter from './routes/roundRoutes.js';
import leaderbRouter from './routes/leaderboardRoutes.js';
import { protect } from './middleware/auth.js';
import submissionRrouter from './routes/submissionRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import antiCheatRouter from './routes/antiCheatRoutes.js';

const app = express();

// Middleware
app.use(
    cors({
        origin: ["http://localhost:5173", "https://mind-compile-siescoms.onrender.com"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);
app.use(json());

// Apply Global Rate Limiting
app.use(globalLimiter);

// Routes
app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use("/api/code", protect, codeRouter);
app.use("/api/user", authLimiter, participantRouter);
app.use("/api/problem", protect, problemRouter);
app.use("/api/rounds", protect, roundRouter);
app.use("/api/leaderboard", protect, leaderbRouter);
app.use("/api/leader-board", protect, leaderbRouter);
app.use("/api/submission", protect, submissionRrouter);
app.use("/api/admin", adminRouter);
app.use("/api/anticheat", antiCheatRouter);

export default app;
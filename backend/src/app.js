import express, { json } from 'express';
import codeRouter from './routes/codeRoutes.js';
import cors from "cors";
import participantRouter from './routes/participantRoutes.js';
import problemRouter from './routes/problemRoutes.js';
import roundRouter from './routes/roundRoutes.js';
import leaderbRouter from './routes/leaderboardRoutes.js';
import { protect } from './middleware/auth.js';
import submissionRrouter from './routes/submissionRoutes.js';
import adminRouter from './routes/adminRoutes.js';
const app = express();

// Middleware
app.use(
    cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);
app.use(json());
// Routes
app.get('/', (req, res) => {
    res.send('API is running...');
});
app.use("/api/code", protect, codeRouter)// app.use("/api/code", protect, codeRouter)
app.use("/api/user", participantRouter)
app.use("/api/problem", protect, problemRouter) // app.use("/api/problem", protect, problemRouter)
app.use("/api/rounds", protect, roundRouter); // app.use("/api/rounds", protect, roundRouter);
app.use("/api/leader-board", protect, leaderbRouter)
app.use("/api/submission", protect, submissionRrouter)
app.use("/api/admin", adminRouter);
export default app;
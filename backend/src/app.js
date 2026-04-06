import express, { json } from 'express';
import codeRouter from './routes/codeRoutes.js';
import cors from "cors";
import participantRouter from './routes/participantRoutes.js';
import problemRouter from './routes/problemRoutes.js';
import roundRouter from './routes/roundRoutes.js';
import leaderbRouter from './routes/leaderboardRoutes.js';
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
app.use("/api/code", codeRouter)
app.use("/api/user", participantRouter)
app.use("/api/problem", problemRouter)
app.use("/api/rounds", roundRouter);
app.use("/api/leader-board", leaderbRouter)

export default app;
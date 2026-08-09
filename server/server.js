import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import router from "./routes/auth.js";
import sessionRouter from "./routes/sessionRoutes.js";
import taskRouter from "./routes/taskRoutes.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:4173",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", router);
app.use("/api/sessions", sessionRouter);
app.use("/api/tasks", taskRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});

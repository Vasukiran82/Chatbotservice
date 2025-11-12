import express from "express";
import chatRoutes from "./routes/chatRoutes";

const app = express();
app.use(express.json());

// Routes
app.use("/api/chat", chatRoutes);

export default app;

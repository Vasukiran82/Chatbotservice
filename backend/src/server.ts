import express from "express";
import cors from "cors";
import ecommerceRoutes from "./routes/ecommerceRoutes";
import chatbotRoutes from "./routes/chatRoutes";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/ecommerce", ecommerceRoutes);
app.use("/api", chatbotRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

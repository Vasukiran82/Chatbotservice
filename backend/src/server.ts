import express from "express";
import cors from "cors";
import ecommerceRoutes from "./routes/ecommerceRoutes";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/ecommerce", ecommerceRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));

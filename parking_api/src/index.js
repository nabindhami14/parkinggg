import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";

import path from "node:path";
import { fileURLToPath } from "node:url";

import connectToDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import spotsRoutes from "./routes/parkingSpotRoutes.js";
import reservationsRoutes from "./routes/reservationsRoute.js";
import userRoutes from "./routes/userRoutes.js";
import vehiclesRoutes from "./routes/vehicleRoutes.js";

import parkingRoutes from "./routes/parkingRoute.js";
import paymentRoutes from "./routes/paymentRoute.js";

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const corsOptions = {
  origin: [process.env.UI_ORIGIN, process.env.ADMIN_ORIGIN],
};

app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());

app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/spots", spotsRoutes);
app.use("/payments", paymentRoutes);
app.use("/parkings", parkingRoutes);
app.use("/vehicles", vehiclesRoutes);
app.use("/reservations", reservationsRoutes);

async function startServer() {
  try {
    await connectToDB();
    app.listen(process.env.PORT, () => {
      console.log(`http://localhost:${process.env.PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}

startServer();

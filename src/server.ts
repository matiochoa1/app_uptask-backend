import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import projectRoutes from "./routes/projectRoutes";

dotenv.config(); // cargar las variables de entorno

connectDB();

const app = express();

app.use(express.json()); // de esta manera podemos enviar datos en formato json

// Routes - Registramos las rutas
app.use("/api/projects", projectRoutes);

export default app;

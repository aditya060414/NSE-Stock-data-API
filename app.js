import express from "express";
import cors from "cors";

import stockRoutes from "./src/routes/stockRoutes.js";

const app = express();

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));

app.use(
  cors({
    origin: "*",
  }),
);
app.use(express.json());

app.use("/api", stockRoutes);

export default app;

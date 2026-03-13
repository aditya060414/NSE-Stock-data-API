import express from "express";
import cors from "cors";

import stockRoutes from "./src/routes/stockRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/", stockRoutes);

export default app;
// imports express from node module to build web application
import express from "express";
// imports cors from node module to enable cross origin resource sharing
import cors from "cors";
// imports stockRoutes from routes directory
import stockRoutes from "./src/routes/stockRoutes.js";

// creates an instance of express application
const app = express();

// imports path from node module to work with file paths
import path from "path";
// imports fileURLToPath from node module to work with file paths
import { fileURLToPath } from "url";

// gets the file path of the current file
const __filename = fileURLToPath(import.meta.url);
// gets the directory path of the current file
const __dirname = path.dirname(__filename);

// serves static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// enables cross origin resource sharing
app.use(
  cors({
    origin: "*",  //allows rosource sharing from all the sites
    methods:["GET"],
  }),
);
// enables express to parse JSON data
app.use(express.json());

// registers the stockRoutes with the express application
app.use("/api", stockRoutes);

// exports the express application
export default app;

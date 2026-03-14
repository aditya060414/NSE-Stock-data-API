# NSE STOCK DATA API - Project Structure

```text
project-root/
├── public/
│   ├── candlestick.html
│   ├── chart.html
│   └── index.html
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── stockController.js
│   ├── jobs/
│   │   └── nseSyncJob.js
│   ├── models/
│   │   └── Stock.js
│   ├── routes/
│   │   └── stockRoute.js
│   ├── services/
│   │   └── nseService.js
│   └── utils/
│       └── dataUtils.js
├── app.js
├── server.js
├── .env
├── .gitignore
├── package.json
└── README.md
```


# Project File Structure and Functional Explanation

## app.js
- This file initializes the Express application, configures global middleware, and sets up top-level routing.

### Execution Flow
```text
Client Request
      ↓
Middleware (CORS, express.json)
      ↓
Static Files Server (public/)
      ↓
API Routes Mounting (/api)
```

### express
- **Installation**: `npm i express` - npm installs the express package.
- **Import**: `import express from "express"` - imports the express package.

- **Why express()?**
  It is a framework that helps to build web applications and APIs.

- **Instance Creation**: `const app = express()` - It creates an instance of express application.

- **Basic Routing**:
  Basic routing functions that can be performed using `express()` are:
  - `app.get()` - handle get request i.e retrieve data from server
  - `app.post()` - handle post request i.e send data to server
  - `app.put()` - handle put request i.e update data in server
  - `app.delete()` - handle delete request i.e delete data from server
  - `app.all()` - handle all request // is rarely used
  - `app.use()` - handle all request // is used to register middleware


### CORS - cross origin resource sharing
- **Installation**: `npm i cors` - npm installs the cors package
- **Import**: `import cors from "cors"` - imports the cors package

- **Why cors()?**
  It is a middleware that helps to enable cross origin resource sharing.

- **Usage**:
  ```javascript
  app.use(cors({
      origin: "*", // allows all origins
      // or
      origin: "http or https://domain.com", // allows only specific origin
      // or
      origin: ["http or https://domain1.com", "http or https://domain2.com"], // allows multiple origins
  }))
  ```

- **access-control-allow-origin**
  This is a response header that is sent from the server to the client. It is used to specify which origins are allowed to access the server's resources.

- **What is an origin?**
  An origin is defined by three components:
  1. protocol : http or https
  2. domain : www.google.com
  3. port : 80 or 443

- **Implementation Details**
  CORS are generally used when frontend and backend are deployed on two different ports or origin. To support resource sharing we use CORS.
  We can also specify what operations are allowed on the server using CORS. For example:
  - `methods: ["GET", "POST", "PUT", "DELETE"]` // allows only these operations
  - `allowedHeaders: ["Content-Type", "Authorization"]` // allows only these headers
  - `credentials: true` // allows cookies to be sent


### path
- **Imports**:
  - `import path from "path"` - imports the path module
  - `import { fileURLToPath } from "url"` - imports the fileURLToPath function from the url module

- **Why path?**
  It is a module that helps to work with file paths.

- **Helpers**:
  - `const __filename = fileURLToPath(import.meta.url)` - It gets the file path of the current file, for example: `C:\coding\Web Development\FULL STACK\Project\MERN\MarketEx\stock\app.js`
  - `const __dirname = path.dirname(__filename)` - It gets the directory path of the current file, for example: `C:\coding\Web Development\FULL STACK\Project\MERN\MarketEx\stock`

- **Static Files**:
  - `app.use(express.static(path.join(__dirname, "public")))` - It serves static files from the public directory.
  - `express.static()` - is a middleware that is used to serve static files such as : HTML, CSS, JS, Images, etc.
  - `path.join()` - is a function that is used to join file paths.


### routes
- **Import**: `import stockRoute from "./routes/stockRoute"` - imports the stockRoute from the routes directory.
- **Usage**: `app.use("/api", stockRoute)` - registers the stockRoute with the express application.


### express.json()
- **Usage**: `app.use(express.json())` - It enables express to parse JSON data.

- **What is json data?**
  - **JSON (JavaScript Object Notation)** is a lightweight data-interchange format that is easy for humans to read and write and easy for machines to parse and generate.
  - It is based on a subset of the JavaScript Programming Language.
  - JSON is a text format that is completely language independent but uses conventions that are familiar to programmers of the c-family of languages, including C, C++, C#, Java, JavaScript, Perl, Python, and many others.
  
  - **JSON is built on two structures**:
    1. A collection of name/value pairs
    2. An ordered list of values

  - In JavaScript, these take the form of an **object**, the braces of which contain zero or more name/value pairs. A name is a string and must be enclosed in double quotes. A value is a string, a number, an object, an array, true, false, or null.

  - **Example Object**:
    ```json
    {
        "name": "John",
        "age": 30,
        "city": "New York"
    }
    ```

  - In JavaScript, an **array** is an ordered list of values. An array is enclosed in square brackets.
  - **Example Array**:
    ```json
    [
        "John",
        30,
        "New York"
    ]
    ```

  - JSON is widely used in web applications to transfer data between the client and the server.


### export default app
- `export default app` - exports the express application.


---


## server.js
- This is the entry point of the application. It handles environment configuration, database connection, and starts the HTTP listener.

### Startup Execution Flow
```text
Load .env Configuration
      ↓
Connect to MongoDB (db.js)
      ↓
Initialize Background Jobs (Sync Jobs)
      ↓
Start HTTP Server Listener
```

### .env
- **Definition**: `.env` is a file that is used to store environment variables.

- **Usage**: `import "dotenv/config"` - This line is used to automatically load environment variables from a .env file into `process.env` when a Node.js application starts.
- **What it does?** : It loads the environment variables from the .env file into the `process.env` object.

- **What is .env?**
  `dotenv` is a Node.js package used to store sensitive configuration values in environment variables instead of hardcoding them in the source code.
  - **Example of sensitive data**:
    1. Database credentials
    2. API keys
    3. Passwords
    4. Security tokens
    5. Any other sensitive information
  
- **Traditional methods to use dotenv**:
  ```javascript
  import dotenv from "dotenv";
  dotenv.config(); 
  ```

- **Modern methods to use dotenv**:
  `import "dotenv/config";`
  - **Why it is used at the top of the file?** : It is used at the top of the file because it needs to be loaded before any other code in the file.
  - **Why it is necessary to use .env?** : It is necessary to use .env because it helps to keep the sensitive data secure and also makes it easier to manage the environment variables.

- **What is process.env?**
  `process.env` is an object that contains all the environment variables.


### other imports
- `import app from "./app.js"` - imports the express application
- `import connectDB from "./src/config/db.js"` - imports the database connection function
- `import { updateMissingDays } from "./src/services/nseService.js"` - imports the function to update missing days
- `import startNSESyncJob from "./src/jobs/nseSyncJob.js"` - imports the function to start the NSE sync job


### PORT
- `const PORT = process.env.PORT || 3001` - sets the port number to 3001 or the value of the PORT environment variable.


### startServer
- It is an **async** function that is used to start the server.
- It is an async function because it needs to wait for the database connection to be established before starting the server.
        
- **What is async?**
  async/await is a modern JavaScript feature that makes asynchronous code easier to write and read. It is built on top of Promises and provides a more synchronous-looking syntax for handling asynchronous operations.
  - **async function**: It is a function that is declared with the `async` keyword. It returns a Promise.
  - **await**: It is used to wait for a Promise to resolve. It can only be used inside an async function.

- **Node.js Thread Pool**
  - The Node.js thread pool is a collection of worker threads used to execute certain asynchronous operations in the background. It is implemented internally by **libuv**, the library that powers Node.js’s event-driven architecture.
  - Node.js runs JavaScript code on a single main thread, which means the main thread can execute only one task at a time. If long or blocking operations were executed on this main thread, the application would become slow and unable to handle other incoming requests.
  - To avoid this problem, Node.js uses a thread pool to delegate time-consuming operations to background worker threads.
  - The thread pool allows Node.js to perform multiple operations concurrently without blocking the main thread.

- **Default Thread Pool Size**
  By default, Node.js provides **4 worker threads** in the thread pool. These threads can execute tasks in parallel while the main thread continues processing other events.
  ```text
  Thread Pool
  │
  ├── Thread 1
  ├── Thread 2
  ├── Thread 3
  └── Thread 4
  ```
  Each thread can handle one background task at a time.

- **Promise**
  It is an object that represents the eventual completion or failure of an asynchronous operation.
  - **State of a promise**: It can be in one of the following states:
    1. **Pending**: The operation is not yet completed.
    2. **Fulfilled**: The operation is completed successfully.
    3. **Rejected**: The operation is failed.
  
  - Promises are handled using `.then()`, `.catch()` and `.finally()` methods.
    - `.then()`: It is used to handle the fulfilled state of a promise.
    - `.catch()`: It is used to handle the rejected state of a promise.
    - `.finally()`: It is used to handle the finally state of a promise.
        
  - **Example**:
    ```javascript
    function fetchData() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve("Data fetched successfully");
            }, 2000);
            //1000ms = 1s
        });
    }
    fetchData().then((data) => {
        console.log(data);
    }).catch((error) => {
        console.log(error);
    }).finally(() => {
        console.log("Finally block");
    });
    ```

- **Promise with async/await**:
  ```javascript
  async function fetchData() {
      const data = await new Promise((resolve, reject) => {
          setTimeout(() => {
              resolve("Data fetched successfully");
          }, 2000);
      });
      console.log(data);
  }
  fetchData();
  ```
  - **How await works?** : It pauses the execution of the async function until the promise is resolved.

- **Database Connection**:
  - `await connectDB()`: It is used to wait for the database connection to be established before starting the server.

- **Starting the Listener**:
  ```javascript
  app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
  });
  ```
  - It is used to start the server and listen for incoming requests on the specified port.
- **Function call**:
  - `startServer()`: It is used to start the server.
  - `updateMissingDays()`: It is used to update missing days.
  - `startNSESyncJob()`: It is used to start the NSE sync job.

### Server Startup Sequence
When `startServer()` is called, the following execution flow occurs:
1.  **Database Connection**: It first calls `connectDB()` to connect to the database.
2.  **Listener Initialization**: Then it starts the server and listens for incoming requests on the specified `PORT`.
3.  **Data Synchronization**: Once the server is running, it calls `updateMissingDays()` to sync any missing stock data.
4.  **Scheduled Jobs**: Finally, it calls `startNSESyncJob()` to begin the recurring NSE synchronization tasks.


---


## src/config/db.js
- This file contains the logic to establish and manage the connection to the MongoDB database using Mongoose.

### Connection Execution Flow
```text
Check MONGO_URI Env Variable
      ↓
Mongoose Connect Attempt
      ↓
Log Success / Handle Connection Error
```

### Mongoose
- **Import**: `import mongoose from "mongoose";` - imports the mongoose library
- **Purpose**: It is an **ODM (Object Data Modeling)** library for MongoDB and Node.js.
- **Key Features**:
  - It provides a way to interact with MongoDB using JavaScript objects.
  - It is used to define schemas and models for MongoDB collections.
  - It is used to perform CRUD operations on MongoDB collections.
  - It is used to perform validation on MongoDB collections.
  - It is used to perform aggregation on MongoDB collections.
  - It is used to perform transactions on MongoDB collections.
  - It is used to perform geospatial queries on MongoDB collections.
  - It is used to perform full-text search on MongoDB collections.
  - It is used to perform change streams on MongoDB collections.
  - It is used to perform gridfs on MongoDB collections.

- **Database Connection Logic**:
  - `if (!process.env.MONGO_URI)`: It checks if the `MONGO_URI` environment variable is set.
  - `throw new Error("MONGO_URI not found in environment variables");`: It throws an error if the `MONGO_URI` environment variable is missing.
  - `await mongoose.connect(process.env.MONGO_URI);`: It is used to establish the connection to the MongoDB database.
  - `process.env.MONGO_URI`: It is the MongoDB connection string retrieved from the environment variables.
  - `console.log("MongoDB connected");`: It logs a success message to the console once the connection is established.


---


## src/models/stock.js
- This file defines the **Mongoose Schema** and **Model** for the stock collection.

### Model Creation Flow
```text
Define Schema Fields and Types
      ↓
Apply Unique Indexes (symbol, tradeDate)
      ↓
Compile into Mongoose Model
      ↓
Export Model for Controller Use
```

- **Import**: `import mongoose from "mongoose";` - imports the Mongoose library.
- **Define Schema**: `const stockSchema = new mongoose.Schema({key:value});` - creates the blueprint for the stock collection.
- **Export Model**: `export default mongoose.model("Stock", stockSchema);` - compiles the schema into a model and exports it.

### Schema Details
- `new mongoose.Schema`: A constructor used to create a new schema for the stock collection.
- **Key Definitions**:
  - **Key**: `key` - the name of the field in the database.
  - **Value**: `value` - the type of the key (e.g., `String`, `Number`, `Boolean`, `Array`, `Object`) or schema options.
- **Indexing**: 
  - `stockSchema.index({ symbol: 1, tradeDate: 1 }, { unique: true });`: This ensures data integrity by preventing duplicate entries for the same stock symbol on the same trade date.
- **Model Compilation**:
  - `export default mongoose.model("Stock", stockSchema);`: This exports the compiled model where "Stock" represents the collection name and `stockSchema` provides the structure.


---


## src/routes/stockRoutes.js
- This file defines the API endpoints for interacting with the stock collection.

### Request Routing Flow
```text
Receive HTTP Request
      ↓
Match URL Pattern (/latest, /history)
      ↓
Call Assigned Controller Function
```

- **Imports**:
  - `import express from "express";` - imports the Express library.
  - `import { getLatestStocks, getStockHistory } from "../controllers/stockController.js";` - imports the controller logic for stock operations.

- **Router Instance**:
  - `const router = express.Router();`: Creates a new router object to manage sub-routes.

- **API Endpoints**:
  - `router.get("/latest", getLatestStocks);`: Defines a **GET** route to retrieve the latest stock data.
  - `router.get("/history", getStockHistory);`: Defines a **GET** route to retrieve historical stock data records.

### Purpose of Routes
Why do we need routes?
- **Define Endpoints**: Routes are used to define the API endpoints for the application.
- **Handle Requests**: They handle incoming requests from the client.
- **Send Responses**: They ensure the correct response is sent back to the client.

### Request Execution Flow
```text
Client Request
      ↓
Express Server
      ↓
Stock Routes (router)
      ↓
Controller Functions
      ↓
Database Query (MongoDB)
      ↓
Response sent to Client
```


---


## src/controllers/stockController.js
- This file contains the controller logic that processes incoming requests and interacts with the `Stock` model to retrieve data.

### Request Processing Flow
```text
Receive Request Parameters
      ↓
Mongoose Database Query (.find, .sort)
      ↓
Process Data results (.lean() optimization)
      ↓
Send JSON Response to Client
```

- **Imports**:
  - `import Stock from "../models/Stock.js";`: Imports the Mongoose model for stock data.

- **Controller Functions**:
  - `async function getLatestStocks(req, res)`: Retrieves all stock records from the most recent trading date.
  - `async function getStockHistory(req, res)`: Retrieves the complete historical records for a specific stock symbol.

### getLatestStocks Function
- `const latest = await Stock.findOne().sort({ tradeDate: -1 }).lean();`: Finds the single most recent record to determine the latest `tradeDate`.
- `if (!latest) return res.json([]);`: Returns an empty array if no stock data exists in the database.
- `const data = await Stock.find({ tradeDate: latest.tradeDate }).lean();`: Retrieves all stocks that match the identified latest date.
- `res.json(data);`: Sends the gathered stock data back to the client as a JSON response.

### getStockHistory Function
- `const { symbol } = req.query;`: Extracts the `symbol` from the request's query parameters (e.g., `?symbol=RELIANCE`).
- `if (!symbol) return res.status(400).json({ error: "symbol query required" });`: Validates that a symbol was provided, returning a **400 Bad Request** error if missing.
- `const data = await Stock.find({ symbol }).sort({ tradeDate: 1 }).lean();`: Retrieves all records for that symbol, sorted chronologically.
- `res.json(data);`: Sends the historical data back to the client.

### Mongoose Query Helpers
- `.find()`: Used to retrieve multiple documents that match specific criteria from a collection.
- `.sort()`: Used to order the resulting documents based on specified fields.
- `.lean()`: Optimized for performance; it returns plain JavaScript objects instead of heavy Mongoose documents (useful for read-only operations).


---


## src/services/nseService.js
- This is one of the most critical sections, as it handles the core logic for fetching and processing stock data.

### Sync Execution Flow
```text
Scheduler / Server Start
        ↓
updateMissingDays()
        ↓
getLatestTradeDate()
        ↓
fetchAndStoreForDate()
        ↓
Download NSE Bhavcopy
        ↓
Convert CSV → JSON
        ↓
Filter Equity Stocks
        ↓
Store in MongoDB
```

- **Imports**:
  - `import axios from "axios";`: **Axios** is used to make HTTP requests to the NSE server to download the Bhavcopy file.
  - `import csv from "csvtojson";`: **csvtojson** converts NSE's CSV data into JSON objects for easier processing in JavaScript.
  - `import Stock from "../models/Stock.js";`: The **Stock model** used to interact with the MongoDB database.
  - `import { isoDate, nseParts } from "../utils/dateUtils.js";`: Utility functions for date formatting and parsing.

- **Function Definitions**:
  - `async function fetchAndStoreForDate(date)`: Downloads stock data for a specific date and stores it in the database.
  - `async function getLatestTradeDate()`: Retrieves the most recent trading date currently stored in the database.
  - `async function updateMissingDays()`: Identifies missing trading days and triggers `fetchAndStoreForDate()` for each one.

### fetchAndStoreForDate(date)
- `const tradeDate = isoDate(date)`: Converts the input date into **ISO format** (`YYYY-MM-DD`).
- `const exists = await Stock.exists({ tradeDate });`: Checks if data for this specific date already exists to avoid duplicates.
- `if (exists)`: Skips the process if the data is already present.
- `const { dd, mm, yyyy } = nseParts(date);`: Extracts the day, month, and year for the NSE URL.
- **NSE URL**: The `dd`, `mm`, and `yyyy` are injected into the URL to target the correct Bhavcopy file.
- `axios.get(url, ...)`: Sends the request to the NSE server to download the CSV data.
- `csv().fromString(res.data)`: Parses the downloaded CSV string into a JSON array of stocks.
- `if (!stocks.length) return`: Exits if no records were found in the file.
- `await Stock.bulkWrite(...)`: Efficiently inserts or updates multiple documents in a single database operation.

### getLatestTradeDate()
- `const latest = await Stock.findOne().sort({ tradeDate: -1 }).lean();`: Queries the database for the single most recent record, sorted by date in descending order.

### updateMissingDays()
- `console.log("Checking missing trading days...");`: Provides console feedback on the sync status.
- `const latest = await getLatestTradeDate();`: Determines the starting point for the sync.
- `let startDate`: A variable to track the date currently being checked.
- `if (!latest)`: If the database is empty, it defaults to checking the last **365 days**.
- `startDate = new Date();` -> `startDate.setDate(startDate.getDate() - 365);`
- `const today = new Date();`: Sets the upper bound for the sync loop.
- `while (startDate <= today)`: Iterates through every calendar day from the start date to today.
- `try { await fetchAndStoreForDate(startDate); } catch (err) {}`: Attempts to fetch data for each day, catching errors (e.g., weekends or holidays where no data exists).
- `startDate.setDate(startDate.getDate() + 1);`: Increments the loop by one day.

## src/utils/dateUtils.js
- This file provides helper functions for consistent date formatting across the application.

- **Functions**:
  - `isoDate(d)`: Converts a `Date` object into an **ISO 8601** formatted string (`YYYY-MM-DD`). This is used for database queries and consistency.
  - `nseParts(d)`: Breaks down a `Date` object into its individual components:
    - `dd`: The day of the month (padded to 2 digits).
    - `mm`: The month (1-indexed, padded to 2 digits).
    - `yyyy`: The full 4-digit year.
    - *Note*: These parts are essential for constructing the dynamic NSE URL.


---


## Public (Frontend)
- The `public/` directory contains the client-side files for the application dashboard and data visualizations.

### Frontend Data Flow
```text
Browser URL / User Input
      ↓
Fetch API Call (/api/stocks)
      ↓
JSON Data Processing
      ↓
DOM Update / Chart Rendering
```

### index.html
- The main **Dashboard** of the application. It displays the latest stock data in a user-friendly, paginated table.
- **Key Features**:
  - **Live Search**: Filter the stock list by symbol in real-time.
  - **Sorting**: Order stocks alphabetically (A–Z) or by their closing price (Descending).
  - **Pagination**: Efficiently browse through the stock list (25 records per page).
  - **Responsive Design**: Clean UI that works on both desktop and mobile.

### chart.html
- A **Line Chart** visualization tool for analyzing historical stock price trends.
- **Key Features**:
  - **Symbol Lookup**: Load historical data for any specific stock symbol.
  - **Range Selection**: Quickly view data for 1 Month, 6 Months, 1 Year, or the entire history.
  - **Lightweight Charts**: Uses the `lightweight-charts` library for high-performance, interactive rendering.

### candlestick.html
- A **Candlestick Chart** for more detailed stock analysis, showing the Open, High, Low, and Close (OHLC) prices.
- **Key Features**:
  - **OHLC Visualization**: Provides a better visual representation of price volatility.
  - **Interactive Scaling**: Smooth zooming and panning across historical timelines.
  - **Consistency**: Uses the same API endpoint and range controls as the line chart for a unified user experience.

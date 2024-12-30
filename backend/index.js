import express from "express"
import dotenv from "dotenv"

import connectDB from "./config/Db.connection.js";

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Define a simple route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Start the server
app.listen(port, () => {
    connectDB();
    console.log(`Server is running on port ${port}`);
});
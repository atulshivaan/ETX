import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import morgan from "morgan";

import connectDB from "./config/Db.connection.js";
import userRouter from "./routes/user.route.js";

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());
app.use(cors())
app.use(morgan("dev"))



//routes
app.use("/api/auth/",userRouter)



// Define a simple route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Start the server
app.listen(port, () => {
    connectDB();
    console.log(`Server is running on port ${port}`);
});
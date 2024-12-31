import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import morgan from "morgan";
import path from "path"

import connectDB from "./config/Db.connection.js";
import userRouter from "./routes/user.route.js";
import transactionRouter from "./routes/transaction.routes.js";
import exp from "constants";

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }))
app.use(morgan("dev"))



//routes
app.use("/api/auth/user", userRouter);
app.use("/api/auth/transaction", transactionRouter);

//statci file
app.use(express.static(path.join(__dirname,"../frontend/dist")))
app.get("*",function(req,res){
res.sendFile(path.join(__dirname,"../frontend/dist/index.html"));
})


// Define a simple route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Start the server
app.listen(port, () => {
    connectDB();
    console.log(`Server is running on port ${port}`);
});
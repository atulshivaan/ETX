import express from "express";
import { addTransaction, getTransaction } from "../controllers/transaction.controller.js";

const transactionRouter = express.Router();

// Route to get all transactions
transactionRouter.post("/gettransaction", getTransaction);

// Route to add a new transaction
transactionRouter.post("/addtransaction", addTransaction);

export default transactionRouter;

import express from "express";
import { addTransaction, deleteTransaction, editTransaction, getTransaction } from "../controllers/transaction.controller.js";

const transactionRouter = express.Router();

// Route to get all transactions
transactionRouter.post("/gettransaction", getTransaction);

// Route to add a new transaction
transactionRouter.post("/addtransaction", addTransaction);

//edit
transactionRouter.patch("/editTransaction",editTransaction);
transactionRouter.delete("/deleteTransaction",deleteTransaction)

export default transactionRouter;

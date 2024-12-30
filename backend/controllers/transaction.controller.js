import moment from "moment"
import Transaction from "../models/transaction.model.js";

// Controller to get all transactions
export const getTransaction = async (req, res) => {
  const { userId } = req.body;
  const {frequency ,selectedDate ,type}=req.body;

  console.log("Request body:", req.body); // Debugging request

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User ID is required.",
    });
  }

  try {
    const transactions = await Transaction.find({
     
      ...(frequency !=="custom" ? {
        date:{
          $gt:moment().subtract(Number(frequency),"d").toDate(),
        },
      }:{
        date:{
          $gt:selectedDate[0],
          $lte:selectedDate[1]
        },
      }),
      userId ,
    ...(type !== "all" && {type})});
    console.log("Transactions fetched:", transactions); // Debugging response
    return res.status(200).json({
      success: true,
      transactions,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error); // Debugging error
    return res.status(500).json({
      success: false,
      message: "Server error.",
      error: error.message,
    });
  }
};

/// Controller to add a new transaction
export const addTransaction = async (req, res) => {
  try {
    // Extract data from the request body
    const { amount, type, category, reference, description, date, userId } = req.body;

    // Validate the type of transaction
    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({ success: false, message: "Invalid type." });
    }

    // Ensure that userId is provided
    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required." });
    }

    // Create a new transaction document (MongoDB will automatically generate the _id)
    const newTransaction = new Transaction({ amount, type, category, reference, description, date, userId });

    // Save the transaction to the database
    await newTransaction.save();

    // Send the response back with the new transaction data (including the _id)
    res.status(201).json({
      success: true,
      message: "Transaction added successfully",
      transaction: newTransaction,  // newTransaction contains the auto-generated _id
    });
  } catch (error) {
    console.error("Error adding transaction: ", error); // Log the error for debugging
    res.status(500).json({ success: false, message: error.message });
  }
};

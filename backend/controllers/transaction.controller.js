import moment from "moment"
import Transaction from "../models/transaction.model.js";

export const getTransaction = async (req, res) => {
  const { userId, frequency, selectedDate, type } = req.body;

  console.log("Request body:", req.body); // Debugging request

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User ID is required.",
    });
  }

  try {
    // Create a base query
    const query = { userId };

    // Apply date filter
    if (frequency !== "custom") {
      query.date = {
        $gt: moment().subtract(Number(frequency), "days").toDate(),
      };
    } else if (selectedDate?.length === 2) {
      query.date = {
        $gte: new Date(selectedDate[0]),
        $lte: new Date(selectedDate[1]),
      };
    }

    // Apply type filter
    if (type && type !== "all") {
      query.type = type;
    }

    console.log("Query used for fetching transactions:", query); // Debugging query

    // Fetch transactions
    const transactions = await Transaction.find(query);

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

export const editTransaction = async (req, res) => {
  console.log("Edit transaction request received:", req.body);
  try {
    await Transaction.findOneAndUpdate(
      { _id: req.body.transactionId },
      req.body.payload
    );
    res.status(200).send("Edit Successfully");
  } catch (error) {
    console.log("Error in editTransaction:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};
export const deleteTransaction = async (req, res) => {
  try {
    const { transactionId } = req.body;

    // Ensure transactionId is provided
    if (!transactionId) {
      return res.status(400).json({ message: "Transaction ID is required" });
    }

    // Find and delete the transaction
    const deletedTransaction = await Transaction.findByIdAndDelete(transactionId);

    // If the transaction doesn't exist, send an error
    if (!deletedTransaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Respond with a success message
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};
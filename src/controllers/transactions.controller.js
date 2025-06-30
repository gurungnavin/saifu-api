import { sql } from "../config/db.js";

const createTransaction = async (req, res) => {
  // Endpoint to create a new transaction
  // Expects user_id, title, amount, and category in the request body
  try {
    const { user_id, title, amount, category } = req.body;

    if (!user_id || !title || amount === undefined || !category) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const result = await sql`
      INSERT INTO transactions (user_id, title, amount, category)
      VALUES (${user_id}, ${title}, ${amount}, ${category})
      RETURNING *;
    `;
    res.status(201).json(result[0]); // Return the inserted transaction
  } catch (error) {
    console.error("Error inserting transaction:", error);
    return res.status(501).json({ error: "Internal server error" });
  }
};

const getTransactionByUserId = async (req, res) => {
  try {
    // Endpoint to get all transactions for a specific user
    const { userId } = req.params;
    const result = await sql`
      SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC;
    `;
    res.status(200).json(result); // Return the list of transactions
  } catch (error) {
    console.error("Error Getting transactions:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    // Endpoint to delete a transaction by ID
    const { id } = req.params;
    // Validate the ID to ensure it's a number
    if (isNaN(parseInt(id))) {
      return res.status(400).json({ error: "Invalid transaction ID" });
    }

    // Delete the transaction with the given ID
    const deleteResult = await sql`
    DELETE FROM transactions WHERE id = ${id} RETURNING *;
    `;
    // Check if any rows were deleted
    // If no rows were deleted, it means the transaction was not found
    if (deleteResult.length === 0) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    // Transaction deleted successfully then return a success message
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return res.status(503).json({ error: "Internal server error" });
  }
};

const getTransactionSummary = async (req, res) => {
  try {
    const { userId } = req.params;
    const balalnceResult = await sql`
        SELECT COALESCE(SUM(amount), 0) AS balance FROM transactions WHERE user_id = ${userId};
      `;

    const incomeResult = await sql`
        SELECT COALESCE(SUM(amount), 0) as income FROM transactions 
        WHERE user_id = ${userId} AND amount > 0;
      `;

    const expenseResult = await sql`
        SELECT COALESCE(SUM(amount), 0) as expense FROM transactions
        WHERE user_id = ${userId} AND amount < 0;
      `;

    res.status(200).json({
      balance: parseFloat(balalnceResult[0].balance),
      income: parseFloat(incomeResult[0].income),
      expense: parseFloat(expenseResult[0].expense),
    });
  } catch (error) {
    console.error("Error Getting Summary of transaction:", error);
    return res.status(502).json({ error: "Internal server error" });
  }
};

export {
  createTransaction,
  getTransactionByUserId,
  deleteTransaction,
  getTransactionSummary,
};

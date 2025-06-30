import express from "express";
import { createTransaction, deleteTransaction, getTransactionByUserId, getTransactionSummary } from "../controllers/transactions.controller.js";


const router = express.Router();


router.post("/", createTransaction); // Endpoint to create a new transaction
router.get("/:userId", getTransactionByUserId) // Endpoint to get all transactions for a specific user
router.delete("/:id", deleteTransaction)  
router.get("/summary/:userId", getTransactionSummary)



export default router;
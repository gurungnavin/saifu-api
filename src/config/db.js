import { neon } from "@neondatabase/serverless";
import 'dotenv/config';

// Creates a sql connection using your Neon database URL
export const sql = neon(process.env.DB_URL);

export const connetDB = async () => {
  try {
       await sql`CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        category VARCHAR(255) NOT NULL,
        created_at DATE NOT NULL DEFAULT CURRENT_DATE
    )`
  
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Database connection failed:", error);
    process.exit(1); // Exit the process with failure
  }
}
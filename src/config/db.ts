import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // <- use Render's internal URL
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
});

const connectDB = async (): Promise<void> => {
  try {
    const client = await pool.connect();
    console.log("PostgreSQL connected successfully");
    client.release();
  } catch (error) {
    console.error("PostgreSQL connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;

import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // <- use Render's internal URL
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false
});

<<<<<<< HEAD
// function to connect to the database

=======
>>>>>>> 42478da51c8cc0e182c2a13bd68d7ed4f1fedec2
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
// function to create tables
export const createTables = async (): Promise<void> => {
  const client = await pool.connect();
  try {
    const userTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL,
        is_enabled BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        reset_password_token VARCHAR(255)
      
      );
    `;
    await client.query(userTableQuery);
    console.log("Tables created successfully");
    const categoryTableQuery = ` 
      CREATE TABLE IF NOT EXISTS categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL
      );
    `;
    await client.query(categoryTableQuery);
    // product table
    const productTableQuery = ` 
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price NUMERIC(10, 2) NOT NULL,
        category_id INTEGER REFERENCES categories(id)
      );
    `;
    await client.query(productTableQuery);
    console.log("Product table created successfully");
    //cart table
    const cartTableQuery = ` 
      CREATE TABLE IF NOT EXISTS carts(
        id SERIAL PRIMARY KEY,
        product_id INTEGER REFERENCES products(id),
        user_id INTEGER REFERENCES users(id),
        quantity INTEGER NOT NULL,
        unit_price NUMERIC(10, 2) NOT NULL,
        total_price NUMERIC(10, 2) NOT NULL
      );
    `;
    await client.query(cartTableQuery);
    console.log("Cart table created successfully");
    // place an order table
    const orderTableQuery = ` 
      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        cart_id INTEGER REFERENCES carts(id),
        status VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await client.query(orderTableQuery);
    console.log("Order table created successfully");

  } catch (error) {
    console.error("Error creating tables:", error);
  } finally {
    client.release();
  }
};

export default connectDB;

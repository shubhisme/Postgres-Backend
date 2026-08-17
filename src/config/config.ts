import dotenv from "dotenv";
dotenv.config();

const config = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 5000,
  DATABASE_URL: process.env.DATABASE_URL,
};

export default config;

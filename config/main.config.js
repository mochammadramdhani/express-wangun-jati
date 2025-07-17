import dotenv from "dotenv";
dotenv.config();

const CONFIG = {
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_KEY: process.env.SUPABASE_KEY,
  JWT_SECRET: process.env.JWT_SECRET,
  FRONTEND_URL: "https://wangun-jati.vercel.app",
};

export { CONFIG };

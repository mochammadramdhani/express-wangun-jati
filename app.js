import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { fileURLToPath } from "url";
import { dirname } from "path";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

import adminRouter from "./routes/admin.js";

// Init Middleware
import logRequest from "./middleware/logMiddleware.js";
import { CONFIG } from "./config/main.config.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(
  cors({
    origin: CONFIG.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));
app.use("/admin", express.static(path.join(__dirname, "public")));

app.use(logRequest);

app.use((req, res, next) => {
  res.locals.title ??= `${CONFIG.PROJECT_NAME || "Error Occured"}`;
  next();
});

// API Route
app.use("/api", adminRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  // res.render('error');
  res.status(404).json({ message: "Not Found" });
});

export default app;

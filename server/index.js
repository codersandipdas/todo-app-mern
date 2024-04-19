const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// environment var
dotenv.config();

// port
const PORT = process.env.PORT || 4000;

const app = express();
app.use(cookieParser());

// json
app.use(express.json());

// cors
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// connect to mongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((err) => {
    console.log(err);
  });

// import routes
const authRoutes = require("./routes/auth");
const todoRoutes = require("./routes/todo");

// use routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/todo", todoRoutes);

// app
app.listen(PORT, () => console.log(`Server connected on port ${PORT}`));

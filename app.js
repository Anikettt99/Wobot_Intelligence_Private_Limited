const express = require("express");

const cors = require("cors");
const dotenv = require("dotenv");
const HttpError = require("./model/http-error");
const path = require("path");
const multer = require("multer");
const connectDB = require("./config/db");

dotenv.config();
connectDB();
const app = express();
const upload = multer();

const productRouter = require("./routes/product-routes");
const userRouter = require("./routes/user-routes");

app.use(cors());
app.options("*", cors());

app.use("/products", productRouter);
app.use("/users", upload.array(), userRouter);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ error: error.message || "An Unknown error occured" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`App listening on PORT ${PORT}`));

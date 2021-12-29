const express = require("express");
const {
  addProduct,
  getAllProducts,
} = require("../controller/product-controller");
const multer = require("multer");
const { protect } = require("../middleware/auth-middleware");

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, +Date.now() + file.originalname);
  },
});

const upload = multer({ storage });

const router = express.Router();

router.post("/upload", protect, upload.single("csv"), addProduct);

router.get("/get_all_products", protect, getAllProducts);

module.exports = router;

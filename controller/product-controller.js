const fs = require("fs");
const csv = require("csvtojson");
const path = require("path");
const Product = require("../model/Product");
const HttpError = require("../model/http-error");

const addProduct = async (req, res, next) => {
  let converted_json;
  let products = [];
  converted_json = await csv().fromFile(req.file.path);
  for (var j = 0; j < converted_json.length; j++) {
    if (
      !converted_json[j].name ||
      !converted_json[j].description ||
      !converted_json[j].quantity ||
      !converted_json[j].price
    ) {
      const error = new HttpError("PROBLEM WITH CSV FILE", 500);
      return next(error);
    }

    const product = {
      name: converted_json[j].name,
      description: converted_json[j].description,
      quantity: converted_json[j].quantity,
      price: converted_json[j].price,
      _createdBy: req.userId,
    };

    products.push(product);
  }

  fs.unlinkSync(req.file.path);

  await Product.insertMany(products);

  res.status(201).send("PRODUCTS ADDED SUCCESSFULLY");
};

const getAllProducts = async (req, res, next) => {
  let products;

  try {
    products = await Product.find({}, "-createdAt -updatedAt");
  } catch (err) {
    const error = new HttpError("INTERNAL SERVER ERROR", 500);
    return next(error);
  }

  res.status(201).json({
    Products: products,
  });
};

exports.addProduct = addProduct;
exports.getAllProducts = getAllProducts;

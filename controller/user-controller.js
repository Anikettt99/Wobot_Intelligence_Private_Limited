const User = require("../model/User");
const bcrypt = require("bcryptjs");
const HttpError = require("../model/http-error");
const generateToken = require("../config/generateToken");

const signUp = async (req, res, next) => {
 
  const { firstName, lastName, username, password } = req.body;

  if (!username || !firstName || !lastName || !password) {
    const error = new HttpError("PLEASE INPUT ALL FIELD", 500);
    return next(error);
  }

  let user;
  try {
    user = await User.find({ username: username });
  } catch (err) {
    const error = new HttpError("INTERNAL SERVER ERROR", 500);
    return next(error);
  }
  if (user.length > 0) {
    const error = new HttpError("USER WITH THIS USERNAME ALREADY EXISTS", 400);
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError("INTERNAL SERVER ERROR", 500);
    return next(error);
  }

  try {
    user = await User.create({
      firstName,
      lastName,
      username,
      password: hashedPassword,
    });
  } catch (err) {
    const error = new HttpError("INTERNAL SERVER ERROR", 500);
    return next(error);
  }

  res.status(201).send("REGISTRATION SUCCESSFULL ");
};

const login = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    const error = new HttpError("PLEASE INPUT ALL FIELD", 500);
    return next(error);
  }

  let user;
  try {
    user = await User.findOne({ username: username });
  } catch (err) {
    const error = new HttpError("INTERNAL SERVER ERROR", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("WRONG CREDENTIALS", 404);
    return next(error);
  }

  if (!bcrypt.compareSync(password, user.password)) {
    const error = new HttpError("WRONG CREDENTIALS", 404);
    return next(error);
  }

  res.status(201).json({
    _id: user._id,
    username: user.username,
    firstName: user.firstName,
    lastName: user.lastName,
    token: generateToken(user._id),
  });
};

const fetchAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password -createdAt -updatedAt");
  } catch (err) {
    const error = new HttpError("INTERNAL SERVER ERROR", 500);
    return next(error);
  }

  res.status(201).json({
    users,
  });
};

const fetchUser = async (req, res, next) => {
  const userId = req.params.id;

  let user;

  try {
    user = await User.findById(userId).select(
      "-password -createdAt -updatedAt"
    );
  } catch (err) {
    const error = new HttpError("INTERNAL SERVER ERROR", 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError("NO USER FOUND", 404);
    return next(error);
  }

  res.status(201).json({
    user,
  });
};

exports.signUp = signUp;
exports.login = login;
exports.fetchAllUsers = fetchAllUsers;
exports.fetchUser = fetchUser;

const { v4: uuid } = require("uuid");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const User = require("../models/user");

const getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try again later. ",
      500
    );
    return next(error);
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const signUp = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError("invalid inputs passed, please check your data.", 422);
  }

  const { name, email, image, secret } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later",
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      "User exists already, please log in instead",
      422
    );
    return next(error);
  }

  user = new User({
    name,
    email,
    image,
    password: secret,
    places: [],
  });

  try {
    await user.save();
  } catch (err) {
    return next(
      new HttpError("there was an error creating your user account", 500)
    );
  }

  res.status(201).json({ createdUser: user.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, secret } = req.body;
  let user;

  try {
    user = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later",
      500
    );
    return next(error);
  }

  if (!user || user.password !== secret) {
    const error = new HttpError(
      "Invalid credentials, could not log you in",
      401
    );
    return next(error);
  }

  return res.status(200).json({ user: user });
};

exports.getAllUsers = getAllUsers;
exports.signUp = signUp;
exports.login = login;

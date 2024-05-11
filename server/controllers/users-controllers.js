const { v4: uuid } = require("uuid");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const User = require("../models/user");

let DUMMY_USERS = [
  {
    id: "u1",
    name: "elias",
    email: "elias@elias.com",
    password: "eliaspass",
    image:
      "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/ae0bf4ce-7cda-49ac-8727-74a9d578aab4/d30zdlc-487e9617-de7a-4577-9bc5-229b40694b0c.jpg/v1/fill/w_889,h_899,q_70,strp/timone_with_color_by_philmo97532_d30zdlc-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9OTExIiwicGF0aCI6IlwvZlwvYWUwYmY0Y2UtN2NkYS00OWFjLTg3MjctNzRhOWQ1NzhhYWI0XC9kMzB6ZGxjLTQ4N2U5NjE3LWRlN2EtNDU3Ny05YmM1LTIyOWI0MDY5NGIwYy5qcGciLCJ3aWR0aCI6Ijw9OTAwIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.MJ4evbdq2IhDCKOoiy7ISIRBDpeL0LzvGd4QXTlQ4sM",
  },
  {
    id: "u2",
    name: "ruby",
    email: "ruby@ruby.com",
    password: "rubypass",
    image:
      "https://www.liveabout.com/thmb/Nu10xoSXf95e8vbgKSAiHkvyOxQ=/4546x3844/filters:no_upscale():max_bytes(150000):strip_icc()/close-up-of-a-rose-quartz-rock-74100505-57ed3ac95f9b586c35c7b2a5.jpg",
  },
];
const getAllUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};

const signUp = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError("invalid inputs passed, please check your data.", 422);
  }

  const { name, email, image, secret, places } = req.body;
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
    places,
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

const { v4: uuid } = require("uuid");
const HttpError = require("../models/http-error");

let DUMMY_USERS = [
  {
    id: "u1",
    name: "elias",
    password: "eliaspass",
    image:
      "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/ae0bf4ce-7cda-49ac-8727-74a9d578aab4/d30zdlc-487e9617-de7a-4577-9bc5-229b40694b0c.jpg/v1/fill/w_889,h_899,q_70,strp/timone_with_color_by_philmo97532_d30zdlc-pre.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9OTExIiwicGF0aCI6IlwvZlwvYWUwYmY0Y2UtN2NkYS00OWFjLTg3MjctNzRhOWQ1NzhhYWI0XC9kMzB6ZGxjLTQ4N2U5NjE3LWRlN2EtNDU3Ny05YmM1LTIyOWI0MDY5NGIwYy5qcGciLCJ3aWR0aCI6Ijw9OTAwIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.MJ4evbdq2IhDCKOoiy7ISIRBDpeL0LzvGd4QXTlQ4sM",
  },
  {
    id: "u2",
    name: "ruby",
    password: "rubypass",
    image:
      "https://www.liveabout.com/thmb/Nu10xoSXf95e8vbgKSAiHkvyOxQ=/4546x3844/filters:no_upscale():max_bytes(150000):strip_icc()/close-up-of-a-rose-quartz-rock-74100505-57ed3ac95f9b586c35c7b2a5.jpg",
  },
];
const getAllUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};

const signUp = (req, res, next) => {
  const { name, image, secret } = req.body;

  let user = DUMMY_USERS.find((user) => user.name === name);

  if (user) return next(new HttpError("user already exists", 400));

  user = {
    id: uuid(),
    name,
    image,
    secret,
  };

  DUMMY_USERS.push(user);
  res.status(201).json({ user });
};

const login = (req, res, next) => {
  const { name, secret } = req.body;

  const user = DUMMY_USERS.find(
    (user) => user.name === name && user.password === secret
  );

  if (user) return res.status(200).json({ user: user });
  else return next(new HttpError("username or password is incorrect", 400));
};

exports.getAllUsers = getAllUsers;
exports.signUp = signUp;
exports.login = login;

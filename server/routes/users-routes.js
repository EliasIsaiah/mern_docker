const express = require("express");
const { check } = require("express-validator");

const router = express.Router();

const usersControllers = require("../controllers/users-controllers");

router.get("/", usersControllers.getAllUsers);
router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("secret").isLength({ min: 6 }),
  ],
  usersControllers.signUp
);
router.post("/login", usersControllers.login);

module.exports = router;

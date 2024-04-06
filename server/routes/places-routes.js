const express = require("express");
const { check, oneOf } = require("express-validator");

const router = express.Router();

const placesControllers = require("../controllers/places-controllers");

router.get("/:pid", placesControllers.getPlaceById);

router.get("/user/:uid", placesControllers.getPlacesByUserId);

router.post(
  "/",
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
    check("creator").not().isEmpty(),
  ],
  placesControllers.createPlace
);

router.patch(
  "/:pid",
  oneOf([
    check("title").not().isEmpty(),
    check("address").not().isEmpty(),
    check("location").not().isEmpty(),
    check("description").not().isEmpty(),
  ]),
  check("description").isLength({ min: 5 }),
  placesControllers.updatePlace
);

router.delete("/:pid", placesControllers.deletePlace);

module.exports = router;

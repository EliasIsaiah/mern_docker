const { v4: uuid } = require("uuid");
const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const Place = require("../models/place");

const getCoordsForAddress = require("../util/location");
const place = require("../models/place");
let DUMMY_PLACES = [
  {
    id: "p1",
    title: "empire state building",
    description: "one of the most famous sky scrapers in the world",
    location: {
      lat: 40.7484474,
      lng: -73.9871516,
    },
    address: "20 W 34th St, New York, NY 10001",
    creator: "u1",
  },
  {
    id: "p2",
    title: "willis tower",
    description: "formerly the tallest building in chicago",
    location: {
      lat: 41.8788804,
      lng: -87.6384898,
    },
    address: "233 S Wacker Dr, Chicago, IL 60606",
    creator: "u1",
  },
  {
    id: "p3",
    title: "JPMorgan Chase McCoy Center",
    description: "JPMC Corporate office, Columbus, Ohio",
    location: {
      lat: 40.1366769,
      lng: -83.0179706,
    },
    address: "1111 Polaris Pkwy, Columbus, OH 43240",
    creator: "u2",
  },
];

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId).exec();
  } catch (err) {
    const error = new HttpError(
      "something went wrong, could not find a place.",
      500
    );
    return next(error);
  }
  if (!place) {
    const error = new HttpError(
      "Could not find a place for the provided id",
      404
    );
    return next(error);
  }
  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const { uid: creator } = req.params;
  let places;
  try {
    places = await Place.find({ creator });
  } catch (err) {
    const error = new HttpError(
      "Fetching places failed, please try again later.",
      500
    );
    return next(error);
  }
  if (!places || !places.length > 0) {
    return next(
      new HttpError("could not find any places created by that user", 404)
    );
  }
  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("invalid inputs passed, please check your data.", 422)
    );
  }
  const { title, description, address, creator } = req.body;
  let coordinates;

  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }
  // convert address to coordinates

  const createdPlace = new Place({
    title,
    address,
    description,
    location: coordinates,
    image:
      "https://www.allrecipes.com/thmb/-sGgcEhnlIhqr0legC4Q7TPkRhU=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/32385-best-lemonade-ever-DDMFS-4x3-8cef7761205e417499c89eb178e5ba2b.jpg",
    creator,
  });

  try {
    await createdPlace.save();
  } catch (err) {
    const error = new HttpError("Creating place failed, please try again", 500);
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    return next(
      new HttpError("invalid inputs passed, please check your data.", 422)
    );
  }
  const { pid: placeId } = req.params;

  const { title, description, address } = req.body;

  let coordinates;

  if (address)
    try {
      coordinates = await getCoordsForAddress(address);
    } catch (error) {
      return next(error);
    }

  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(`error finding place: ${err.message}`);
  }

  place.title = title;
  place.description = description;
  place.address = address ? address : place.address;
  place.coordinates = coordinates ? coordinates : place.coordinates;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update place",
      500
    );
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
  const { pid: placeId } = req.params;
  let deletedPlace;
  try {
    deletedPlace = await Place.findByIdAndDelete(placeId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete place.",
      500
    );
    return next(error);
  }

  res
    .status(200)
    .json({ message: "deleted place", deleteResponse: deletedPlace });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;

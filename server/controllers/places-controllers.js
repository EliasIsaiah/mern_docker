const HttpError = require("../models/http-error");

const DUMMY_PLACES = [
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

const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find((place) => place.id === placeId);
  if (!place) {
    throw new HttpError("Could not find a place for the provided id", 404);
  }
  res.json({ place });
};

const getPlaceByUser = (req, res, next) => {
  const { uid } = req.params;
  const places = DUMMY_PLACES.filter((place) => place.creator === uid);
  if (!places.length > 0) {
    return next(
      new HttpError("could not find any places created by that user", 404)
    );
  }
  res.json({ places });
};

const createPlace = (req, res, json) => {
  const { title, description, coordinates, address, creator } = req.body;
  const createdPlace = {
    title,
    description,
    location: coordinates,
    address,
    creator,
  };

  DUMMY_PLACES.push(createdPlace);

  res.status(201).json({ place: createdPlace });
};

exports.getPlaceById = getPlaceById;
exports.getPlaceByUser = getPlaceByUser;
exports.createPlace = createPlace;

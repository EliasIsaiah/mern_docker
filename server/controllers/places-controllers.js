const { v4: uuid } = require("uuid");
const HttpError = require("../models/http-error");

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

const getPlaceById = (req, res, next) => {
  const placeId = req.params.pid;
  const place = DUMMY_PLACES.find((place) => place.id === placeId);
  if (!place) {
    throw new HttpError("Could not find a place for the provided id", 404);
  }
  res.json({ place });
};

const getPlacesByUserId = (req, res, next) => {
  const { uid } = req.params;
  const places = DUMMY_PLACES.filter(
    (place) => place.creator.trim() === uid.trim()
  );
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
    id: uuid(),
    title,
    description,
    location: coordinates,
    address,
    creator,
  };

  DUMMY_PLACES.push(createdPlace);

  res.status(201).json({ place: createdPlace });
};

const updatePlace = (req, res, next) => {
  const { pid: placeId } = req.params;
  const { title, description, coordinates, address, creator } = req.body;
  const updatedPlace = {
    title,
    description,
    location: coordinates,
    address,
    creator,
  };

  const index = DUMMY_PLACES.findIndex((place) => place.id === placeId);

  if (!(index >= 0)) {
    return next(new HttpError("could not find place to update", 404));
  }

  oldPlace = DUMMY_PLACES[index];

  DUMMY_PLACES[index] = {
    id: oldPlace.id,
    title: updatedPlace.title || oldPlace.title,
    description: updatedPlace.description || oldPlace.description,
    location: updatedPlace.location || oldPlace.location,
    address: updatedPlace.address || oldPlace.address,
    creator: updatedPlace.creator || oldPlace.creator,
  };

  res.status(200).json({ place: DUMMY_PLACES[index] });
};

const deletePlace = (req, res, next) => {
  const { pid: placeId } = req.params;
  const index = DUMMY_PLACES.findIndex((place) => place.id === placeId);

  if (!(index >= 0)) {
    return next(new HttpError("could not find place to delete", 404));
  }
  DUMMY_PLACES = DUMMY_PLACES.filter((place) => place.id !== placeId);
  res.status(200).json({ message: "deleted" });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;

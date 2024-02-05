import React from "react";
import { useParams } from "react-router-dom";
import PlaceList from "../components/PlaceList";

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire state building",
    description: "famous building in new york",
    imageUrl:
      "https://lh5.googleusercontent.com/p/AF1QipMDv3C-fXXvEvttpkkgNG5Rg52BwR4SBaA1w0dR=w408-h270-k-no",
    address: "20 W 34th St., New York, NY 10001",
    location: {
      lat: 40.7484445,
      lng: -73.9882393,
    },
    creator: "u1",
  },
  {
    id: "p2",
    title: "Empire state building",
    description: "famous building in new york",
    imageUrl:
      "https://lh5.googleusercontent.com/p/AF1QipMDv3C-fXXvEvttpkkgNG5Rg52BwR4SBaA1w0dR=w408-h270-k-no",
    address: "20 W 34th St., New York, NY 10001",
    location: {
      lat: 40.7484445,
      lng: -73.9882393,
    },
    creator: "u2",
  },
];

const UserPlaces = () => {
  const userId = useParams().userId;
  const loadedPlaces = DUMMY_PLACES.filter((place) => place.creator === userId);
  return <PlaceList items={loadedPlaces} />;
};

export default UserPlaces;

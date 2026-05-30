const geolib = require("geolib");

const OFFICE_LOCATION = {
  latitude: 28.6139,
  longitude: 77.2090
};

const OFFICE_RADIUS = 30000;

const validateOfficeRadius = (lat, lng) => {
  return geolib.isPointWithinRadius(
    {
      latitude: lat,
      longitude: lng
    },
    OFFICE_LOCATION,
    OFFICE_RADIUS
  );
};

module.exports = {
  validateOfficeRadius
};
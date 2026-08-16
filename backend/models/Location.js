const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: true,
      default: "India",
      index: true,
    },

    state: {
      type: String,
      required: true,
      index: true,
    },

    stateCode: {
      type: String,
      default: "",
    },

    district: {
      type: String,
      required: true,
      index: true,
    },

    districtCode: {
      type: String,
      default: "",
    },

    block: {
      type: String,
      default: "",
      index: true,
    },

    blockCode: {
      type: String,
      default: "",
    },

    village: {
      type: String,
      default: "",
      index: true,
    },

    villageCode: {
      type: String,
      default: "",
    },

    latitude: {
      type: Number,
      default: null,
    },

    longitude: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

locationSchema.index({
  country: 1,
  state: 1,
  district: 1,
  block: 1,
  village: 1,
});

module.exports = mongoose.model(
  "Location",
  locationSchema
);
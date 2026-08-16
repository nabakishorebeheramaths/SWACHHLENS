const express = require("express");
const router = express.Router();

const Location = require("../models/Location");

/* =========================================
   GET ALL STATES
========================================= */

router.get("/states", async (req, res) => {
  try {
    const states = await Location.distinct("state", {
      country: "India",
    });

    states.sort((a, b) =>
      a.localeCompare(b)
    );

    res.json({
      success: true,
      count: states.length,
      states,
    });
  } catch (error) {
    console.error("States error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch states.",
    });
  }
});

/* =========================================
   GET DISTRICTS
========================================= */

router.get("/districts", async (req, res) => {
  try {
    const { state } = req.query;

    if (!state) {
      return res.status(400).json({
        success: false,
        message: "State is required.",
      });
    }

    const districts =
      await Location.distinct(
        "district",
        {
          country: "India",
          state,
        }
      );

    districts.sort((a, b) =>
      a.localeCompare(b)
    );

    res.json({
      success: true,
      state,
      count: districts.length,
      districts,
    });
  } catch (error) {
    console.error(
      "Districts error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch districts.",
    });
  }
});

/* =========================================
   GET BLOCKS
========================================= */

router.get("/blocks", async (req, res) => {
  try {
    const { state, district } =
      req.query;

    if (!state || !district) {
      return res.status(400).json({
        success: false,
        message:
          "State and district are required.",
      });
    }

    const blocks =
      await Location.distinct(
        "block",
        {
          country: "India",
          state,
          district,
        }
      );

    blocks.sort((a, b) =>
      a.localeCompare(b)
    );

    res.json({
      success: true,
      state,
      district,
      count: blocks.length,
      blocks,
    });
  } catch (error) {
    console.error(
      "Blocks error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch blocks.",
    });
  }
});

/* =========================================
   GET VILLAGES
========================================= */

router.get("/villages", async (req, res) => {
  try {
    const {
      state,
      district,
      block,
    } = req.query;

    if (
      !state ||
      !district ||
      !block
    ) {
      return res.status(400).json({
        success: false,
        message:
          "State, district and block are required.",
      });
    }

    const villages =
      await Location.distinct(
        "village",
        {
          country: "India",
          state,
          district,
          block,
        }
      );

    villages.sort((a, b) =>
      a.localeCompare(b)
    );

    res.json({
      success: true,
      state,
      district,
      block,
      count: villages.length,
      villages,
    });
  } catch (error) {
    console.error(
      "Villages error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch villages.",
    });
  }
});

module.exports = router;
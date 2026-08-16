const express = require("express");

const Organization = require(
  "../models/Organization"
);

const router = express.Router();

// =========================================================
// GET ALL ORGANIZATIONS
// =========================================================

router.get("/", async (req, res) => {
  try {

    const organizations =
      await Organization.find({
        active: true,
      })
        .sort({
          prioritySupport: -1,
          organizationName: 1,
        })
        .lean();

    return res.status(200).json({
      success: true,

      count:
        organizations.length,

      organizations,
    });

  } catch (error) {

    console.error(
      "❌ Get Organizations Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Unable to load organizations.",
    });
  }
});

module.exports = router;
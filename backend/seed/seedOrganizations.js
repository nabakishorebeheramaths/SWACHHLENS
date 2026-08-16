const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Organization = require("../models/Organization");

const odishaOrganizations = require(
  "./odishaOrganizations"
);

const otherStateOrganizations = require(
  "./otherStateOrganizations"
);

dotenv.config();

// =========================================================
// COMBINE ALL ORGANIZATIONS
// =========================================================

const allOrganizations = [
  ...odishaOrganizations,
  ...otherStateOrganizations,
];

// =========================================================
// GET EXISTING MONGODB CONNECTION STRING
// Supports the same common names used by backends.
// =========================================================

const mongoConnectionString =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  process.env.MONGO_URL ||
  process.env.DATABASE_URL;

// =========================================================
// SEED ORGANIZATIONS
// =========================================================

async function seedOrganizations() {
  try {

    // -----------------------------------------------------
    // CHECK MONGODB CONNECTION STRING
    // -----------------------------------------------------

    if (!mongoConnectionString) {
      throw new Error(
        "MongoDB connection string was not found in environment variables."
      );
    }

    console.log(
      "🔄 Connecting to MongoDB for organization seed..."
    );

    // -----------------------------------------------------
    // CONNECT
    // -----------------------------------------------------

    await mongoose.connect(
      mongoConnectionString
    );

    console.log(
      "🍃 MongoDB Connected Successfully"
    );

    // -----------------------------------------------------
    // COUNTERS
    // -----------------------------------------------------

    let insertedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    // -----------------------------------------------------
    // UPSERT ORGANIZATIONS
    // -----------------------------------------------------

    for (const organization of allOrganizations) {

      // ---------------------------------------------------
      // VALIDATION
      // ---------------------------------------------------

      if (
        !organization.organizationName ||
        !organization.location?.state ||
        !organization.location?.district ||
        !organization.location?.city
      ) {

        skippedCount++;

        console.warn(
          "⚠️ Skipping incomplete organization:",
          organization.organizationName ||
            "Unknown Organization"
        );

        continue;
      }

      // ---------------------------------------------------
      // FIND EXISTING ORGANIZATION
      // ---------------------------------------------------

      const existing =
        await Organization.findOne({
          organizationName:
            organization.organizationName,

          "location.state":
            organization.location.state,

          "location.district":
            organization.location.district,

          "location.city":
            organization.location.city,
        });

      // ---------------------------------------------------
      // UPDATE EXISTING
      // ---------------------------------------------------

      if (existing) {

        await Organization.updateOne(
          {
            _id: existing._id,
          },
          {
            $set: organization,
          }
        );

        updatedCount++;

        console.log(
          `🔄 Updated: ${organization.organizationName}`
        );

      }

      // ---------------------------------------------------
      // INSERT NEW
      // ---------------------------------------------------

      else {

        await Organization.create(
          organization
        );

        insertedCount++;

        console.log(
          `✅ Inserted: ${organization.organizationName}`
        );
      }
    }

    // -----------------------------------------------------
    // DATABASE TOTAL
    // -----------------------------------------------------

    const totalCount =
      await Organization.countDocuments();

    // -----------------------------------------------------
    // FINAL REPORT
    // -----------------------------------------------------

    console.log(
      "\n========================================"
    );

    console.log(
      "🎉 SWACHHLENS ORGANIZATION SEED COMPLETED"
    );

    console.log(
      "========================================"
    );

    console.log(
      `📦 Source organizations: ${allOrganizations.length}`
    );

    console.log(
      `➕ Inserted: ${insertedCount}`
    );

    console.log(
      `🔄 Updated: ${updatedCount}`
    );

    console.log(
      `⚠️ Skipped: ${skippedCount}`
    );

    console.log(
      `📊 Total in MongoDB: ${totalCount}`
    );

    console.log(
      "========================================\n"
    );

    // -----------------------------------------------------
    // CLOSE CONNECTION
    // -----------------------------------------------------

    await mongoose.disconnect();

    console.log(
      "✅ MongoDB connection closed"
    );

    process.exit(0);

  } catch (error) {

    console.error(
      "\n❌ Organization seed failed:"
    );

    console.error(
      error.message || error
    );

    try {
      await mongoose.disconnect();
    } catch {
      // Ignore disconnect errors
    }

    process.exit(1);
  }
}

// =========================================================
// START
// =========================================================

seedOrganizations();
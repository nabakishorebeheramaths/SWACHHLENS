
// ============================================================
// SWACHHLENS
// SEED INDIA LOCATIONS TO MONGODB
//
// IMPORTANT:
// Odisha is intentionally skipped.
// Existing Odisha MongoDB data will NOT be modified.
// ============================================================

const mongoose = require("mongoose");
const path = require("path");

const Location = require("./models/Location");
require("dotenv").config();

// ------------------------------------------------------------
// IMPORT INDIA LOCATION DATA
// frontend/src/indiaLocations.js
// ------------------------------------------------------------

const indiaLocationsPath = path.join(
  __dirname,
  "../frontend/src/data/indiaLocations.js"
);

let indiaLocations;

try {
  // indiaLocations.js uses ES module export syntax,
  // so we load it after converting the file content.
  const fs = require("fs");

  let fileContent = fs.readFileSync(indiaLocationsPath, "utf8");

  fileContent = fileContent
    .replace(/export\s+const\s+getStates[\s\S]*?export\s+default\s+indiaLocations\s*;/, "")
    .replace(/export\s+default\s+indiaLocations\s*;/, "");

  // Find the main object
  const match = fileContent.match(
    /const\s+indiaLocations\s*=\s*([\s\S]*?);\s*$/m
  );

  if (!match) {
    throw new Error(
      "Could not find 'const indiaLocations = {...}' in indiaLocations.js"
    );
  }

  indiaLocations = Function(
    `"use strict"; return (${match[1]});`
  )();

} catch (error) {
  console.error("\n❌ Could not load indiaLocations.js");
  console.error(error.message);
  process.exit(1);
}

// ------------------------------------------------------------
// MONGODB CONNECTION
// ------------------------------------------------------------

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error("\n❌ MONGO_URI / MONGODB_URI not found in .env");
  process.exit(1);
}

// ------------------------------------------------------------
// MAIN SEED FUNCTION
// ------------------------------------------------------------

async function seedIndiaLocations() {
  try {
    console.log("\n========================================");
    console.log("🌍 SWACHHLENS");
    console.log("📍 INDIA LOCATION SEEDER");
    console.log("========================================\n");

    console.log("🔄 Connecting to MongoDB...");

    await mongoose.connect(MONGO_URI);

    console.log("✅ MongoDB connected successfully.\n");

    const states = Object.keys(indiaLocations);

    console.log(`📊 States found in file: ${states.length}`);
    console.log("🚫 Odisha will be skipped.\n");

    let inserted = 0;
    let skipped = 0;

    for (const state of states) {

      // ------------------------------------------------------
      // DO NOT TOUCH ODISHA
      // ------------------------------------------------------

      if (state.toLowerCase() === "odisha") {
        console.log("🛡️ Odisha skipped completely.");
        continue;
      }

      console.log(`\n📍 Processing: ${state}`);

      const districts = indiaLocations[state] || {};

      for (const district of Object.keys(districts)) {

        const blocks = districts[district] || {};

        for (const block of Object.keys(blocks)) {

          const villages = Array.isArray(blocks[block])
            ? blocks[block]
            : [];

          for (const village of villages) {

            if (!village || typeof village !== "string") {
              continue;
            }

            const cleanVillage = village.trim();

            if (!cleanVillage) {
              continue;
            }

            // ------------------------------------------------
            // DUPLICATE CHECK
            // ------------------------------------------------

            const exists = await Location.exists({
              country: "India",
              state,
              district,
              block,
              village: cleanVillage,
            });

            if (exists) {
              skipped++;
              continue;
            }

            // ------------------------------------------------
            // INSERT LOCATION
            // ------------------------------------------------

            await Location.create({
              country: "India",

              state,

              stateCode: "",

              district,

              districtCode: "",

              block,

              blockCode: "",

              village: cleanVillage,

              villageCode: "",

              latitude: null,

              longitude: null,
            });

            inserted++;
          }
        }
      }

      console.log(`   ✅ ${state} completed`);
    }

    console.log("\n========================================");
    console.log("🎉 SEEDING COMPLETED");
    console.log("========================================");
    console.log(`✅ Inserted : ${inserted}`);
    console.log(`⏭️ Skipped  : ${skipped}`);
    console.log("🛡️ Odisha   : NOT TOUCHED");
    console.log("========================================\n");

  } catch (error) {

    console.error("\n❌ SEEDING FAILED");
    console.error(error);

  } finally {

    await mongoose.connection.close();

    console.log("🔌 MongoDB connection closed.");
  }
}

// ------------------------------------------------------------
// RUN
// ------------------------------------------------------------

seedIndiaLocations();

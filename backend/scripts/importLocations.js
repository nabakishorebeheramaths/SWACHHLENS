const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

const Location = require("../models/Location");

dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI ||
  process.env.MONGODB_URI ||
  process.env.MONGO_URL;

const DATA_DIR = path.join(__dirname, "../data");

const BATCH_SIZE = 1000;

/* =====================================================
   HELPERS
===================================================== */

function normalize(value) {
  if (value === undefined || value === null) {
    return "";
  }

  return String(value).trim();
}

function findColumn(row, possibleNames) {
  const keys = Object.keys(row);

  // 1. First try exact normalized match
  for (const key of keys) {
    const normalizedKey = key
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");

    for (const name of possibleNames) {
      const normalizedName = name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");

      if (normalizedKey === normalizedName) {
        return key;
      }
    }
  }

  // 2. Then try contains match as fallback
  for (const key of keys) {
    const normalizedKey = key
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");

    for (const name of possibleNames) {
      const normalizedName = name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");

      if (normalizedKey.includes(normalizedName)) {
        return key;
      }
    }
  }

  return undefined;
}

/* =====================================================
   READ XLS
===================================================== */

function readExcel(filePath) {
  console.log(
    `📖 Reading: ${path.basename(filePath)}`
  );

  const workbook = XLSX.readFile(filePath, {
    cellDates: true,
  });

  const sheetName =
    workbook.SheetNames[0];

  const sheet =
    workbook.Sheets[sheetName];

  /* Read every row exactly as it appears */
  const rawRows =
    XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      defval: "",
      blankrows: false,
    });

  console.log(
    `📄 Raw rows detected: ${rawRows.length}`
  );

  if (!rawRows.length) {
    return [];
  }

  /* ---------------------------------------------
     FIND ACTUAL HEADER ROW
  --------------------------------------------- */

  const headerIndex =
    rawRows.findIndex((row) => {
      const text = row
        .map((cell) =>
          String(cell)
            .toLowerCase()
            .trim()
        )
        .join(" | ");

      return (
        text.includes("district") &&
        (
          text.includes("village") ||
          text.includes("block")
        )
      );
    });

  if (headerIndex === -1) {
    console.log(
      "⚠️ Could not automatically detect header row."
    );

    console.log(
      "First rows from XLS:"
    );

    console.log(
      rawRows.slice(0, 15)
    );

    return [];
  }

  console.log(
    `✅ Header detected at Excel row ${
      headerIndex + 1
    }`
  );

  const headers =
    rawRows[headerIndex].map(
      (header, index) => {
        const value =
          String(header).trim();

        return value ||
          `Column_${index}`;
      }
    );

  /* ---------------------------------------------
     CONVERT ROWS TO OBJECTS
  --------------------------------------------- */

  const dataRows =
    rawRows.slice(headerIndex + 1);

  const objects = dataRows.map(
    (row) => {
      const object = {};

      headers.forEach(
        (header, index) => {
          object[header] =
            row[index] ?? "";
        }
      );

      return object;
    }
  );

  return objects.filter((row) =>
    Object.values(row).some(
      (value) =>
        String(value).trim() !== ""
    )
  );
}
/* =====================================================
   FIND VILLAGE FILE
===================================================== */

function findCoveredVillageFile(files) {
  return files.find((file) =>
    file
      .toLowerCase()
      .includes("covered")
  );
}

/* =====================================================
   IMPORT
===================================================== */

async function importLocations() {
  try {
    if (!MONGO_URI) {
      console.error(
        "❌ MONGO_URI is missing in .env"
      );

      process.exit(1);
    }

    console.log(
      "🔄 Connecting to MongoDB..."
    );

    await mongoose.connect(MONGO_URI);

    console.log(
      "✅ MongoDB connected."
    );

    /* ---------------------------------------------
       FIND XLS FILES
    --------------------------------------------- */

    const files = fs
      .readdirSync(DATA_DIR)
      .filter((file) =>
        /\.(xls|xlsx)$/i.test(file)
      );

    if (files.length === 0) {
      console.error(
        "❌ No XLS/XLSX files found inside backend/data"
      );

      await mongoose.disconnect();
      process.exit(1);
    }

    console.log(
      `📂 Found ${files.length} Excel files.`
    );

    console.log(files);

    /* ---------------------------------------------
       PREFER BLOCK + COVERED VILLAGE FILE
    --------------------------------------------- */

    const coveredFile =
      findCoveredVillageFile(files);

    if (!coveredFile) {
      console.error(
        "❌ Could not find the 'Covered Village' XLS file."
      );

      console.log(
        "Available files:",
        files
      );

      await mongoose.disconnect();
      process.exit(1);
    }

    console.log(
      `🎯 Using master hierarchy file: ${coveredFile}`
    );

    const filePath =
      path.join(
        DATA_DIR,
        coveredFile
      );

    const rows = readExcel(filePath);

    console.log(
      `📊 Total rows detected: ${rows.length}`
    );

    if (rows.length === 0) {
      console.error(
        "❌ Excel file contains no data."
      );

      await mongoose.disconnect();
      process.exit(1);
    }

/* ---------------------------------------------
   DETECT COLUMNS
--------------------------------------------- */

const sample = rows[0];

if (!sample) {
  console.error("\n❌ No data rows available for column detection.");
  await mongoose.disconnect();
  process.exit(1);
}

const stateCodeColumn = findColumn(sample, [
  "statecode",
  "state code",
]);

const stateColumn = findColumn(sample, [
  "statenameinenglish",
  "state name in english",
]);

const districtCodeColumn = findColumn(sample, [
  "districtcode",
  "district code",
]);

const districtColumn = findColumn(sample, [
  "districtnameinenglish",
  "district name in english",
]);

const blockCodeColumn = findColumn(sample, [
  "blockcode",
  "block code",
]);

const blockColumn = findColumn(sample, [
  "blocknameinenglish",
  "block name in english",
]);

const villageCodeColumn = findColumn(sample, [
  "villagecode",
  "village code",
]);

const villageColumn = findColumn(sample, [
  "villagenameinenglish",
  "village name in english",
]);

console.log("\n🔎 Detected columns:");

console.log(
  "State Code:",
  stateCodeColumn
);

console.log(
  "State:",
  stateColumn
);

console.log(
  "District Code:",
  districtCodeColumn
);

console.log(
  "District:",
  districtColumn
);

console.log(
  "Block Code:",
  blockCodeColumn
);

console.log(
  "Block:",
  blockColumn
);

console.log(
  "Village Code:",
  villageCodeColumn
);

console.log(
  "Village:",
  villageColumn
);

if (
  !stateCodeColumn ||
  !stateColumn ||
  !districtCodeColumn ||
  !districtColumn ||
  !blockCodeColumn ||
  !blockColumn ||
  !villageCodeColumn ||
  !villageColumn
) {
  console.error(
    "\n❌ Required columns could not be detected."
  );

  console.log(
    "Available columns:",
    Object.keys(sample)
  );

  await mongoose.disconnect();
  process.exit(1);
}

/* ---------------------------------------------
   CREATE LOCATION DOCUMENTS
--------------------------------------------- */



    const locations = [];

    for (const row of rows) {
      const state =
        normalize(
          row[stateColumn]
        );

      const district =
        normalize(
          row[districtColumn]
        );

      const block =
        normalize(
          row[blockColumn]
        );

      const village =
        normalize(
          row[villageColumn]
        );

      if (
        !state ||
        !district ||
        !block ||
        !village
      ) {
        continue;
      }

      locations.push({
        country: "India",

        state,

        stateCode:
          stateCodeColumn
            ? normalize(
                row[stateCodeColumn]
              )
            : "",

        district,

        districtCode:
          districtCodeColumn
            ? normalize(
                row[districtCodeColumn]
              )
            : "",

        block,

        blockCode:
          blockCodeColumn
            ? normalize(
                row[blockCodeColumn]
              )
            : "",

        village,

        villageCode:
          villageCodeColumn
            ? normalize(
                row[villageCodeColumn]
              )
            : "",

        latitude: null,

        longitude: null,
      });
    }

    console.log(
      `✅ Valid locations prepared: ${locations.length}`
    );

    if (locations.length === 0) {
      console.error(
        "❌ No valid location records found."
      );

      await mongoose.disconnect();
      process.exit(1);
    }

    /* ---------------------------------------------
       REMOVE EXISTING DATA FOR THIS IMPORT
    --------------------------------------------- */

    console.log(
      "\n🧹 Removing previous India location data..."
    );

    await Location.deleteMany({
      country: "India",
    });

    /* ---------------------------------------------
       INSERT IN BATCHES
    --------------------------------------------- */

    console.log(
      "\n📥 Importing locations..."
    );

    let imported = 0;

    for (
      let i = 0;
      i < locations.length;
      i += BATCH_SIZE
    ) {
      const batch =
        locations.slice(
          i,
          i + BATCH_SIZE
        );

      await Location.insertMany(
        batch,
        {
          ordered: false,
        }
      );

      imported += batch.length;

      console.log(
        `📦 Imported ${imported}/${locations.length}`
      );
    }

    /* ---------------------------------------------
       FINAL COUNT
    --------------------------------------------- */

    const total =
      await Location.countDocuments({
        country: "India",
      });

    console.log(
      "\n================================"
    );

    console.log(
      "🎉 LOCATION IMPORT COMPLETE"
    );

    console.log(
      `🇮🇳 Total locations: ${total}`
    );

    console.log(
      "================================\n"
    );

    await mongoose.disconnect();

    console.log(
      "🔌 MongoDB connection closed."
    );
  } catch (error) {
    console.error(
      "\n❌ IMPORT FAILED:"
    );

    console.error(error);

    try {
      await mongoose.disconnect();
    } catch {}

    process.exit(1);
  }
}

importLocations();
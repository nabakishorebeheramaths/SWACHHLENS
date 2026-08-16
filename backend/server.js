const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

// =========================================================
// LOAD ENVIRONMENT FIRST
// =========================================================

require("dotenv").config();

// =========================================================
// ROUTES
// =========================================================

const otpRoutes =
  require("./routes/otpRoutes");

const locationRoutes =
  require("./routes/locationRoutes");

const wasteReportsRoutes =
  require("./routes/wasteReports");

const citizenRoutes =
  require("./routes/citizenRoutes");

// =========================================================
// ORGANIZATION ROUTES
// =========================================================

const organizationRoutes =
  require("./routes/organizationRoutes");

// =========================================================
// RESPONSE ROUTES
// =========================================================

const responseRoutes =
  require("./routes/responseRoutes");
// =========================================================
// ADMIN AUTH ROUTES
// =========================================================

const adminAuthRoutes =
  require("./routes/adminAuthRoutes");
// =========================================================
// ROUTER COMPATIBILITY
// =========================================================

const getRouter = (
  routeModule,
  routeName
) => {
  if (
    typeof routeModule ===
    "function"
  ) {
    return routeModule;
  }

  if (
    routeModule &&
    typeof routeModule.router ===
      "function"
  ) {
    return routeModule.router;
  }

  if (
    routeModule &&
    typeof routeModule.default ===
      "function"
  ) {
    return routeModule.default;
  }

  console.error(
    `❌ ${routeName} is not exporting a valid Express router.`
  );

  throw new TypeError(
    `${routeName} must export an Express router function.`
  );
};

// =========================================================
// NORMALIZE ROUTERS
// =========================================================

const otpRouter =
  getRouter(
    otpRoutes,
    "otpRoutes"
  );

const locationRouter =
  getRouter(
    locationRoutes,
    "locationRoutes"
  );

const wasteReportsRouter =
  getRouter(
    wasteReportsRoutes,
    "wasteReports"
  );

const citizenRouter =
  getRouter(
    citizenRoutes,
    "citizenRoutes"
  );

const organizationRouter =
  getRouter(
    organizationRoutes,
    "organizationRoutes"
  );

const responseRouter =
  getRouter(
    responseRoutes,
    "responseRoutes"
  );

// =========================================================
// APP
// =========================================================

const app =
  express();

// =========================================================
// CONFIG
// =========================================================

const PORT =
  process.env.PORT ||
  5000;

const FRONTEND_URL =
  process.env.FRONTEND_URL ||
  "http://localhost:5173";

const mongoURI =
  process.env.MONGODB_URI;

const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY;

// =========================================================
// ENV VALIDATION
// =========================================================

if (!mongoURI) {
  console.error(
    "❌ MONGODB_URI is missing in .env"
  );

  process.exit(1);
}

if (!GEMINI_API_KEY) {
  console.warn(
    "⚠️ GEMINI_API_KEY is missing in .env"
  );
} else {
  console.log(
    "🔑 Gemini API Key: LOADED"
  );
}

// =========================================================
// MIDDLEWARE
// =========================================================

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

// =========================================================
// STATIC UPLOADS
// =========================================================

app.use(
  "/uploads",
  express.static(
    path.join(
      __dirname,
      "public/uploads"
    )
  )
);

// =========================================================
// API ROUTES
// =========================================================

app.use(
  "/api/locations",
  locationRouter
);

app.use(
  "/api/waste-reports",
  wasteReportsRouter
);

app.use(
  "/api/otp",
  otpRouter
);

app.use(
  "/api/citizen",
  citizenRouter
);

// =========================================================
// ORGANIZATION API
// =========================================================

app.use(
  "/api/organizations",
  organizationRouter
);

// =========================================================
// RESPONSE API
// =========================================================

app.use(
  "/api/response",
  responseRouter
);
// =========================================================
// ADMIN AUTH API
// =========================================================

app.use(
  "/api/admin-auth",
  adminAuthRoutes
);
// =========================================================
// HEALTH
// =========================================================

app.get(
  "/",
  (
    req,
    res
  ) => {
    res.status(200).json({
      success: true,

      project:
        "SWACHHLENS",

      message:
        "SWACHHLENS Backend is Running!",

      version:
        "1.0.0",

      status:
        "online",

      frontend:
        FRONTEND_URL,
    });
  }
);

// =========================================================
// API STATUS
// =========================================================

app.get(
  "/api",
  (
    req,
    res
  ) => {
    res.status(200).json({
      success: true,

      message:
        "SWACHHLENS API is operational.",

      services: {
        wasteReports:
          "active",

        locations:
          "active",

        emailOTP:
          "active",

        citizen:
          "active",

        organizations:
          "active",

        response:
          "active",

        aiAnalysis:
          GEMINI_API_KEY
            ? "active"
            : "not configured",

        riskEngine:
          "active",

        predictionEngine:
          "active",

        responsePlanner:
          "active",

        cleanupVerification:
          "coming soon",
      },
    });
  }
);

// =========================================================
// 404
// =========================================================

app.use(
  (
    req,
    res
  ) => {
    res.status(404).json({
      success: false,

      message:
        "API endpoint not found.",

      path:
        req.originalUrl,
    });
  }
);

// =========================================================
// ERROR HANDLER
// =========================================================

app.use(
  (
    err,
    req,
    res,
    next
  ) => {
    console.error(
      "❌ Server Error:",
      err
    );

    res.status(500).json({
      success: false,

      message:
        err?.message ||
        "Internal server error.",
    });
  }
);

// =========================================================
// START SERVER
// =========================================================

const startServer =
  async () => {
    try {
      console.log(
        "🔄 Connecting to MongoDB..."
      );

      await mongoose.connect(
        mongoURI,
        {
          serverSelectionTimeoutMS:
            10000,
        }
      );

      console.log(
        "🍃 MongoDB Connected Successfully"
      );

      app.listen(
        PORT,
        () => {
          console.log("");

          console.log(
            "========================================"
          );

          console.log(
            "♻️ SWACHHLENS"
          );

          console.log(
            "🤖 AI Waste-Response Intelligence System"
          );

          console.log(
            "========================================"
          );

          console.log(
            `🚀 Server: http://localhost:${PORT}`
          );

          console.log(
            `📡 API: http://localhost:${PORT}/api`
          );

          console.log(
            `📍 Locations: http://localhost:${PORT}/api/locations`
          );

          console.log(
            `♻️ Reports: http://localhost:${PORT}/api/waste-reports`
          );

          console.log(
            `📧 OTP: http://localhost:${PORT}/api/otp`
          );

          console.log(
            `👤 Citizen: http://localhost:${PORT}/api/citizen`
          );

          console.log(
            `🏛️ Organizations: http://localhost:${PORT}/api/organizations`
          );

          console.log(
            `🤝 Response: http://localhost:${PORT}/api/response`
          );

          console.log(
            `🤖 AI: http://localhost:${PORT}/api/waste-reports/analyze-image`
          );

          console.log(
            `🖼️ Uploads: http://localhost:${PORT}/uploads`
          );

          console.log(
            "========================================"
          );

          console.log("");
        }
      );
    } catch (
      error
    ) {
      console.error(
        "❌ MongoDB Connection Error:",
        error
      );

      process.exit(1);
    }
  };

startServer();
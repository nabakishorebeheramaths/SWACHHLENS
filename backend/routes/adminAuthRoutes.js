const express = require("express");

const {
  ADMIN_COOKIE_NAME,
  createAdminToken,
  requireAdminAuth,
} = require(
  "../middleware/adminAuth"
);

const router =
  express.Router();


// =========================================================
// ADMIN LOGIN
// =========================================================

router.post(
  "/login",
  (
    req,
    res
  ) => {

    try {

      const email =
        String(
          req.body?.email ||
            ""
        ).trim();

      const password =
        String(
          req.body?.password ||
            ""
        );


      const adminEmail =
        String(
          process.env.SWACHHLENS_ADMIN_EMAIL ||
            ""
        ).trim();

      const adminPassword =
        String(
          process.env.SWACHHLENS_ADMIN_PASSWORD ||
            ""
        );


      if (
        !adminEmail ||
        !adminPassword
      ) {

        return res.status(500).json({
          success: false,
          authenticated: false,
          message:
            "SWACHHLENS admin credentials are not configured.",
        });

      }


      if (
        email.toLowerCase() !==
          adminEmail.toLowerCase() ||
        password !==
          adminPassword
      ) {

        return res.status(401).json({
          success: false,
          authenticated: false,
          message:
            "Invalid admin email or password.",
        });

      }


      const token =
        createAdminToken();


      res.cookie(
        ADMIN_COOKIE_NAME,
        token,
        {
          httpOnly: true,

          secure:
            process.env.NODE_ENV ===
            "production",

          sameSite:
            process.env.NODE_ENV ===
            "production"
              ? "none"
              : "lax",

          maxAge:
            8 *
            60 *
            60 *
            1000,

          path: "/",
        }
      );


      return res.status(200).json({
        success: true,
        authenticated: true,
        message:
          "SWACHHLENS Admin login successful.",
      });

    } catch (error) {

      console.error(
        "❌ Admin Login Error:",
        error
      );

      return res.status(500).json({
        success: false,
        authenticated: false,
        message:
          "Unable to process admin login.",
      });

    }
  }
);


// =========================================================
// CHECK AUTH
// =========================================================

router.get(
  "/me",
  requireAdminAuth,
  (
    req,
    res
  ) => {

    return res.status(200).json({
      success: true,
      authenticated: true,
      role: "swachhlens_admin",
    });

  }
);


// =========================================================
// LOGOUT
// =========================================================

router.post(
  "/logout",
  (
    req,
    res
  ) => {

    res.clearCookie(
      ADMIN_COOKIE_NAME,
      {
        httpOnly: true,

        secure:
          process.env.NODE_ENV ===
          "production",

        sameSite:
          process.env.NODE_ENV ===
          "production"
            ? "none"
            : "lax",

        path: "/",
      }
    );


    return res.status(200).json({
      success: true,
      authenticated: false,
      message:
        "SWACHHLENS Admin logged out.",
    });

  }
);


module.exports = router;
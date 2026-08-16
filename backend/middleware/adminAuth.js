const crypto = require("crypto");

const ADMIN_COOKIE_NAME =
  "swachhlens_admin_token";

const getAdminSecret = () => {
  return (
    process.env.SWACHHLENS_ADMIN_SECRET ||
    "swachhlens-development-secret"
  );
};


// =========================================================
// CREATE ADMIN TOKEN
// =========================================================

const createAdminToken = () => {

  const timestamp =
    Date.now().toString();

  const random =
    crypto.randomBytes(32).toString("hex");

  const payload =
    `${timestamp}.${random}`;

  const signature =
    crypto
      .createHmac(
        "sha256",
        getAdminSecret()
      )
      .update(payload)
      .digest("hex");

  return `${payload}.${signature}`;
};


// =========================================================
// VERIFY ADMIN TOKEN
// =========================================================

const verifyAdminToken = (
  token
) => {

  if (!token) {
    return false;
  }

  const parts =
    token.split(".");

  if (
    parts.length !== 3
  ) {
    return false;
  }

  const [
    timestamp,
    random,
    signature,
  ] = parts;

  const payload =
    `${timestamp}.${random}`;

  const expectedSignature =
    crypto
      .createHmac(
        "sha256",
        getAdminSecret()
      )
      .update(payload)
      .digest("hex");

  if (
    !crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    )
  ) {
    return false;
  }

  // 8-hour admin session
  const tokenAge =
    Date.now() -
    Number(timestamp);

  if (
    !Number.isFinite(tokenAge) ||
    tokenAge >
      8 * 60 * 60 * 1000
  ) {
    return false;
  }

  return true;
};


// =========================================================
// PARSE COOKIE
// =========================================================

const getCookie =
  (
    req,
    cookieName
  ) => {

    const cookieHeader =
      req.headers.cookie;

    if (!cookieHeader) {
      return null;
    }

    const cookies =
      cookieHeader
        .split(";")
        .map(
          (cookie) =>
            cookie.trim()
        );

    const target =
      cookies.find(
        (cookie) =>
          cookie.startsWith(
            `${cookieName}=`
          )
      );

    if (!target) {
      return null;
    }

    return decodeURIComponent(
      target.substring(
        cookieName.length + 1
      )
    );
  };


// =========================================================
// ADMIN AUTH MIDDLEWARE
// =========================================================

const requireAdminAuth = (
  req,
  res,
  next
) => {

  const token =
    getCookie(
      req,
      ADMIN_COOKIE_NAME
    );

  if (
    !verifyAdminToken(
      token
    )
  ) {

    return res.status(401).json({
      success: false,
      authenticated: false,
      message:
        "Admin authentication required.",
    });

  }

  req.adminAuthenticated =
    true;

  next();
};


module.exports = {
  ADMIN_COOKIE_NAME,
  createAdminToken,
  verifyAdminToken,
  requireAdminAuth,
};
import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    let token;

    // 1. Try from cookie (WEB)
    if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    // 2. Try from header (API / Mobile)
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};


export const optionalAuth = (req, res, next) => {
  try {
    let token;

    // 1. Try from cookie (WEB)
    if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
    }

    // 2. Try from header (API / Mobile)
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
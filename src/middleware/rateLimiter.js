import rateLimiter from "../config/upstash.js";

const rateLimiterMiddleware = async (req, res, next) => {
  try {

    const { success } = await rateLimiter.limit("my-rate-limit")

    if (!success) {
      return res.status(429).json({ message: "Too many requests, please try again later." });
    }
    next(); // Proceed to the next middleware or route handler if the request is allowed
    
  } catch (error) {
    console.error("Rate limiter error:", error);
    next(error); // Pass the error to the next middleware
  }
}

export default rateLimiterMiddleware;
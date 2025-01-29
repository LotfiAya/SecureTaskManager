require("dotenv").config();

module.exports = {
  port: process.env.PORT ,
  dbPath: process.env.DB_PATH ,
  sessionSecret: process.env.SESSION_SECRET ,
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Limit each IP to 10 requests per windowMs
    message: "Too many attempts, please try again later.",
  },
  env: process.env.NODE_ENV ,
};

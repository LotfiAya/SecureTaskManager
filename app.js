const express = require("express");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const config = require("./config/config");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const logger = require("./utils/logger");
const authMiddleware = require("./middlewares/authMiddleware"); 

const path = require("path")

const app = express();
app.use(express.static("public"));

const csrfProtection = csrf({ cookie: true });

//Basic Middleware (security & JSON support)
app.use(helmet());
app.use(express.json());
app.use(cookieParser());


// SESSION 
app.use(
  session({
    store: new FileStore({
      path: path.join(__dirname, "data"), // Dossier où stocker les sessions
      fileExtension: ".json",
      retries: 0,
    }),
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: config.env === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);
app.use("/", authRoutes);

// CSRF Protection 
app.use(csrfProtection);
app.use((req, res, next) => {
  res.cookie("XSRF-TOKEN", req.csrfToken());
  next();
});


// Protected Routes (Require authentication)
app.use(authMiddleware); 
app.use("/protected", express.static("private"));
app.use("/", taskRoutes);

app.listen(config.port, () =>
  logger.info(`Server running on http://localhost:${config.port}`)
);

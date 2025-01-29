const authMiddleware = (req, res, next) => {
  console.log("Session Data:", req.session); //  Debug: Voir si la session existe

  if (!req.session.user) {
    return res.status(401).json({ errors: "Unauthorized" });
  }
  next();
};

module.exports = authMiddleware;

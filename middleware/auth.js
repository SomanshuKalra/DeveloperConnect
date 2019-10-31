const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = (req, res, next) => {
  //Get token from  request header
  const token = req.header("x-auth-token");

  //Check if not token, return 401 status if token invalid
  if (!token) {
    return res
      .status(401)
      .json({ error: "Token unavailable, unable to authorize" });
  }

  //Verify token
  try {
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    req.user = decoded.user;
    next();
  } catch (err) {
    console.log(err.message);
    res.status(401).json({ error: "Token is invalid" });
  }
};

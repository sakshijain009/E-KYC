// Middleware to verify its an Verifier
exports.verifyAdmin = (req, res, next) => {
  try {
    if (req.user.usertype === "Verifier") {
      next();
    } else {
      res.status(403).json({ error: "The user is not an Verifier" });
    }
  } catch (error) {
    res.status(401).json({ error: "Please authenticate using a valid token" });
  }
};

// Middleware to verify its an LOB
exports.verifyLOB = (req, res, next) => {
  try {
    if (req.user.usertype === "LOB") {
      next();
    } else {
      res.status(403).json({ error: "The user is not a LOB" });
    }
  } catch (error) {
    res.status(401).json({ error: "Please authenticate using a valid token" });
  }
};

// Middleware to verify its an Customer
exports.verifyCustomer = (req, res, next) => {
  try {
    if (req.user.usertype === "Customer") {
      next();
    } else {
      res.status(403).json({ error: "The user is not a Customer" });
    }
  } catch (error) {
    res.status(401).json({ error: "Please authenticate using a valid token" });
  }
};

// Middleware to verify its an LOB or VERIFIER
exports.verifyBankOfficial = (req, res, next) => {
  try {
    if (req.user.usertype === "LOB" || req.user.usertype === "Verifier") {
      next();
    } else {
      res.status(403).json({ error: "The user is not an LOB or Verifier" });
    }
  } catch (error) {
    res.status(401).json({ error: "Please authenticate using a valid token" });
  }
};

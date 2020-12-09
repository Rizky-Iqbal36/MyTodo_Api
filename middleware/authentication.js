const jwt = require("jsonwebtoken");

const key = process.env.JWT_key;

exports.authentication = (req, res, next) => {
  let header, token;

  if (
    !(header = req.header("Authorization")) ||
    !(token = header.replace("Bearer ", ""))
  ) {
    return res.status(400).send({
      error: {
        message: "Access denied",
      },
    });
  }
  try {
    const verified = jwt.verify(token, key);

    req.user = verified;
    next();
  } catch (err) {
    console.log(err);
    res.status(400).send({
      error: {
        message: "Invalid token",
      },
    });
  }
};

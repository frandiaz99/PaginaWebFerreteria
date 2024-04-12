const jwt = require("jsonwebtoken");


const jwtSecret =  "daa1dc6519bff687520b8dd1e6c0fd60cfbb06d7693be9cfbcea56053a52f5f5482701";



exports.adminAuth = (req, res, next) => {
  const token = req.cookies.jwt
  if (token) {
    jwt.verify(token, jwtSecret, (err, decodedToken) => {
      console.log (decodedToken);
      if (err) {
        return res.status(401).json({ message: "Not authorized" })
      } else {
        if (decodedToken.role < 3) {
          return res.status(401).json({ message: "Not authorized" })
        } else {
          req.body.Auth = {"_id": decodedToken.id, "role": decodedToken.role };
          next()
        }
      }
    })
  } else {
    return res
      .status(401)
      .json({ message: "Not authorized, token not available" })
  }
}





exports.workerAuth = (req, res, next) => {
  const token = req.cookies.jwt
  if (token) {
    jwt.verify(token, jwtSecret, (err, decodedToken) => {
      console.log (decodedToken);
      if (err) {
        return res.status(401).json({ message: "Not authorized" })
      } else {
        if (decodedToken.role < 2) {
          return res.status(401).json({ message: "Not authorized" })
        } else {
          req.body.Auth = {"_id": decodedToken.id, "role": decodedToken.role };
          next()
        }
      }
    })
  } else {
    return res
      .status(401)
      .json({ message: "Not authorized, token not available" })
  }
}











exports.userAuth = (req, res, next) => {
  const token = req.cookies.jwt
  if (token) {
    jwt.verify(token, jwtSecret, (err, decodedToken) => {
      console.log (decodedToken);
      if (err) {
        return res.status(401).json({ message: "Not authorized" })
      } else {
        if (decodedToken.role < 1) {
          return res.status(401).json({ message: "Not authorized" })
        } else {
          req.body.Auth = {"_id": decodedToken.id, "role": decodedToken.role };
          next()
        }
      }
    })
  } else {
    return res
      .status(401)
      .json({ message: "Not authorized, token not available" })
  }
}
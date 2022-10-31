// this application is made to make sure, every call is secured. every call has a valid token
// in this app, we will check if the token is valid?
// after varification, will give the user access to it
const express = require("express");
const app = express();
const { expressjwt: jwt } = require("express-jwt");
var jwks = require("jwks-rsa");
const jwtAuthz = require("express-jwt-authz");

var jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: "https://dev-t0z5riiv7fd8q4cw.us.auth0.com/.well-known/jwks.json",
  }),
  audience: "http://localhost:5600",
  issuer: "https://dev-t0z5riiv7fd8q4cw.us.auth0.com/",
  algorithms: ["RS256"],
});

app.get("/public", (req, res) => {
  res.json({
    type: "Public",
  });
});

//jwt middleware checking if the request has a token
app.use(jwtCheck);

app.get("/membership", jwtCheck, (req, res) => {
  res.json("Your Journey");
});

app.listen(5600);

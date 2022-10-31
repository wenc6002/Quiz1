var express = require("express");
var router = express.Router();
const { requiresAuth } = require("express-openid-connect");
const axios = require("axios");

router.get("/", (req, res) => {
  let isAuthenticated = req.oidc.isAuthenticated();
  res.render("index", {
    title: "Your Pet Temporary Home",
    isAuthenticated: isAuthenticated,
  });
});

//trigger the endpoint, and call the middleware, if the user is logged in or not
router.get("/membership", requiresAuth(), async (req, res) => {
  let data = {};
  const { token_type, access_token } = req.oidc.accessToken;

  try {
    // calling the server to get the data, make sure you get the data before moving forward(async, await)
    const apiResponse = await axios.get("http://localhost:5600/membership", {
      headers: {
        authorization: `${token_type} ${access_token}`,
      },
    });
    data = apiResponse.data;
  } catch (e) {
    console.log(e);
  }
  console.log(access_token);
  //when there is no error, you will be redirected to the secured page with the data you get from the api
  res.render("membership", {
    title: "Membership",
    isAuthenticated: req.oidc.isAuthenticated(),
    data,
  });
});

router.get("/about_us", (req, res) => {
  res.render("about_us", { title: "My Team" });
});

module.exports = router;

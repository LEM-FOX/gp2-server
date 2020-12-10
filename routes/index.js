const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("hi from router");
});

module.exports = router;

const express = require("express");
const router = express.Router();

router.use("/posts", require("./postRoutes"));
router.use("/users", require("./userRoutes"));

module.exports = router;

const express = require("express");
const {
	registerUser,
	authUser,
	allUsers,
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");
//router is used to create diff routes
const router = express.Router();

//this is the extended route for app.use in server.js
//registerUser is the func to occur in api call
//protect is middleware to check whether auth is done or not
router.route("/").post(registerUser).get(protect, allUsers);
// instead of seperately wringing post &get
// router.route("/").get(allUsers)
//similar
router.post("/login", authUser);

module.exports = router;

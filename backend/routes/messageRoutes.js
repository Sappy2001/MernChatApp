const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { sendMessage } = require("../controllers/messageControllers");
const { allMessages } = require("../controllers/messageControllers");
const router = express.Router();

//route for sending messages
router.route("/").post(protect, sendMessage);

//route for fetching chats of that id
router.route("/:chatId").get(protect, allMessages);

module.exports = router;

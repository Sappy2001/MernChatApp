const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
	accessChat,
	fetchChats,
	createGroupChat,
	renameGroup,
	addToGroup,
	removeFromGroup,
	deleteGroup,
} = require("../controllers/chatControllers");

const router = express.Router();

//posting data to chatdb
//protect is a middlewear
router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);
//creating groupchats
router.route("/group").post(protect, createGroupChat);
//updating the groupchatname so put request
router.route("/rename").put(protect, renameGroup);
//adding and removing from group
router.route("/groupadd").put(protect, addToGroup);
router.route("/groupremove").put(protect, removeFromGroup);
router.route("/deleteGroup").put(protect, deleteGroup);

module.exports = router;

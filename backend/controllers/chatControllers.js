const asyncHandler = require("express-async-handler");

const Chat = require("../Models/chatModel");
const User = require("../Models/userModel");

const accessChat = asyncHandler(async (req, res) => {
	//req.usr_id is sender
	//userId is the receiver
	const { userId } = req.body;

	if (!userId) {
		return res.status(400).send("UserID param not send");
	}

	//returns empty array or array  data
	//if chat exist b/w sender and receiver
	var isChat = await Chat.find({
		isGroupChat: false,
		//and operation means both needs to be true
		$and: [
			//elemMatch used to find atleast 1 match
			//if users[] in Userdb has req.user._id and also userId present
			//eq means equals
			{ users: { $elemMatch: { $eq: req.user._id } } },

			{ users: { $elemMatch: { $eq: userId } } },
		],
	}) //get the user data and message except password
		.populate("users", "-password")
		.populate("latestMessage");

	//this is to populate senders data in latest chat
	isChat = await User.populate(isChat, {
		path: "latestMessage.sender",
		//things to populate inside it
		select: "name pic email",
	});

	if (isChat.length > 0) {
		res.send(isChat[0]);
	}
	//if chat not present we create new chat
	else {
		var chatData = {
			chatName: "sender",
			isGroupChat: false,
			users: [req.user._id, userId],
		};
		try {
			//create chat
			const createdChat = await Chat.create(chatData);
			//get the full chat of the user
			const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
				"users",
				"-password"
			);
			res.status(200).send(FullChat);
		} catch (err) {
			res.status(400);
			throw new Error(err.message);
		}
	}
});

const fetchChats = asyncHandler(async (req, res) => {
	try {
		//find all the chats for current user"
		Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
			.populate("users", "-password")
			.populate("groupAdmin", "-password")
			.populate("latestMessage")
			//sort new to old
			.sort({ updatedAt: -1 })
			.then(async (results) => {
				//this is to populate senders data in latest message
				results = await User.populate(results, {
					path: "latestMessage.sender",
					select: "name pic email",
				});
				res.status(200).send(results);
			});
	} catch (error) {
		res.status(400);
		throw new Error(error.message);
	}
});

const createGroupChat = asyncHandler(async (req, res) => {
	if (!req.body.users || !req.body.name) {
		return res.status(400).send({ message: "Please fill all fields" });
	}

	//users would be send in stringify format which needs to be parsed
	var users = JSON.parse(req.body.users);

	if (users.length < 2) {
		return res
			.status(400)
			.send({ message: "Needs more than 2 users for group chat" });
	}
	users.push(req.user);

	try {
		const groupChat = await Chat.create({
			chatName: req.body.name,
			users: users,
			isGroupChat: true,
			groupAdmin: req.user,
		});
		const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
			//show the users and admin
			.populate("users", "-password")
			.populate("groupAdmin", "-password");

		res.status(200).json(fullGroupChat);
	} catch (error) {
		res.status(400).send({ message: error });
	}
});

const renameGroup = asyncHandler(async (req, res) => {
	const { chatId, chatName } = req.body;

	const updatedChat = await Chat.findByIdAndUpdate(
		//finds by parameter
		chatId,
		{
			//update parameter
			//(chatName=chatName) since both are same
			chatName,
		},
		{
			//returns the new updated value
			new: true,
		}
	)
		.populate("users", "-password")
		.populate("groupAdmin", "-password");

	if (!updatedChat) {
		res.status(404);
		throw new Error("Chat not Found");
	} else {
		res.json(updatedChat);
	}
});

const addToGroup = asyncHandler(async (req, res) => {
	const { chatId, userId } = req.body;
	const added = await Chat.findByIdAndUpdate(
		//finds by parameter
		chatId,
		{
			//update parameter
			//pushing in new user
			$push: { users: userId },
		},
		//returns the new updated value
		{ new: true }
	)
		.populate("users", "-password")
		.populate("groupAdmin", "-password")
		.lean();
	if (!added) {
		res.status(400);
		throw new Error("chat not found");
	} else {
		res.json(added);
	}
});

const removeFromGroup = asyncHandler(async (req, res) => {
	const { chatId, userId } = req.body;
	const removed = await Chat.findByIdAndUpdate(
		//finds by parameter
		chatId,
		{
			//update parameter
			//pulling out user
			$pull: { users: userId },
		},
		{ new: true }
	)
		.populate("users", "-password")
		.populate("groupAdmin", "-password");

	if (!removed) {
		res.status(400);
		throw new Error("chat not found");
	} else {
		res.json(removed);
	}
});

const deleteGroup = asyncHandler(async (req, res) => {
	const { chatId, userId, isAdmin } = req.body;
	console.log("chatID is", chatId, isAdmin);
	if (isAdmin) {
		console.log("chatID is", chatId, isAdmin);
		const removed = await Chat.deleteOne(
			//finds by parameter
			{ _id: chatId }
		);

		if (!removed) {
			res.status(400);
			throw new Error("chat not found");
		} else {
			console.log("deleted", removed);
			res.json({ message: "Chat deleted successfully" });
		}
	} else {
		// User exits the group
		const updatedChat = await Chat.findByIdAndUpdate(
			chatId,
			{ $pull: { users: userId } },
			{ new: true }
		)
			.populate("users", "-password")
			.populate("groupAdmin", "-password")
			.lean(); // Ensuring the result is a plain JavaScript object

		if (!updatedChat) {
			res.status(400);
			throw new Error("Chat not found");
		} else {
			console.log(updatedChat, "removed");
			res.json(updatedChat);
		}
	}
});

module.exports = {
	accessChat,
	fetchChats,
	createGroupChat,
	renameGroup,
	addToGroup,
	removeFromGroup,
	deleteGroup,
};

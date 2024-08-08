const asyncHandler = require("express-async-handler");
const Message = require("../Models/messageModel");
const User = require("../Models/userModel");
const Chat = require("../Models/chatModel");

const sendMessage = asyncHandler(async (req, res) => {
	//to sendmessage we need sender(user loggedIn), reciever(chatId) and the text(content)
	const { content, chatId } = req.body;
	console.log(content, chatId);
	if (!content || !chatId) {
		console.log("invalid message data");
		res.sendStatus(400);
	}
	var newMessage = {
		sender: req.user._id,
		content: content,
		chat: chatId,
	};
	try {
		var message = await Message.create(newMessage);

		//here message is document instance its not a mongoose query
		message = await message.populate("sender", "name pic");
		console.log("After populating sender:", message);
		message = await message.populate("chat");
		console.log("After populating chat:", message);

		//this is used to populate details inside the Chat model user obj as its refer to User model
		message = await User.populate(message, {
			//the part to populate
			path: "chat.users",
			select: "name pic email",
		});
		console.log("After populating chat.users:", message);
		await Chat.findByIdAndUpdate(req.body.chatId, {
			latestMessage: message,
		});
		res.json(message);
	} catch (error) {
		res.status(400);
		throw new Error(error.message);
	}
});

//fetch all mesaages for a particular chat

const allMessages = asyncHandler(async (req, res) => {
	try {
		const messages = await Message.find({ chat: req.params.chatId })
			.populate("sender", "name email pic")
			.populate("chat");
		res.json(messages);
	} catch (error) {
		res.status(400);
		throw new Error(error.message);
	}
});
module.exports = { sendMessage, allMessages };

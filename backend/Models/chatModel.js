//install mongoose
//used to connect to MongoDb & make queries
const mongoose = require("mongoose");
const chatModel = mongoose.Schema(
	{
		chatName: { type: String, trim: true },
		isGroupChat: { type: Boolean, default: false },
		//users would be an array of objects
		users: [
			//consist of obj id refferance from User db
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		latestMessage: {
			//consist of obj id refferance from Message db
			type: mongoose.Schema.Types.ObjectId,
			ref: "Message",
		},

		groupAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	},
	//whenever new data is added will consist of timeStamp
	{
		timestamps: true,
	}
);

//name of the module and data in it
const Chat = mongoose.model("Chat", chatModel);
module.exports = Chat;

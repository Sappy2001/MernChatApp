//importing express
const express = require("express");
const { chats } = require("./data");
//importing dependemcy to read .env file
const dotenv = require("dotenv");
const connectDB = require("./config/db");
//creating insatnce of express
const app = express();
//need to restart server everytime to see changes
const chatRoutes = require("./routes/chatRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const messageRoutes = require("./routes/messageRoutes.js");
//use to give colors to terminal lines
const colors = require("colors");
const { notFound, errorHandler } = require("./middleware/errorMiddleWare.js");

//configuring dependency
dotenv.config();
connectDB();

//to accept json data from frontend
app.use(express.json());

app.get("/", (req, res) => {
	//sends data to homepage as response
	res.send("api is running");
});

app.use("/api/chat", chatRoutes);

//userRoutes uses express router
app.use("/api/user", userRoutes);

//messageRoutes
app.use("/api/message", messageRoutes);

//used for error handling
//goes if doesnt match with any routes above
app.use(notFound);
app.use(errorHandler);

//using the .env file with process func
const PORT = process.env.PORT || 7000;
//listening to the server 7000,cmd-"node filename"
const server = app.listen(
	PORT,
	console.log(`server started at ${PORT}`.red.bold)
);

const io = require("socket.io")(server, {
	//the socket will wait for 100s for messages then will be off
	pingTimeout: 100000,
	//to prevent cors error
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST", "PUT"],
	},
});

// using socket for realtime message updation
io.on("connection", (socket) => {
	//it will clg once socket.io-client is installed in frntend
	console.log("connected to socket io");

	//gets userdata from singleChat useEffect
	socket.on("setup", (userData) => {
		socket.join(userData.id);
		socket.emit("connected");
	});

	//creating a room and takes chatId
	socket.on("join chat", (room) => {
		socket.join(room._id);
		console.log("User joined Room:" + room._id);
	});

	//creating socket for messagess,receives form singleChat
	socket.on("new message", (newMessageRecieved) => {
		var chat = newMessageRecieved.chat;
		if (!chat.users) return console.log("no users present");
		chat.users.forEach((users) => {
			if (users._id === newMessageRecieved.sender._id) return;
			socket.in(users._id).emit("message recieved", newMessageRecieved);
		});
	});
	//socket for detecting typing action
	socket.on("typing", (room) => {
		socket.in(room).emit("typing");
		console.log("typ");
	});

	socket.on("stop typing", (room) => {
		socket.in(room).emit("stop typing");
		console.log("no-typ");
	});
});

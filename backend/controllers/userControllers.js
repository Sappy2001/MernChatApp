// to handle errors automatically in controllers
const asyncHandler = require("express-async-handler");
const User = require("../Models/userModel");
const generateToken = require("../config/generateToken");

const registerUser = asyncHandler(async (req, res) => {
	const { name, email, password, pic } = req.body;

	if (!name || !email || !password) {
		res.status(400);
		//custom error
		throw new Error("please enter all fields");
	}

	//to check if userexist with email-mongo query
	const userExist = await User.findOne({ email });
	if (userExist) {
		res.status(400);
		throw new Error("user already exist");
	}

	//create user using the model structure
	const user = await User.create({
		name,
		email,
		password,
		pic,
	});

	//the _id is generated from Mdb after creation
	//the  "_" in _id shows its the primary key
	if (user) {
		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			pic: user.pic,
			//for converting the id to jwt token
			token: generateToken(user._id),
		});
	} else {
		res.status(400);
		throw new Error("Failed to create user");
	}
});

const authUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email });
	//the user got func from userModel.methods
	if (user && (await user.matchPassword(password))) {
		res.json({
			id: user._id,
			name: user.name,
			email: user.email,
			pic: user.pic,
			//for converting the id to jwt token
			token: generateToken(user._id),
		});
	} else {
		res.status(400);
		throw new Error("Password is not correct");
	}
});

const allUsers = asyncHandler(async (req, res) => {
	// api/user?search=piyus(everything after ? is query )
	const keyword = req.query.search
		? {
				//performing or operation in mongodb
				$or: [
					//wether name or email consist the keyword
					//regex helps filtering in mongo
					//"i" makes the sting case insensitive
					{ name: { $regex: req.query.search, $options: "i" } },
					{ email: { $regex: req.query.search, $options: "i" } },
				],
		  }
		: {};
	//find the users with the keyword
	//but exclude the current user=ne:not equal
	// req.user is getting from protect middleware
	const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
	console.log(req.user._id);
	res.send(users);
});

module.exports = { registerUser, authUser, allUsers };

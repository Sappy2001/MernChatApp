const asyncHandler = require("express-async-handler");
const User = require("../Models/userModel");
const jwt = require("jsonwebtoken");

const protect = asyncHandler(async (req, res, next) => {
	let token;
	if (
		//if header has authorization and starts with word bearer
		req.headers.authorization &&
		req.headers.authorization.startsWith("bearer")
	) {
		try {
			// header:bearer fkqlw132bbb,thats why splitiing and getting token
			token = req.headers.authorization.split(" ")[1];
			//verifying it with jwtr secret
			const decoded = jwt.verify(token, process.env.JWT_secret);
			//find the user and return without passwrod "-"
			//this is send as request to allUser or chatRoutes
			req.user = await User.findById(decoded.id).select("-password");
			//check for authentication goes to next step
			//allUser routes
			next();
		} catch (error) {
			res.status(400);
			throw new Error("Not authorization,token failed");
		}
	}
	if (!token) {
		res.status(401);
		throw new Error("not authorized,no token");
	}
});

module.exports = { protect };

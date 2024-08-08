//if user1===loggeedUser then chatname is user2 else viceversa
export const getSender = (loggedUser, users) => {
	return users[0].name === loggedUser.name ? users[1].name : users[0].name;
};

//if user1===loggeedUser then object is user2 else viceversa
export const getSenderFull = (loggedUser, users) => {
	return users[0].name === loggedUser.name ? users[1] : users[0];
};

export const sameSender = (m, i, messages, user) => {
	return (
		//checking the 2nd last message
		i < messages.length - 1 &&
		//check if next msg is not same sender
		(messages[i + 1].sender._id !== m.sender._id ||
			messages[i + 1].sender._id === undefined) &&
		messages[i].sender._id !== user.id
	);
};

export const lastMessage = (i, messages, user) => {
	return (
		//checking the 2nd last message
		i === messages.length - 1 &&
			//check if next msg is not same sender
			messages[messages.length - 1].sender._id !== user.id &&
			messages[messages.length - 1].sender._id
			? true
			: false
	);
};

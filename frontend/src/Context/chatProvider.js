import { useNavigate } from "react-router-dom";

const { createContext, useContext, useEffect, useState } = require("react");
const ChatContext = createContext();
const ChatProvider = ({ children }) => {
	const navigate = useNavigate();
	const [user, setUser] = useState({});
	const [selectedChat, setSelectedChat] = useState();
	const [chats, setChats] = useState([]);
	const [notification, setNotification] = useState([]);

	useEffect(() => {
		console.log(user);
		const userInfo = JSON.parse(localStorage.getItem("userInfo"));
		setUser(userInfo);
		if (!userInfo) {
			navigate("/home");
		}
	}, [navigate]);
	return (
		<ChatContext.Provider
			value={{
				user,
				setUser,
				chats,
				setChats,
				selectedChat,
				setSelectedChat,
				notification,
				setNotification,
			}}
		>
			{children}
		</ChatContext.Provider>
	);
};

export const ChatState = () => {
	return useContext(ChatContext);
};

export default ChatProvider;

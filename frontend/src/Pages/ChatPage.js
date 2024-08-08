import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChatState } from "../Context/chatProvider";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import ChatBox from "../components/miscellaneous/ChatBox";
import MyChats from "../components/miscellaneous/MyChats";
const ChatPage = () => {
	const { user } = ChatState();
	const [chats, setChats] = useState([]);
	// const fetchChats = async () => {
	//   const { data } = await axios.get('/api/chats');
	//   setChats(data);
	// };
	// useEffect(() => {
	//   // fetchChats();
	// }, []);
	const [fetchAgain, setFetchAgain] = useState();
	return (
		<div style={{ width: "100%" }}>
			{user && <SideDrawer />}

			<Box
				display="flex"
				justifyContent="space-around"
				w="100%"
				height="91vh"
				padding="10px"
			>
				{user && <MyChats fetchAgain={fetchAgain} />}
				{user && (
					<ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
				)}
			</Box>
		</div>
	);
};

export default ChatPage;

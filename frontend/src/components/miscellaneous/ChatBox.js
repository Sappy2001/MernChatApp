import React from "react";
import { ChatState } from "../../Context/chatProvider";
import { Box } from "@chakra-ui/react";
import SingleChat from "./SingleChat";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
	const { selectedChat } = ChatState();
	return (
		<Box
			display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
			width={{ base: "100%", md: "66%" }}
			justifyContent="center"
			alignItems="center"
			flexDir="column"
			bgColor="white"
			borderRadius="lg"
			borderWidth="1px"
			maxH="100%"
			mr={3}
		>
			<SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
		</Box>
	);
};

export default ChatBox;

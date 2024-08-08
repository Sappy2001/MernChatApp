import React, { useEffect, useState } from "react";
import { ChatState } from "../../Context/chatProvider";
import { Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import { getSender } from "../../config/chatLogics";
import GroupChatModal from "./GroupChatModal";

const MyChats = ({ fetchAgain }) => {
	const [loggedUser, setLoggedUser] = useState();
	//getting it from context api
	const { user, chats, setChats, selectedChat, setSelectedChat } = ChatState();
	const [loading, setLoading] = useState(true);

	//when page reloaded the value stored in states are lost-user is null so
	useEffect(() => {
		console.log(user);
		const userInfo = JSON.parse(localStorage.getItem("userInfo"));
		console.log(userInfo);
		if (userInfo) {
			setLoggedUser(userInfo);
		}
		fetchChats();
	}, [user, fetchAgain]);

	const toast = useToast();
	//fetch all chats for the user
	const fetchChats = async () => {
		try {
			const config = {
				headers: {
					//initailly user ,after reloading loggedUser
					Authorization: `bearer ${!user ? loggedUser.token : user.token}`,
				},
			};
			const { data } = await axios.get("/api/chat", config);
			console.log(data);
			setChats(data);
			setLoading(false);
		} catch (error) {
			toast({
				title: "Failed to fetch chats",
				status: "error",
				description: error.message,
				duration: 5000,
				isClosable: true,
				position: "top-left",
			});
		}
	};
	// useEffect(() => {
	//   setLoggedUser(JSON.parse(localStorage.getItem('userInfo')));

	//   console.log(loggedUser);
	//   fetchChats();
	// }, [setChats]);

	return (
		<Box
			display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
			p={3}
			bg="#72c3cd"
			flexDir="column"
			w={{ base: "100%", md: "31%" }}
			borderRadius="lg"
			borderWidth="1px"
		>
			{/* for heading */}
			<Box
				p={3}
				width="100%"
				mb="5px"
				fontSize={{ base: "28px", md: "30px" }}
				fontFamily="Work sans"
				alignItems="center"
				justifyContent="space-between"
				display="flex"
				top={0}
			>
				My Chats
				<GroupChatModal>
					{/* this button is the children elem */}
					<Button
						display="flex"
						fontSize={{ base: "17px", md: "10px", lg: "17px" }}
						rightIcon={<AddIcon />}
					>
						New Group Chat
					</Button>
				</GroupChatModal>
			</Box>
			{/* for sender & group chat */}
			<Box
				display="flex"
				p={3}
				bg="#edf2f7"
				w="100%"
				borderRadius="lg"
				overflow="hidden"
				flexDir="column"
			>
				{loading ? (
					<ChatLoading />
				) : chats.length > 0 ? (
					<Stack overflowY="scroll">
						{chats.map((chat) => (
							<Box
								width="100%"
								onClick={() => {
									setSelectedChat(chat);
								}}
								cursor="pointer"
								bg={selectedChat === chat ? "#38b2ac" : "#E8E8E8"}
								color={selectedChat === chat ? "white" : "black"}
								px={3}
								py={2}
								mb={3}
								borderRadius="lg"
								key={chat._id}
							>
								<Text>
									{!chat.isGroupChat
										? getSender(loggedUser, chat.users)
										: chat.chatName}
								</Text>
							</Box>
						))}
					</Stack>
				) : (
					<Text>No chat available</Text>
				)}
			</Box>
		</Box>
	);
};

export default MyChats;

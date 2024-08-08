import React, { useEffect, useState } from "react";
import { ChatState } from "../../Context/chatProvider";
import {
	Box,
	FormControl,
	IconButton,
	Input,
	Spinner,
	Text,
	useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getSender, getSenderFull } from "../../config/chatLogics";
import ProfileModal from "./ProfileModal";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import "./style.css";
import animationData from "./Animations/typing.json";
import Lottie from "react-lottie";

const ENDPOINT = "http://localhost:7000";
var socket, selectedChatCompare;
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
	const toast = useToast();
	const [messages, setMessages] = useState([]);
	const [newMessage, setNewMessage] = useState();
	const [loading, setLoading] = useState(false);
	const [typing, setTyping] = useState(false);
	const [isTyping, setIsTyping] = useState(false);
	const [socketConnected, setSocketConnected] = useState(false);
	const { user, setSelectedChat, selectedChat, notification, setNotification } =
		ChatState();
	const defaultOptions = {
		loop: true,
		autoplay: true,
		animationData: animationData,
		renderSettings: {
			preseveAspectRation: "xMidyMid slice",
		},
	};

	const fetchMessage = async () => {
		if (!selectedChat) return;
		try {
			setLoading(true);
			const config = {
				headers: {
					Authorization: `bearer ${user.token}`,
				},
			};

			const { data } = await axios.get(
				`/api/message/${selectedChat._id}`,
				config
			);
			console.log(data);
			setMessages(data);
			setLoading(false);
			//joins the socket room when a chat is selected
			socket.emit("join chat", selectedChat);
		} catch (error) {
			toast({
				title: "Error occured",
				status: "error",
				description: " Failed to load messages",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
		}
	};

	const sendMessage = async (event) => {
		if (event.key === "Enter" && newMessage) {
			try {
				//as its post call so Content-type is required
				const config = {
					headers: {
						"Content-Type": "application/json",
						Authorization: `bearer ${user.token}`,
					},
				};
				//as its async call so data will be passed in axios
				setNewMessage("");
				const { data } = await axios.post(
					"/api/message",
					{
						content: newMessage,
						chatId: selectedChat._id,
					},
					config
				);

				console.log(data);
				socket.emit("new message", data);
				setMessages([...messages, data]);
			} catch (err) {
				toast({
					title: "Error occured",
					status: "error",
					description: err.message,
					duration: 5000,
					isClosable: true,
					position: "bottom",
				});
			}
		}
	};
	const typingHandler = (e) => {
		setNewMessage(e.target.value);
		if (!socketConnected) return;
		if (!typing) {
			setTyping(true);
			socket.emit("typing", selectedChat._id);
		}
		//taking the lastTyped time
		let lastTypingTime = new Date().getTime();
		let timerLength = 3000;
		//after 3s still no typing then stop typing
		setTimeout(() => {
			var timeNow = new Date().getTime();
			var timeDiff = timeNow - lastTypingTime;
			if (timeDiff >= timerLength) socket.emit("stop typing", selectedChat._id);
			setTyping(false);
		}, timerLength);
	};

	//useEffect to initialize socket in frontend
	useEffect(() => {
		//endPoint to connect with backend (send recieve)messages
		socket = io(ENDPOINT);
		socket.emit("setup", user);
		socket.on("connected", () => setSocketConnected(true));
		socket.on("typing", () => {
			setIsTyping(true);
		});
		socket.on("stop typing", () => {
			setIsTyping(false);
		});
	}, []);
	//useEffect to fetch messages
	useEffect(() => {
		fetchMessage();
		selectedChatCompare = selectedChat;
	}, [selectedChat]);

	//useffect to get messages send
	useEffect(() => {
		//gets data from soket("new message")
		socket.on("message recieved", (messageRecieved) => {
			if (selectedChatCompare._id === messageRecieved.chat._id) {
				setMessages([...messages, messageRecieved]);
			} else if (
				//when the message dosent comes from selectedchat
				selectedChatCompare ||
				selectedChatCompare._id !== messageRecieved.chat._id
			) {
				if (!notification.includes(messageRecieved)) {
					setNotification([messageRecieved, ...notification]);
					setFetchAgain(!fetchAgain);
				}
			}
		});
	});
	//sends user data to server with name setup

	return (
		<>
			{selectedChat ? (
				<>
					<Text
						fontSize={{ base: "28px", md: "30px" }}
						mt={2}
						mb={1}
						px={3}
						w="100%"
						display="flex"
						justifyContent="space-between"
						alignItems="center"
					>
						<IconButton
							display={{ base: "flex", md: "none" }}
							icon={<ArrowBackIcon />}
							onClick={() => {
								setSelectedChat("");
							}}
						/>
						{!selectedChat.isGroupChat ? (
							<>
								{getSender(user, selectedChat.users)}
								<ProfileModal user={getSenderFull(user, selectedChat.users)} />
							</>
						) : (
							<>
								{selectedChat.chatName.toUpperCase()}
								<UpdateGroupChatModal
									user={getSenderFull(user, selectedChat.users)}
									fetchAgain={fetchAgain}
									setFetchAgain={setFetchAgain}
									fetchMessage={fetchMessage}
								/>
							</>
						)}
					</Text>
					<Box
						display="flex"
						flexDir="column"
						justifyContent="flex-end"
						mx={3}
						mb={2}
						w="96%"
						h="92%"
						bg="#dfdfdf"
						borderRadius="lg"
					>
						{loading ? (
							<Spinner
								size="xl"
								alignSelf="center"
								margin="auto"
								w={20}
								h={20}
								thickness="4px"
								speed="0.6s"
								emptyColor="gray.100"
								color="blue.500"
							/>
						) : (
							<div className="messages">
								<ScrollableChat messages={messages} user={user} />
							</div>
						)}
						<FormControl onKeyDown={sendMessage} m={1} mt={3} width="92%">
							{isTyping ? (
								<div style={{ position: "relative" }}>
									<Lottie
										options={defaultOptions}
										width={70}
										style={{
											marginBottom: 15,
											marginTop: 5,
											marginLeft: 0,
										}}
									/>
								</div>
							) : (
								<></>
							)}
							<Input
								variant="filled"
								bg="#E0E0E0"
								placeholder="Enter a message"
								onChange={typingHandler}
								value={newMessage}
							/>
						</FormControl>
					</Box>
				</>
			) : (
				<Box
					display="flex"
					justifyContent="center"
					alignItems="center"
					fontFamily="Work sans"
					fontSize="24px"
				>
					Click on a user to start chatting
				</Box>
			)}
		</>
	);
};

export default SingleChat;

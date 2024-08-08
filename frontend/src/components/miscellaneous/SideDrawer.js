import {
	Avatar,
	Box,
	Button,
	Drawer,
	DrawerBody,
	DrawerCloseButton,
	DrawerContent,
	DrawerHeader,
	DrawerOverlay,
	Input,
	Menu,
	MenuButton,
	MenuDivider,
	MenuItem,
	MenuList,
	Spinner,
	Text,
	Tooltip,
	useDisclosure,
	useToast,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from "../../Context/chatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import UserItem from "./UserAvatar/UserItem";
import { getSender } from "../../config/chatLogics";
import { Effect } from "react-notification-badge";
import NotificationBadge from "react-notification-badge";
const SideDrawer = () => {
	const [search, setSearch] = useState("");
	const [searchResult, setSearchResult] = useState([]);
	const [loading, setLoading] = useState(false);
	const [loadingChat, setLoadingChat] = useState();

	//for opening and closing drawer
	const { isOpen, onOpen, onClose } = useDisclosure();
	//for drawer placement
	const [placement, setPlacement] = useState("left");
	//useRef hook used to focus on iput when drawer is opened
	const firstField = useRef();

	const toast = useToast();

	const navigate = useNavigate();
	const {
		user,
		chats,
		setChats,
		selectedChat,
		setSelectedChat,
		notification,
		setNotification,
	} = ChatState();

	//function for searching on clicking go
	const handleSearch = async () => {
		if (!search) {
			toast({
				title: "Search cant be empty",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "top-left",
			});
		} else {
			try {
				setLoading(true);
				const config = {
					headers: {
						Authorization: `bearer ${user.token}`,
					},
				};
				const { data } = await axios.get(`/api/user?search=${search}`, config);
				setSearchResult(data);
				console.log(searchResult);
				setLoading(false);
			} catch (error) {
				toast({
					title: "Error Occured",
					status: "error",
					description: error.message,
					duration: 5000,
					isClosable: true,
					position: "top-left",
				});
			}
		}
	};

	//fuction for create/acess existing  chat onclick username
	const acessChat = async (userId) => {
		try {
			setLoadingChat(true);
			const config = {
				headers: {
					"Content-type": "application/json",
					Authorization: `bearer ${user.token}`,
				},
			};
			const { data } = await axios.post("/api/chat", { userId }, config);
			//if chat does not exist
			if (!chats.find((c) => c._id === data._id)) {
				setChats([data, ...chats]);
			}
			setSelectedChat(data);
			setLoadingChat(false);
			onClose();
		} catch (error) {
			toast({
				title: "Error Occured",
				status: "error",
				description: error.message,
				duration: 5000,
				isClosable: true,
				position: "top-left",
			});
		}
	};
	//fuction for logging out
	const logoutHandler = () => {
		toast({
			title: "Logout Successful",
			status: "success",
			duration: 5000,
			isClosable: true,
			position: "bottom",
		});
		localStorage.removeItem("userInfo");
		navigate("/home");
	};
	return (
		<>
			<Box
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				bg="#72c3cd"
				p="5px 10px"
				w="99%%"
				borderWidth="5px"
				borderRadius="5px"
				margin="2px"
			>
				<Tooltip
					label="Search users to the chat"
					hasArrow
					placeContent="bottom-end"
				>
					<Button variant="ghost" onClick={onOpen}>
						<i class="fa-solid fa-magnifying-glass"></i>
						<Text
							display={{
								base: "none",
								md: "flex",
							}}
							px="4"
						>
							Search User
						</Text>
					</Button>
				</Tooltip>
				<Drawer
					placement={placement}
					onClose={onClose}
					isOpen={isOpen}
					initialFocusRef={firstField}
				>
					<DrawerOverlay />
					<DrawerContent>
						<DrawerCloseButton />
						<DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
						<DrawerBody>
							<Box>
								<Input
									ref={firstField}
									id="username"
									placeholder="Enter username or Email"
									onChange={(e) => setSearch(e.target.value)}
								/>
								<Button
									colorScheme="green"
									marginTop="5px"
									onClick={handleSearch}
								>
									Go
								</Button>
								{loading ? (
									<ChatLoading />
								) : (
									<div>
										<h3>Results</h3>
										<div>
											{searchResult?.map((user) => (
												<UserItem
													key={user._id}
													user={user}
													handleFunction={() => acessChat(user._id)}
												/>
											))}
										</div>
									</div>
								)}
								{/* if loadingChat is true */}
								{loadingChat && (
									<Spinner
										thickness="3px"
										speed="0.6s"
										emptyColor="gray.200"
										color="blue.500"
										size="lg"
									/>
								)}
							</Box>
						</DrawerBody>
					</DrawerContent>
				</Drawer>
				<Text fontSize="2xl" fontFamily="Work sans">
					Talk-A-Tive
				</Text>
				<div>
					<Menu>
						<MenuButton p={1}>
							<NotificationBadge
								count={notification.length}
								effect={Effect.Scale}
							/>
							<BellIcon fontSize="2xl" m={1} />
						</MenuButton>
						<MenuList pl={2}>
							{!notification.length && "No new messages"}
							{notification.map((notif) => (
								<MenuItem
									key={notif._id}
									onClick={() => {
										setSelectedChat(notif.chat);
										setNotification(notification.filter((n) => n !== notif));
									}}
								>
									{notif.chat.isGroupChat
										? `New message in ${notif.chat.chatName}`
										: `New message from ${getSender(user, notif.chat.users)}`}
								</MenuItem>
							))}
						</MenuList>
					</Menu>
					<Menu>
						<MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
							<Avatar
								size="sm"
								cursor="pointer"
								alt={user.name}
								src={user.pic}
							></Avatar>
						</MenuButton>
						<MenuList bg="#7dc6cfb0" color="#05727f">
							<ProfileModal user={user}>
								{/* MenuItem is the children prop send */}
								<MenuItem>My Profile</MenuItem>
							</ProfileModal>
							<MenuDivider />
							<MenuItem onClick={logoutHandler}>LogOut</MenuItem>
						</MenuList>
					</Menu>
				</div>
			</Box>
		</>
	);
};

export default SideDrawer;

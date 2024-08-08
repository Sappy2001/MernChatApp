import { ViewIcon } from "@chakra-ui/icons";
import {
	Box,
	Button,
	FormControl,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Spinner,
	useDisclosure,
	useToast,
} from "@chakra-ui/react";
import UserItemBadge from "./UserAvatar/UserItemBadge";
import React, { useState } from "react";
import { ChatState } from "../../Context/chatProvider";
import axios from "axios";
import UserItem from "./UserAvatar/UserItem";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessage }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { selectedChat, setSelectedChat, user } = ChatState();
	const [loading, setLoading] = useState(false);
	const [renameGroup, setRenameGroup] = useState("");
	const [searchResult, setSearchResult] = useState([]);
	const [renameLoading, setRenameLoading] = useState(false);
	const toast = useToast();

	const handleRemove = async (delUser) => {
		//if user is not an admin
		if (selectedChat.groupAdmin._id !== user.id) {
			toast({
				title: "Only admin can add or remove participants",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "top-left",
			});
			return;
		}
		if (user.id === delUser._id) {
			toast({
				title: "Cant remove yourself",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "top-left",
			});
			return;
		}
		try {
			setLoading(true);
			const config = {
				headers: {
					Authorization: `bearer ${user.token}`,
				},
			};
			const { data } = await axios.put(
				"/api/chat/groupremove",
				{
					chatId: selectedChat._id,
					userId: delUser._id,
				},
				config
			);
			setSelectedChat(data);
			fetchMessage();
			setFetchAgain(!fetchAgain);
			setLoading(false);
			toast({
				title: "User removed successfully",
				status: "success",
				duration: 5000,
				isClosable: true,
				position: "top-left",
			});
		} catch (error) {
			toast({
				title: "Error adding user",
				description: error.response.data.message,
				status: "error",
				duration: 20000,
				isClosable: true,
				position: "top-left",
			});
		}
	};
	const handleAdd = async (addUser) => {
		//if user is already present
		if (selectedChat.users.find((u) => u._id === addUser._id)) {
			toast({
				title: "User Alredy present in the group",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "top-left",
			});
			return;
		}
		//if user is not an admin
		if (selectedChat.groupAdmin._id !== user.id) {
			toast({
				title: "Only admin can add or remove participants",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "top-left",
			});
			return;
		}
		try {
			setLoading(true);
			console.log(selectedChat._id, addUser._id);
			const config = {
				headers: {
					Authorization: `bearer ${user.token}`,
				},
			};
			const { data } = await axios.put(
				"/api/chat/groupadd",
				{
					chatId: selectedChat._id,
					userId: addUser._id,
				},
				config
			);
			setSelectedChat(data);
			setFetchAgain(!fetchAgain);
			setLoading(false);
			toast({
				title: "User added successfully",
				status: "success",
				duration: 5000,
				isClosable: true,
				position: "top-left",
			});
		} catch (error) {
			toast({
				title: "Error adding user",
				description: error.response.data.message,
				status: "error",
				duration: 20000,
				isClosable: true,
				position: "top-left",
			});
			console.log(error.response.data.message);
		}
	};
	const handleRename = async () => {
		if (!renameGroup) return;
		try {
			setRenameLoading(true);
			const config = {
				headers: {
					Authorization: `bearer ${user.token} `,
				},
			};
			const { data } = await axios.put(
				"/api/chat/rename",
				{
					chatId: selectedChat._id,
					chatName: renameGroup,
				},
				config
			);
			setSelectedChat(data);
			setFetchAgain(!fetchAgain);
			setRenameLoading(false);
			setRenameGroup("");
			onClose();
			toast({
				title: "Group Chat Renamed Successfully",
				status: "success",
				duration: 5000,
				isClosable: true,
				position: "top-left",
			});
		} catch (error) {
			toast({
				title: "Error occured",
				status: "error",
				description: error.response.data.message,
				duration: 5000,
				isClosable: true,
				position: "top-left",
			});
		}
	};
	const handleSearch = async (query) => {
		if (!query) {
			return;
		}
		try {
			setLoading(true);
			const config = {
				headers: {
					Authorization: `bearer ${user.token}`,
				},
			};
			const { data } = await axios.get(`/api/user?search=${query}`, config);
			console.log(data);
			setSearchResult(data);
			setLoading(false);
		} catch (error) {
			toast({
				title: "Error occured",
				status: "error",
				description: "Failed to search",
				duration: 5000,
				isClosable: true,
				position: "top-left",
			});
		}
	};
	const isAdmin = selectedChat.groupAdmin._id === user.id;
	const exitGroup = async () => {
		try {
			setLoading(true);
			const config = {
				headers: {
					Authorization: `bearer ${user.token}`,
				},
			};

			const { data } = await axios.put(
				"/api/chat/deleteGroup",
				{
					chatId: selectedChat._id,
					userId: user.id,
					isAdmin: isAdmin,
				},
				config
			);

			setSelectedChat();
			setFetchAgain(!fetchAgain);
			setLoading(false);
			onClose();
			toast({
				title: isAdmin
					? "Group deleted successfully"
					: "Group Left successfully",
				status: "success",
				duration: 5000,
				isClosable: true,
				position: "top-left",
			});
		} catch (error) {
			console.log(error);
			toast({
				title: "Error leaving Chat",
				description: error.response.data.message,
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "top-left",
			});
		}
	};
	return (
		<>
			<Button onClick={onOpen}>
				<ViewIcon />
			</Button>

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>{selectedChat.chatName}</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						{selectedChat.users?.map((u, i) => (
							<UserItemBadge
								key={u._id}
								user={u}
								index={i}
								handleFunction={() => handleRemove(u)}
							/>
						))}
						<FormControl
							display="flex"
							my={3}
							flexDir="column"
							justifyContent="space-between"
						>
							<Box mb={2}>
								<Input
									type="text"
									placeholder="Chat Name"
									width="70%"
									mr={2}
									onChange={(e) => setRenameGroup(e.target.value)}
								/>
								<Button
									colorScheme="blue"
									variant="outline"
									isLoading={renameLoading}
									onClick={handleRename}
								>
									Update
								</Button>
							</Box>
							<div>
								<Input
									type="text"
									placeholder="Search and add User"
									width="70%"
									mr={2}
									onChange={(e) => handleSearch(e.target.value)}
								/>
							</div>
						</FormControl>
						{loading ? (
							<Spinner
								thickness="2px"
								speed="0.6s"
								emptyColor="gray.200"
								color="blue.500"
								size="md"
							/>
						) : (
							<>
								{searchResult.map((user) => (
									<UserItem
										key={user._id}
										user={user}
										handleFunction={() => handleAdd(user)}
									/>
								))}
							</>
						)}
					</ModalBody>

					<ModalFooter>
						<Button colorScheme="red" onClick={exitGroup}>
							{isAdmin ? "Delete" : "Exit"} Group
							<i
								class="fa-solid fa-arrow-right-from-bracket"
								style={{ margin: "2px 0px 0px 5px " }}
							></i>
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default UpdateGroupChatModal;

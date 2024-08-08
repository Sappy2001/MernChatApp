import {
	Button,
	FormControl,
	FormLabel,
	Input,
	InputGroup,
	InputRightElement,
	VStack,
	useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";

import axios from "axios";
import { ChatState } from "../../Context/chatProvider";
import { useNavigate } from "react-router-dom";
const Signup = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [show, setShow] = useState(false);

	const [pic, setPic] = useState("");
	const [loading, setLoading] = useState(false);

	//its a notification box at bottom
	const toast = useToast();

	const { setUser } = ChatState();
	const navigate = useNavigate();

	const postDetails = (image) => {
		setLoading(true);
		if (image === undefined) {
			toast({
				title: "Please Select an image",
				status: "warning",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
			setLoading(false);
			return;
		}

		if (image.type === "image/jpeg" || image.type === "image/png") {
			//setting a formdata for image
			const data = new FormData();
			data.append("file", image);
			data.append("upload_preset", "myChat");
			data.append("cloud_name", "dmkhehcxk");

			fetch("https://api.cloudinary.com/v1_1/dmkhehcxk/upload", {
				method: "POST",
				body: data,
			})
				.then((res) => res.json())
				.then((data) => {
					setPic(data.url.toString());
					setLoading(false);
				})
				.catch((err) => {
					console.log(err);
					setLoading(false);
				});
		} else {
			toast({
				title: "Please Select an image",
				status: "warning",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
			setLoading(false);

			return;
		}
	};

	const submitHandler = async () => {
		setLoading(true);
		if (!name || !email || !password || !confirmPassword) {
			toast({
				title: "Please fill all fields",
				status: "warning",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
			setLoading(false);
		}
		if (password !== confirmPassword) {
			toast({
				title: "Please type similar password",
				status: "warning",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
			setLoading(false);
		}
		try {
			const config = {
				headers: {
					"Content-type": "application/json",
				},
			};
			const { data } = await axios.post(
				"/api/user",
				{ name, email, password, pic },
				config
			);
			//to make sure chatprovider has the user value when it gets set
			setUser(data);
			toast({
				title: "Registration Successful",
				status: "success",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
			localStorage.setItem("userInfo", JSON.stringify(data));
			setLoading(false);

			//push to the chats page
			navigate("/chats");
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<VStack spacing="5px">
			<FormControl id="name" isRequired>
				<FormLabel>Name </FormLabel>
				<Input
					placeholder="Enter Your Name"
					onChange={(e) => setName(e.target.value)}
				/>
			</FormControl>
			<FormControl id="email" isRequired>
				<FormLabel>Email </FormLabel>
				<Input
					placeholder="Enter Your Email address"
					onChange={(e) => setEmail(e.target.value)}
				/>
			</FormControl>
			<FormControl id="password" isRequired>
				<FormLabel>Password </FormLabel>
				<InputGroup>
					<Input
						type={show ? "text" : "password"}
						placeholder="Enter Your Password"
						onChange={(e) => setPassword(e.target.value)}
					/>
					<InputRightElement width="4.5em">
						<Button h="1.75em" size="sm" onClick={() => setShow(!show)}>
							{show ? "Hide" : "Show"}
						</Button>
					</InputRightElement>
				</InputGroup>
			</FormControl>
			<FormControl id="cpassword" isRequired>
				<FormLabel>Confirm Password </FormLabel>
				<InputGroup>
					<Input
						type={show ? "text" : "password"}
						placeholder="Re-Enter Your Password"
						onChange={(e) => setConfirmPassword(e.target.value)}
					/>
					<InputRightElement width="4.5em">
						<Button h="1.75em" size="sm" onClick={() => setShow(!show)}>
							{show ? "Hide" : "Show"}
						</Button>
					</InputRightElement>
				</InputGroup>
			</FormControl>
			<FormControl id="pic">
				<FormLabel>Upload Your Picture </FormLabel>

				<Input
					type="file"
					p={1.5}
					//--"/*":called wildcard char(accepts all types of img files)
					accept="image/*"
					placeholder="Provide your pic"
					//if many img is selected it will only take first image
					onChange={(e) => postDetails(e.target.files[0])}
					// onChange={e => <CloudinaryUploadWidget uwConfig={uwConfig} />}
				/>
			</FormControl>
			<Button
				colorScheme="blue"
				width="100%"
				color="white"
				onClick={submitHandler}
				isLoading={loading}
			>
				Sign Up
			</Button>
		</VStack>
	);
};

export default Signup;

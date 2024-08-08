import React, { useEffect, useState } from "react";
import {
	Container,
	Box,
	Text,
	Tabs,
	TabList,
	TabPanels,
	Tab,
	TabPanel,
} from "@chakra-ui/react";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
	const [user, setUser] = useState();
	const navigate = useNavigate();

	useEffect(() => {
		const userinfo = JSON.parse(localStorage.getItem("userInfo"));
		setUser(userinfo);
		if (userinfo) {
			navigate("/chats");
			console.log(navigate, "loggedin");
		}
	}, []);
	//if user redirects to homepage and is Loggedin then navigate to chat
	if (user) {
		navigate("/chats");
		console.log(navigate, "loggedin");
	} else {
		return (
			<Container maxW="xl" centerContent>
				<Box
					d="flex"
					bg={"white"}
					p="3"
					justifyContent="center"
					w="100%"
					borderRadius="lg"
					borderWidth="2px"
					m="40px 0 5px 0"
					color="black"
				>
					<Text
						fontSize="4xl"
						color="black"
						textAlign="center"
						fontWeight="600"
						fontFamily="Work sans"
					>
						Talk-A-tive
					</Text>
					<Tabs variant="soft-rounded" colorScheme="blue">
						<TabList marginBottom="1em">
							<Tab w="50%">Login</Tab>
							<Tab w="50%">Sign Up</Tab>
						</TabList>
						<TabPanels>
							<TabPanel>
								<Login />
							</TabPanel>
							<TabPanel>
								<Signup />
							</TabPanel>
						</TabPanels>
					</Tabs>
				</Box>
			</Container>
		);
	}
};

export default HomePage;

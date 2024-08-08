import { CloseIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";
import React from "react";

const colors = ["purple", "blue", "green", "orange", "red", "teal"];
const UserItemBadge = ({ user, handleFunction, index }) => {
	const bgColor = colors[index % colors.length];
	return (
		<Button
			px={2}
			py={2}
			borderRadius="lg"
			m={1}
			mb={2}
			fontSize={14}
			variant="solid"
			colorScheme={bgColor}
			cursor="pointer"
		>
			{user.name}
			<CloseIcon pl={1} mt="5px" onClick={handleFunction} />
		</Button>
	);
};

export default UserItemBadge;

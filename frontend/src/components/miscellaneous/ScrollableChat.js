import ScrollableFeed from "react-scrollable-feed";
import { lastMessage, sameSender } from "../../config/chatLogics";
import { Avatar, Tooltip } from "@chakra-ui/react";
const ScrollableChat = ({ messages, user }) => {
	return (
		<ScrollableFeed>
			{messages &&
				messages.map((m, i) => (
					<div style={{ display: "flex", position: "relative" }} key={m._id}>
						{(sameSender(m, i, messages, user) ||
							lastMessage(i, messages, user)) && (
							<Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
								<Avatar
									mt="7px"
									ml={1}
									size="sm"
									cursor="pointer"
									name={m.sender.name}
									src={m.sender.pic}
									position="absolute"
								/>
							</Tooltip>
						)}
						<span
							style={{
								backgroundColor: `${
									m.sender._id !== user.id ? "#BEE3F8" : "#B9F5D0"
								}`,
								position: "relative",
								margin: "10px 35px",
								marginLeft: `${m.sender._id !== user.id ? "40px" : "auto"}`,

								borderRadius: "20px",
								padding: "5px 15px",
								maxWidth: "75%",
							}}
						>
							{m.content}
						</span>
					</div>
				))}
		</ScrollableFeed>
	);
};

export default ScrollableChat;

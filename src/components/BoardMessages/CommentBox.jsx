import { Box, IconButton } from "@mui/material";

import MessageInput from "../MessagesPage/MessageInput";
import CompressIcon from "@mui/icons-material/Compress";
import CommentCard from "./CommentCard";

const CommentBox = ({ setOncomments }) => {
	return (
		<Box sx={{ backgroundColor: "rgba(0, 0, 0, 0.2)", p: 1 }}>
			<MessageInput />
			<CommentCard />
			<CommentCard />
			<CommentCard />

			<Box sx={{ display: "flex", justifyContent: "center" }}>
				<IconButton onClick={() => setOncomments((prev) => !prev)}>
					<CompressIcon />
				</IconButton>
			</Box>
		</Box>
	);
};

export default CommentBox;

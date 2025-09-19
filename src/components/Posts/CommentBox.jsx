import { Box, IconButton } from "@mui/material";

import MessageInput from "../MessagesPage/MessageInput";
import CompressIcon from "@mui/icons-material/Compress";
import { cozyEmeraldGreen } from "../../lib/colorsConst";
import useCommentSubscribe from "../../lib/supabaseSubscribers/useCommentSubscribe";
import { useCommentsStore } from "../../lib/zustand";
import PostCard from "./PostCard";

const CommentBox = ({ setOncomments, postId }) => {
	useCommentSubscribe(postId);
	const { comments } = useCommentsStore();
	let reversComments = [];
	if (comments[postId]) {
		reversComments = [...comments[postId]].reverse();
	}

	return (
		<Box sx={{ backgroundColor: "rgba(0, 0, 0, 0.5)", p: 2, m: 1, borderRadius: 1 }}>
			<MessageInput type="comment" chatId={postId} />
			{reversComments.map((comment) => {
				// return <CommentCard message={comment} key={comment.id} />;
				return <PostCard item={comment} type={"comment"} key={comment.id} />;
			})}

			<Box sx={{ display: "flex", justifyContent: "center" }}>
				<IconButton onClick={() => setOncomments((prev) => !prev)}>
					<CompressIcon />
				</IconButton>
			</Box>
		</Box>
	);
};

export default CommentBox;

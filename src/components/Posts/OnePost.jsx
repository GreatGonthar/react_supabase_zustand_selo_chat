import * as React from "react";
import { usePostsStore } from "../../lib/zustand";
import { useParams } from "react-router-dom";
import { usePostsSubscribe } from "../../lib/supabaseSubscribers/usePostsSubscribe";
import PostCard from "./PostCard";
import { Box, CircularProgress, Typography } from "@mui/material";
import { mainButton } from "../../lib/colorsConst";

const OnePost = () => {
	usePostsSubscribe();
	const { posts } = usePostsStore();
	const { params: targetId } = useParams();

	console.log(posts);
	const foundPost = posts.find((post) => post.id === targetId);
	if (posts.length === 0) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center">
				<Typography variant="h6" sx={{ color: mainButton }}>
					Загрузка поста
				</Typography>
			</Box>
		);
	}
	if (!foundPost) {
		return (
			<Box display="flex" justifyContent="center" alignItems="center">
				<Typography variant="h6" sx={{ color: mainButton }}>
					Пост не найден
				</Typography>
			</Box>
		);
	}
	return (
		<>
			<PostCard item={foundPost} type={"one_post"} />
		</>
	);
};

export default OnePost;

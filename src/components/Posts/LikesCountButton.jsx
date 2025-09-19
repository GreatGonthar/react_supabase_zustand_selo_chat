import {
	Avatar,
	Box,
	Button,
	Dialog,
	DialogContent,
	DialogTitle,
	Divider,
	IconButton,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Menu,
	MenuItem,
	Typography,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useEffect, useState } from "react";
import { mainButton, secondaryText2 } from "../../lib/colorsConst";
import { usePostsStore, useUsersStore } from "../../lib/zustand";
import { supabase } from "../../lib/supabase";
import FetchLikesPost from "./FetchLikesPost";

const LikesCountButton = ({ post_id }) => {
	const [open, setOpen] = useState(false);
	const { getReactions, setReactions } = usePostsStore();
	const { likes, dislikes } = getReactions(post_id);
	let count = likes + dislikes;
	return (
		<>
			<Button
				variant="contained"
				sx={{
					position: "relative",
					p: 0.4,
					ml: 1,
					minWidth: "auto",
					backgroundColor: secondaryText2,
					color: mainButton,
					"& .MuiSvgIcon-root": {
						fontSize: 16, // Уменьшаем размер иконок
					},
					"& .MuiTypography-root": {
						fontSize: 14, // Уменьшаем размер текста
						ml: 0.5, // Добавляем небольшой отступ
					},
					"&::after": {
						content: '""',
						position: "absolute",
						bottom: -8,
						left: "50%",
						transform: "translateX(-50%)",
						width: 0,
						height: 0,
						borderLeft: "8px solid transparent",
						borderRight: "8px solid transparent",
						borderTop: "8px solid",
						borderTopColor: secondaryText2,
						filter: "drop-shadow(0px 2px 1px rgba(0,0,0,0.4))",
						zIndex: 0,
					},
				}}
				onClick={() => setOpen((prev) => !prev)}
			>
				<FavoriteIcon />
				<PersonIcon />
				<Typography>{count}</Typography>
			</Button>
			{open && <FetchLikesPost post_id={post_id} open={open} setOpen={setOpen} />}
		</>
	);
};
export default LikesCountButton;

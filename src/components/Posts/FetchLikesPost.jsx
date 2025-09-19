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
import { red } from "@mui/material/colors";
import { useEffect, useState } from "react";
import { mainButton, secondaryText2 } from "../../lib/colorsConst";
import { usePostsStore, useUsersStore } from "../../lib/zustand";
import { supabase } from "../../lib/supabase";
import { useNavigate } from "react-router-dom";

const FetchLikesPost = ({ post_id, open, setOpen }) => {
	const navigate = useNavigate();
	const handleNavigate = (id) => {
		navigate(`/user/${id}`);
	};

	const [reactions, setReactions] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const { users } = useUsersStore();

	const fetchReactionsWithUsers = async () => {
		try {
			setLoading(true);
			setError(null);

			// Запрос к Supabase - получаем реакции с информацией о пользователях
			const { data, error: supabaseError } = await supabase
				.from("reactions")
				.select("type, user_id")
				.eq("post_id", post_id);

			if (supabaseError) {
				throw supabaseError;
			}

			setReactions(data || []);
		} catch (err) {
			console.error("Error fetching reactions:", err);
			setError("Не удалось загрузить реакции");
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		if (post_id) {
			fetchReactionsWithUsers();
		}
	}, [post_id]);
	const postLikes = ["коба", "мачет", "коба", "мачет"];
	return (
		<>
			<Dialog
				open={open}
				onClose={() => setOpen(false)}
				PaperProps={{
					sx: {
						backgroundColor: "#D8C6A5",
					},
				}}
			>
				<DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pl: 3 }}>
					реакции ({reactions.length})
					<IconButton onClick={() => setOpen(false)}>
						<CloseIcon />
					</IconButton>
				</DialogTitle>

				<DialogContent dividers>
					{reactions.length === 0 ? (
						<Typography variant="body2" color="text.secondary" align="center">
							Загрузка лайков...
						</Typography>
					) : (
						<List>
							{reactions.map((like, index) => (
								<>
									<ListItem key={like.user_id} sx={{ pl: 0 }}>
										<ListItemAvatar>
											<Button onClick={() => handleNavigate(like.user_id)}>
												<Avatar
													src={users[like.user_id].avatar_url}
													alt={users[like.user_id].username}
													sx={{ width: 48, height: 48 }}
												/>
											</Button>
										</ListItemAvatar>
										<ListItemText
											primary={users[like.user_id].username}
											secondary={users[like.user_id].email}
										/>
										{like.type === "like" ? (
											<FavoriteIcon sx={{ color: red[500], width: 32, height: 32 }} />
										) : (
											<Typography variant="body2" sx={{ fontSize: "1.5em" }}>
												{String.fromCodePoint(129314)}
											</Typography>
										)}
									</ListItem>
								</>
							))}
						</List>
					)}
				</DialogContent>
			</Dialog>
		</>
	);
};
export default FetchLikesPost;

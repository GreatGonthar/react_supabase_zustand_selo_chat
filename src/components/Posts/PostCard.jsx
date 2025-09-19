import * as React from "react";
import CardActions from "@mui/material/CardActions";

import CardMedia from "@mui/material/CardMedia";

import {
	Avatar,
	Box,
	Collapse,
	CardHeader,
	IconButton,
	Card,
	CardContent,
	Typography,
	Button,
	Menu,
	MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ShareIcon from "@mui/icons-material/Share";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import CommentIcon from "@mui/icons-material/Comment";
import CompressIcon from "@mui/icons-material/Compress";
import { red, lime } from "@mui/material/colors";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthUserStore, useCommentsStore, useUsersStore } from "../../lib/zustand";
import MessageContent from "../MessagesPage/MessageContent";
import { useEffect, useRef, useState } from "react";

import CommentBox from "./CommentBox";
import FetchLikesCount from "./FetchLikesCount";

import { delMessage } from "../../lib/supabaseUtils";
import useCommentCountSubscribe from "../../lib/supabaseSubscribers/useCommentCountSubscribe";
import useCommentSubscribe from "../../lib/supabaseSubscribers/useCommentSubscribe";
import LikesCountButton from "./LikesCountButton";
import lightWood from "../../../public/img/light_wood.jpg";

const BoardCard = ({ item, type }) => {
	const { authUser } = useAuthUserStore();
	const navigate = useNavigate();
	const handleNavigate = (user) => {
		// setChangeUser(user);
		navigate(`/user/${user.id}`);
	};
	const { users, setUsers } = useUsersStore();
	const [expanded, setExpanded] = useState(false);
	const [hasOverflow, setHasOverflow] = useState(false);
	const [onComments, setOncomments] = useState(false);
	const [anchorEl, setAnchorEl] = useState(null);
	const openPostMenu = Boolean(anchorEl);
	const contentRef = useRef(null);
	const { commentsCount } = useCommentsStore();
	const handleMenuClick = (event) => {
		event.stopPropagation(); // Предотвращаем всплытие события

		setAnchorEl(event.currentTarget);
	};
	const handleDelete = () => {
		setAnchorEl(null);
		delMessage(type, item);
	};
	const handleRoute = () => {
		navigate(`/public/${item.id}`);
	};

	const handleShare = async () => {
		setAnchorEl(null);
		console.log("Поделиться постом:", item.id);
		try {
			// Копируем текущий URL страницы

			await navigator.share({
				title: "Село Селяново",
				text: `Пост от пользователя`, // Можно добавить текст поста
				url: `/public/${item.id}`,
			});
			// Показываем уведомление
			// setOpenSnackbar(true);

			// Автоматически скрываем через 2 секунды
			// setTimeout(() => setOpenSnackbar(false), 2000);
		} catch (err) {
			console.error("Ошибка при копировании:", err);
			await navigator.clipboard.writeText(`${window.location.href}/${item.id}`);
		}
	};
	useCommentCountSubscribe(item.id);
	useEffect(() => {
		const checkOverflow = () => {
			if (contentRef.current) {
				const hasOverflow = contentRef.current.scrollHeight > 400; // 120px - наша максимальная высота
				setHasOverflow(hasOverflow);
			}
		};

		checkOverflow();

		// Проверяем при изменении размера окна
		window.addEventListener("resize", checkOverflow);
		return () => window.removeEventListener("resize", checkOverflow);
	}, [item.id]); // Зависимость от контента
	// Загрузка количества комментариев

	return (
		<Card
			sx={{
				mb: 1,
				backgroundImage: `url(${lightWood})`,
				// backgroundSize: "cover",
				backgroundPosition: "center",
				backgroundRepeat: "repeat",
			}}
		>
			<CardHeader
				avatar={
					<Button onClick={() => handleNavigate(users[item.user_id])}>
						<Avatar alt="user" src={users[item.user_id].avatar_url} sx={{ width: 48, height: 48 }} />
					</Button>
				}
				action={
					<Box>
						{type !== "one_post" && (authUser?.id === item.user_id || type === "post") && (
							<Box>
								<IconButton aria-label="settings" sx={{ mt: 2 }} onClick={handleMenuClick}>
									<MoreVertIcon />
								</IconButton>

								<Menu
									anchorEl={anchorEl}
									open={openPostMenu}
									onClose={() => setAnchorEl(null)}
									onClick={() => setAnchorEl(null)}
									transformOrigin={{ horizontal: "right", vertical: "top" }}
									anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
									sx={{ display: "flex" }}
								>
									{type === "post" && <MenuItem onClick={handleRoute}>посмотреть пост</MenuItem>}
									{authUser?.id === item.user_id && (
										<MenuItem onClick={handleDelete}>
											{type === "post" ? "Удалить пост" : "Удалить комментарий"}
										</MenuItem>
									)}
								</Menu>
							</Box>
						)}
					</Box>
				}
				title={users[item.user_id].username}
				subheader={new Date(item.created_at).toLocaleString()}
				sx={{ pb: 0, pt: 1 }}
			/>
			<CardContent sx={{ pt: 0 }}>
				<Box
					ref={contentRef}
					sx={{
						maxHeight: expanded ? "none" : "400px", // Ограничение высоты когда свернуто
						overflow: "hidden",
						position: "relative",
						"&::after": expanded
							? {}
							: { content: '""', position: "absolute", bottom: 0, left: 0, right: 0, height: "10px" },
					}}
				>
					<MessageContent message={item} />
				</Box>
			</CardContent>

			{hasOverflow && (
				<Box sx={{ display: "flex", justifyContent: "center", mt: -3, mb: -3 }}>
					<IconButton
						onClick={() => setExpanded((prev) => !prev)}
						sx={{
							transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
							transition: "transform 0.3s",
						}}
					>
						<ExpandMoreIcon />
					</IconButton>
				</Box>
			)}

			{type !== "comment" && (
				<CardActions disableSpacing sx={{ display: "flex", justifyContent: "space-between" }}>
					<Box>
						<LikesCountButton post_id={item.id} />
						<FetchLikesCount post_id={item.id} currentUserId={authUser?.id} />
						<IconButton onClick={() => setOncomments((prev) => !prev)}>
							{onComments ? <CompressIcon /> : <CommentIcon />}
							<Typography variant="body2"> {commentsCount[item.id]}</Typography>
						</IconButton>
					</Box>

					<IconButton onClick={handleShare}>
						<ShareIcon />
					</IconButton>
				</CardActions>
			)}
			{onComments && <CommentBox setOncomments={setOncomments} postId={item.id} />}
		</Card>
	);
};

export default BoardCard;

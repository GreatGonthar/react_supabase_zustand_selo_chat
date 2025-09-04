import CardActions from "@mui/material/CardActions";

import CardMedia from "@mui/material/CardMedia";

import { Avatar, Box, Collapse, CardHeader, IconButton, Card, CardContent, Typography, Button } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ShareIcon from "@mui/icons-material/Share";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import CommentIcon from "@mui/icons-material/Comment";
import CompressIcon from "@mui/icons-material/Compress";
import { red, lime } from "@mui/material/colors";
import { NavLink, useNavigate } from "react-router-dom";
import { useUsersStore } from "../../lib/zustand";
import MessageContent from "../MessagesPage/MessageContent";
import { useEffect, useRef, useState } from "react";
import CommentCard from "./CommentCard";
import CommentBox from "./CommentBox";

const BoardCard = ({ item }) => {
	const navigate = useNavigate();
	const handleNavigate = (user) => {
		// setChangeUser(user);
		navigate(`/user/${user.id}`);
	};
	const { users, setUsers } = useUsersStore();
	const [expanded, setExpanded] = useState(false);
	const [hasOverflow, setHasOverflow] = useState(false);
	const [onComments, setOncomments] = useState(false);
	const contentRef = useRef(null);

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
	}, [item]); // Зависимость от контента
	return (
		<Card
			sx={{
				mb: 1,
				backgroundImage: "url(../public/light_wood.jpg)",
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
					<IconButton aria-label="settings" sx={{ mt: 2 }}>
						<MoreVertIcon />
					</IconButton>
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

			<CardActions disableSpacing sx={{ display: "flex", justifyContent: "space-between" }}>
				<Box>
					<IconButton sx={{ color: red[500] }}>
						<FavoriteIcon />
						<Typography variant="body2">8</Typography>
					</IconButton>
					<IconButton sx={{ color: lime[900] }}>
						<SentimentVeryDissatisfiedIcon />
						<Typography variant="body2">8</Typography>
					</IconButton>
					<IconButton onClick={() => setOncomments((prev) => !prev)}>
						{onComments ? <CompressIcon /> : <CommentIcon />}
					</IconButton>
				</Box>
				<IconButton>
					<ShareIcon />
				</IconButton>
			</CardActions>
			{onComments && <CommentBox setOncomments={setOncomments} />}
		</Card>
	);
};

export default BoardCard;

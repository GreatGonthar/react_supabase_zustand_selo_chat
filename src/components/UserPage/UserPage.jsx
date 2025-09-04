import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import PersonIcon from "@mui/icons-material/Person";
import { Box } from "@mui/material";
import { useAuthUserStore, useChangeUserStore, useChatsStore, useUsersStore } from "../../lib/zustand";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { createChat } from "../../lib/sendMessageToSupabase";
import { authButton, hover, links, mainButton, mainText, secondaryText, secondaryText2 } from "../../lib/colorsConst";

const UserPage = () => {
	const { authUser } = useAuthUserStore();
	const { users } = useUsersStore();
	const params = useParams().params;
	const navigate = useNavigate();
	const createNewChat = async () => {
		const chatId = await createChat(authUser.id, params);
		navigate(`/chat/${chatId}`);
	};
	const handleLogOut = () => {
		navigate(`/login`);
	};
	const handlePublics = () => {
		navigate(`/public`);
	};
	return (
		<>
			{users[params] ? (
				<Card sx={{ background: mainButton, color: mainText }}>
					<CardMedia
						component="img"
						sx={{ height: "auto" }}
						image={users[params].avatar_url}
						title="green iguana"
					/>
					<CardContent>
						<Typography gutterBottom variant="h5" component="div">
							{users[params].username}
						</Typography>
						<Typography variant="body1" sx={{ color: secondaryText }}>
							{`Mail: ${users[params].email}`}
						</Typography>
						<Typography variant="body2" sx={{ color: secondaryText2 }}>
							{`Был последний раз: ${new Date(users[params].created_at).toLocaleString()}`}
						</Typography>
					</CardContent>
					<CardActions>
						<Button size="small" onClick={handlePublics} sx={{ color: links }}>
							посмотреть публикации
						</Button>

						{authUser && authUser?.id != params ? (
							<Button size="small" onClick={createNewChat} sx={{ color: links }}>
								написать
							</Button>
						) : (
							authUser && (
								<Button size="small" onClick={handleLogOut} sx={{ color: links }}>
									выйти
								</Button>
							)
						)}
					</CardActions>
				</Card>
			) : (
				`пользователь ${params} не найден`
			)}
		</>
	);
};

export default UserPage;

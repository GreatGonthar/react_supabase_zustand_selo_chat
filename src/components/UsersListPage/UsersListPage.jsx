import { Grid, Avatar, Typography, Card, CardHeader, Button } from "@mui/material";
import { useAuthUserStore, useUsersStore } from "../../lib/zustand";
import { useNavigate } from "react-router-dom";

import { mainButton, mainText, secondaryText2 } from "../../lib/colorsConst";

const UsersListPage = () => {
	const { users } = useUsersStore();

	const { authUser } = useAuthUserStore();
	const navigate = useNavigate();
	const handleNavigate = (user) => {
		navigate(`/user/${user.id}`);
	};
	console.log("authUser:", authUser);
	const usersArr = Object.values(users);
	const loading = false;
	return (
		<Grid container spacing={1} sx={{ flexDirection: "column", p: 0 }}>
			{!loading ? (
				usersArr.map((user, index) => {
					return (
						<Grid item key={index}>
							<Card
								sx={{
									width: "100%",
									backgroundColor: mainButton,
									color: "white",
									borderRadius: 4,
								}}
								onClick={() => handleNavigate(user)}
							>
								<CardHeader
									avatar={
										<Avatar
											alt="user"
											variant="square"
											src={user.avatar_url}
											sx={{ width: 64, height: 64 }}
										/>
									}
									title={
										<Typography variant="subtitle1" sx={{ color: mainText }}>
											{user.username}
										</Typography>
									}
									subheader={
										<Typography variant="subtitle2" sx={{ color: secondaryText2 }}>
											Создан: {new Date(user.created_at).toLocaleString()}
										</Typography>
									}
								/>
							</Card>
						</Grid>
					);
				})
			) : (
				<Typography variant="body1" sx={{ mt: 2, ml: 2 }}>
					Загрузка...
				</Typography>
			)}
		</Grid>
	);
};

export default UsersListPage;

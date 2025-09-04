import { Grid, Avatar, Typography, Card, CardHeader, Button } from "@mui/material";
import { useAuthUserStore, useChangeUserStore, useUsersStore } from "../../lib/zustand";
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useEffect } from "react";
import { useFetchUsersFromSupabase } from "../../lib/useFetchUsersFromSupabase";
import {
	secondaryElement,
	authButton,
	mainButton,
	mainText,
	secondaryText,
	secondaryText2,
} from "../../lib/colorsConst";

const UsersListPage = () => {
	const { users, setUsers } = useUsersStore();
	const { setChangeUser } = useChangeUserStore();
	const { authUser, setAuthUser } = useAuthUserStore();
	const navigate = useNavigate();
	const handleNavigate = (user) => {
		setChangeUser(user);
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
							>
								<CardHeader
									avatar={
										// <NavLink
										// 	to={`/user/${user.google_id}`}
										// 	style={{ textDecoration: "none", color: "white", fontWeight: 600 }}
										// >
										<Button onClick={() => handleNavigate(user)}>
											<Avatar
												alt="user"
												variant="square"
												src={user.avatar_url}
												sx={{ width: 64, height: 64 }}
											/>
										</Button>
										//</NavLink>
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

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Button, Container, Typography } from "@mui/material";
import MainLayout from "./components/MainLayout/MainLayout";

import UsersListPage from "./components/UsersListPage/UsersListPage";
import UserPage from "./components/UserPage/UserPage";
import RandomComponent from "./components/RandomComponent/RandomComponent";
import PostMessages from "./components/Posts/PostMessages";
import ChatLayout from "./components/MessagesPage/ChatLayout";
import ChatList from "./components/MessagesPage/ChatList";
import Notification from "./components/Notification/Notification";
import { AuthCallbackPage } from "./components/LoginPage/AuthCallbackPage";
import { useEffect } from "react";
import { useAuthUserStore } from "./lib/zustand";
import { supabase } from "./lib/supabase";
import { useUsersSubscribe } from "./lib/supabaseSubscribers/useUsersSubscribe";
import { authButton } from "./lib/colorsConst";
import OnePost from "./components/Posts/OnePost";

const App = () => {
	const setUser = useAuthUserStore((state) => state.setAuthUser);
	const setLoading = useAuthUserStore((state) => state.setLoading);
	const { loading } = useUsersSubscribe();
	useEffect(() => {
		// 1. Проверяем существующую сессию при загрузке
		const initializeAuth = async () => {
			try {
				const {
					data: { session },
					error,
				} = await supabase.auth.getSession();

				if (error) {
					console.error("Ошибка при проверке сессии:", error);
					setUser(null);
				} else if (session) {
					setUser(session.user);
				}
			} catch (error) {
				console.error("Ошибка инициализации аутентификации:", error);
			} finally {
				setLoading(false);
			}
		};

		initializeAuth();

		// 2. Слушаем изменения аутентификации в реальном времени
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(async (event, session) => {
			if (event === "SIGNED_IN" && session) {
				setUser(session.user);
			} else if (event === "SIGNED_OUT") {
				setUser(null);
			}

			setLoading(false);
		});

		// 3. Очистка подписки при размонтировании
		return () => {
			subscription.unsubscribe();
		};
	}, [setUser, setLoading]);
	return (
		<Router>
			<div className="container">
				<Container
					maxWidth="sm"
					sx={{
						marginTop: 8,
						// height: "100vh",
						overflowY: "auto",
					}}
				>
					<MainLayout />

					{!loading ? (
						<Routes>
							<Route path="/" element={<RandomComponent content={"main page"} />} />
							<Route path={`/user/:params`} element={<UserPage />} />
							<Route path="/users" element={<UsersListPage />} />
							<Route path="/chats" element={<ChatList />} />
							<Route path="/chat/:params" element={<ChatLayout />} />
							<Route path="/public" element={<PostMessages />} />
							<Route path="/public/:params" element={<OnePost />} />
							<Route path="*" element={<RandomComponent content={"404 страница не найдена"} />} />
							<Route path="/auth/callback" element={<AuthCallbackPage />} />
						</Routes>
					) : (
						<Typography sx={{ color: authButton }}>загрузка пользователей...</Typography>
					)}
				</Container>
				<Notification />
			</div>
		</Router>
	);
};

export default App;

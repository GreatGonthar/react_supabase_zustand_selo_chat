import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { handleAuthCallback } from "../../lib/handleGoogleAuth";
import { useAuthUserStore } from "../../lib/zustand";

export const AuthCallbackPage = () => {
	const navigate = useNavigate();
	const { authUser, setAuthUser } = useAuthUserStore();
	useEffect(() => {
		const processAuth = async () => {
			try {
				const user = await handleAuthCallback();
				setAuthUser(user);
				console.log("Пользователь добавлен:", user);
				navigate(`/user/${user.id}`); // Перенаправляем после успеха
			} catch (error) {
				console.error(error);
				navigate("/login?error=auth_failed");
			}
		};

		processAuth();
	}, [navigate]);

	return <div>Загрузка...</div>;
};

import { safeAddUserToSupabase } from "./addUserToSupabase";
import { supabase } from "./supabase";

export const handleGoogleAuth = async () => {
	try {
		// 1. Аутентификация через Google
		const { error } = await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: "http://localhost:5173/auth/callback",
			},
		});

		if (error) throw error;

		// На этом этапе пользователь будет перенаправлен на Google для входа
		// Дальнейший код выполнится только после возврата с Google
	} catch (error) {
		console.error("Ошибка аутентификации:", error);
		await supabase.auth.signOut();
		throw error;
	}
};

export const handleLogout = async () => {
	try {
		// 1. Выход из Supabase
		const { error } = await supabase.auth.signOut();

		// 2. Очистка локального состояния (если используете)
		localStorage.removeItem("sb-auth-token");
		sessionStorage.removeItem("sb-auth-token");

		// 3. Перенаправление
		window.location.href = "/public"; // Или другая целевая страница

		if (error) throw error;
	} catch (err) {
		console.error("Ошибка выхода:", err.message);
	}
};

export const handleAuthCallback = async () => {
	try {
		// Получаем сессию после возврата с Google
		const {
			data: { session },
			error: sessionError,
		} = await supabase.auth.getSession();

		if (sessionError || !session) {
			throw new Error("Сессия не найдена");
		}

		// Извлекаем пользователя из сессии
		const user = session.user;

		// Формируем данные для Supabase
		const dbUser = {
			id: user.id,
			email: user.email,
			username: user.user_metadata.name,
			avatar_url: user.user_metadata.avatar_url,
		};

		// Добавляем в таблицу users
		await safeAddUserToSupabase(dbUser);

		return dbUser;
	} catch (error) {
		console.error("Ошибка обработки callback:", error);
		await supabase.auth.signOut();
		throw error;
	}
};

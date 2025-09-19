import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { useUsersStore } from "../zustand";

export const useUsersSubscribe = () => {
	const { users, setUsers } = useUsersStore();
	// const [usersSupabase, setUsersSupabase] = useState([]); // Укажите правильный тип вместо any
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		console.log("начали загрузку юзеров");
		// 1. Первоначальная загрузка пользователей
		const fetchUsers = async () => {
			try {
				setLoading(true);
				const { data, error: fetchError } = await supabase.from("users").select("*");

				if (fetchError) {
					setError(fetchError);
				} else {
					const result = data.reduce((acc, item) => {
						acc[item.id] = item; // Используем id как ключ, весь объект как значение
						return acc;
					}, {});
					setUsers(result || {});
				}
			} catch (err) {
				setError(err);
			} finally {
				setLoading(false);
			}
		};
		fetchUsers();

		// 2. Создание подписки на изменения
		const channel = supabase
			.channel("users_changes") // Уникальное имя канала
			.on(
				"postgres_changes",
				{
					event: "*", // Слушаем все события (INSERT, UPDATE, DELETE)
					schema: "public",
					table: "users",
				},
				(payload) => {
					fetchUsers();
				}
			)
			.subscribe();

		// 3. Отписка при размонтировании компонента
		return () => {
			console.log("отписались от загрузки юзеров");
			supabase.removeChannel(channel);
		};
	}, [setUsers]);
	return { users, loading, error };
};

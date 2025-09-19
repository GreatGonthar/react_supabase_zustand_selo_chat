import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import { useChatsParticipantsStore } from "./zustand";

export const useChatsWithData = (userId) => {
	// получаем чаты пользователя без сообщений
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const { chatsParticipants, setChatsParticipants } = useChatsParticipantsStore();
	useEffect(() => {
		const fetchChatsWithData = async () => {
			try {
				setLoading(true);

				// 1. Получаем чаты пользователя
				const { data: userChats, error: chatsError } = await supabase
					.from("chat_participants")
					.select("chat_id")
					.eq("user_id", userId);

				if (chatsError) throw chatsError;

				const chatIds = userChats.map((chat) => chat.chat_id);

				if (chatIds.length === 0) {
					setChats([]);
					setLoading(false);
					return;
				}
				// 2. Получаем участников каждого чата

				const participantsArr = [];
				for (const chatId of chatIds) {
					const { data: participants } = await supabase
						.from("chat_participants")
						.select("*")
						.eq("chat_id", chatId);

					const { data: lastMessage } = await supabase
						.from("messages")
						.select("id, content, chat_id")
						.eq("chat_id", chatId) // Фильтр по ID чата
						.order("created_at", { ascending: false }) // Сортируем по дате (новые сначала)
						.limit(1) // Берем только одно (последнее) сообщение
						.maybeSingle(); // Возвращает null если нет результатов
					participantsArr.push({ participants, lastMessage });
				}

				setChatsParticipants(participantsArr);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchChatsWithData();
	}, [userId]);

	return { loading, error };
};

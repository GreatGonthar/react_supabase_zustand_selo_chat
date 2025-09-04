import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useChatsStore } from "./zustand";

export const useFetchMessagesFromSupabase = (chatId) => {
	const { setMessages, addMessage, removeMessage } = useChatsStore();

	useEffect(() => {
		// 1. Загрузка начальных сообщений
		const fetchInitialMessages = async () => {
			const { data, error } = await supabase
				.from("messages")
				.select("*")
				.eq("chat_id", chatId)
				.order("created_at", { ascending: true });

			if (!error && data) {
				setMessages(chatId, data);
			}
		};

		fetchInitialMessages();

		// 2. Подписка на новые сообщения в реальном времени
		const channel = supabase
			.channel(`realtime_messages_${chatId}`)
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "messages",
					// filter: `chat_id=eq.${chatId}`,
				},
				(payload) => {
					switch (payload.eventType) {
						case "INSERT":
							addMessage(chatId, payload.new);
							break;
						case "DELETE":
							removeMessage(chatId, payload.old.id);
							break;
					}
				}
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [chatId]);
};

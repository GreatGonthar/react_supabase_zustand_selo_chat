import { useEffect } from "react";
import { useCommentsStore } from "../zustand";
import { supabase } from "../supabase";

const useCommentSubscribe = (postId) => {
	const { setComments, addComment, removeComment, setCommentsCount } = useCommentsStore();
	useEffect(() => {
		// 1. Загружаем начальные данные
		const fetchInitialComments = async () => {
			try {
				const { data, error } = await supabase
					.from("comments")
					.select("*")
					.eq("post_id", postId)
					.order("created_at", { ascending: false });

				if (error) {
					console.error("Error fetching comments:", error);
					return;
				}
				// Загружаем количество комментариев
				// Сохраняем初始 данные в Zustand
				setComments(postId, data);

				// setCommentsCount()
			} catch (error) {
				console.error("Error in fetchInitialComments:", error);
			}
		};
		fetchInitialComments();
		const channel = supabase
			.channel(`comments-realtime-${postId}`)
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "comments",
					// filter: `chat_id=eq.${chatId}`,
				},
				(payload) => {
					console.log(payload.eventType);
					switch (payload.eventType) {
						case "INSERT":
							addComment(postId, payload.new);

							break;
						case "DELETE":
							removeComment(postId, payload.old.id);
							break;
					}
				}
			)
			.subscribe();

		// 3. Возвращаем функцию очистки для отписки
		return () => {
			supabase.removeChannel(channel);
		};
	}, [postId]); // Переподписываемся при смене postId
};

export default useCommentSubscribe;

import { useEffect } from "react";
import { useCommentsStore } from "../zustand";
import { supabase } from "../supabase";

const useCommentCountSubscribe = (postId) => {
	const { setCommentsCount } = useCommentsStore();
	useEffect(() => {
		if (!postId) return;
		// 1. Загружаем начальные данные
		const fetchInitialComments = async () => {
			try {
				const { count, error } = await supabase
					.from("comments")
					.select("*", { count: "exact", head: true })
					.eq("post_id", postId);

				if (error) {
					console.error("Error fetching comments:", error);
					return;
				}

				setCommentsCount(postId, count);
			} catch (error) {
				console.error("Error in fetchInitialComments:", error);
			}
		};
		fetchInitialComments();
		const channel = supabase
			.channel(`comments-count-${postId}`)
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "comments",
					// filter: `post_id=eq.${postId}`,
				},
				fetchInitialComments // Просто пересчитываем при любом изменении
			)
			.subscribe();
		// 3. Возвращаем функцию очистки для отписки
		return () => {
			supabase.removeChannel(channel);
		};
	}, [setCommentsCount]); // Переподписываемся при смене postId
};

export default useCommentCountSubscribe;

import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { usePostsStore } from "./zustand";

export const useFetchPostsFromSupabase = () => {
	const { setPosts, addPost, updatePost, removePost } = usePostsStore();
	useEffect(() => {
		// 1. Загрузка начальных сообщений
		const fetchInitialPosts = async () => {
			const { data, error } = await supabase.from("posts").select("*").order("created_at", { ascending: true });

			if (!error && data) {
				setPosts(data);
			}
		};

		fetchInitialPosts();

		// 2. Подписка на новые сообщения в реальном времени
		const channel = supabase
			.channel("realtime_posts")
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "posts",
				},
				(payload) => {
					switch (payload.eventType) {
						case "INSERT":
							addPost(payload.new);
							break;
						case "UPDATE":
							updatePost(payload.new.id, payload.new);
							break;
						case "DELETE":
							removePost(payload.old.id);
							break;
					}
				}
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, []);
};

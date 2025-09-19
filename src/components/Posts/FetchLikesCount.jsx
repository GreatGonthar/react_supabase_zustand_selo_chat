import { CircularProgress, IconButton, Typography } from "@mui/material";
import { supabase } from "../../lib/supabase";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useEffect, useState } from "react";
import { red } from "@mui/material/colors";
import { usePostsStore } from "../../lib/zustand";

// Функция для загрузки общего количества лайков
const FetchLikesCount = ({ post_id, currentUserId = false }) => {
	const [userReaction, setUserReaction] = useState(null); // null, 'like' или 'dislike'
	const [isLoading, setIsLoading] = useState(false);

	const { getReactions, setReactions } = usePostsStore();

	// Получаем счетчики из хранилища
	const { likes: likesCount, dislikes: dislikesCount } = getReactions(post_id);

	// 1. Функция для загрузки счетчиков
	const fetchCounts = async () => {
		// Запрашиваем количество лайков и дизлайков за один запрос
		const { data, error } = await supabase.from("reactions").select("type").eq("post_id", post_id);

		if (error) {
			console.error("Error fetching counts:", error);
			return;
		}

		// Считаем лайки и дизлайки
		const likes = data.filter((item) => item.type === "like").length;
		const dislikes = data.filter((item) => item.type === "dislike").length;

		setReactions(post_id, { likes, dislikes });
	};
	// 2. Функция для проверки реакции пользователя
	const checkUserReaction = async () => {
		if (!currentUserId) {
			setUserReaction(null);
			return;
		}

		const { data, error } = await supabase
			.from("reactions")
			.select("type")
			.eq("post_id", post_id)
			.eq("user_id", currentUserId)
			.maybeSingle();

		if (error) {
			console.error("Error checking user reaction:", error);
		} else {
			setUserReaction(data?.type || null);
		}
	};

	// 3. Real-time подписка на изменения реакций
	const subscribeToReactions = () => {
		const channel = supabase
			.channel(`reactions-realtime-${post_id}`)
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "reactions",
				},
				(payload) => {
					console.log("Reaction change detected:", payload.eventType);

					// При любом изменении перезагружаем данные
					fetchCounts();

					// Также обновляем реакцию текущего пользователя
					if (currentUserId) {
						checkUserReaction();
					}
				}
			)
			.subscribe((status) => {
				console.log("Reactions subscription status:", status);
			});

		return () => {
			supabase.removeChannel(channel);
		};
	};

	// 3.5. Функция-обработчик для установки реакции
	const handleReaction = async (reactionType) => {
		if (!currentUserId) {
			alert("Login please");
			return;
		}

		if (userReaction === reactionType) {
			// Если кликаем на уже активную реакцию - удаляем ее
			await removeReaction();
			return;
		}

		setIsLoading(true);

		try {
			// Используем upsert (обновить или вставить)
			const { error } = await supabase.from("reactions").upsert(
				{
					post_id,
					user_id: currentUserId,
					type: reactionType,
				},
				{
					onConflict: "post_id,user_id", // Важно: укажите columns для уникального constraint
					ignoreDuplicates: false,
				}
			);

			if (error) throw error;

			// Оптимистичное обновление UI
			const oldReaction = userReaction;
			setUserReaction(reactionType);

			// Обновляем счетчики в хранилище
			const currentReactions = getReactions(post_id);
			let newLikes = currentReactions.likes;
			let newDislikes = currentReactions.dislikes;

			// Убираем старую реакцию
			if (oldReaction === "like") newLikes--;
			if (oldReaction === "dislike") newDislikes--;

			// Добавляем новую реакцию
			if (reactionType === "like") newLikes++;
			if (reactionType === "dislike") newDislikes++;

			setReactions(post_id, {
				likes: Math.max(0, newLikes),
				dislikes: Math.max(0, newDislikes),
			});
		} catch (error) {
			console.error("Error setting reaction:", error);
			// Перезагружаем актуальные данные
			await fetchCounts();
			await checkUserReaction();
		} finally {
			setIsLoading(false);
		}
	};
	// 4. Функция для удаления реакции
	const removeReaction = async () => {
		setIsLoading(true);
		try {
			const { error } = await supabase
				.from("reactions")
				.delete()
				.eq("post_id", post_id)
				.eq("user_id", currentUserId);

			if (error) throw error;

			// Оптимистичное обновление UI
			const oldReaction = userReaction;
			setUserReaction(null);

			// Обновляем счетчики в хранилище
			const currentReactions = getReactions(post_id);
			let newLikes = currentReactions.likes;
			let newDislikes = currentReactions.dislikes;

			// Убираем старую реакцию
			if (oldReaction === "like") newLikes--;
			if (oldReaction === "dislike") newDislikes--;

			setReactions(post_id, {
				likes: Math.max(0, newLikes),
				dislikes: Math.max(0, newDislikes),
			});
		} catch (error) {
			console.error("Error removing reaction:", error);
			await fetchCounts();
			await checkUserReaction();
		} finally {
			setIsLoading(false);
		}
	};

	// 6. Загрузка初始 данных
	useEffect(() => {
		if (!post_id) return;
		const fetchInitialData = async () => {
			await Promise.all([fetchCounts(), checkUserReaction()]);
		};
		fetchInitialData();
		// Подписываемся на real-time обновления
		const unsubscribe = subscribeToReactions();
		// Очистка подписки при размонтировании
		return unsubscribe;
	}, [post_id, currentUserId]);

	return (
		<>
			<IconButton sx={{ color: red[500] }} onClick={() => handleReaction("like")} disabled={isLoading}>
				{isLoading ? (
					<CircularProgress size="20px" />
				) : userReaction === "like" ? (
					<FavoriteIcon />
				) : (
					<FavoriteBorderIcon />
				)}

				<Typography variant="body2">{likesCount}</Typography>
			</IconButton>
			<IconButton
				sx={{
					color: userReaction === "dislike" ? "green" : "inherit",
					p: 0.1,
				}}
				onClick={() => handleReaction("dislike")}
				disabled={isLoading}
			>
				{isLoading ? (
					<CircularProgress size="20px" />
				) : userReaction === "dislike" ? (
					<Typography variant="body2" sx={{ fontSize: "0.8em" }}>
						{String.fromCodePoint(129314)}
					</Typography>
				) : (
					<Typography variant="body2" sx={{ fontSize: "0.8em", filter: "grayscale(100%)" }}>
						{String.fromCodePoint(129314)}
					</Typography>
				)}
				<Typography variant="body2">{dislikesCount}</Typography>
			</IconButton>
		</>
	);
};
export default FetchLikesCount;

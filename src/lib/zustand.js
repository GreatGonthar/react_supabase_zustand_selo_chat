import { create } from "zustand";

export const useUsersStore = create((set) => ({
	users: {},
	addUser: (user) => {
		set((state) => ({ users: { ...state.users, user } }));
	},
	setUsers: (payload) => {
		set((state) => ({ users: { ...payload } }));
	},
	removeUser: (userId) => {
		set((state) => ({
			users: state.users.filter((user) => user.id !== userId),
		}));
	},
}));
export const useChatsParticipantsStore = create((set) => ({
	chatsParticipants: [],
	setChatsParticipants: (payload) => {
		set((state) => ({ chatsParticipants: [...payload] }));
	},
}));

export const useChatsStore = create((set) => ({
	chats: {}, // Структура: { [chatId]: Message[] }
	setChats: (payload) => {
		set((state) => ({ chats: { ...payload } }));
	},

	setMessages: (chatId, messages) =>
		set((state) => ({
			chats: {
				...state.chats,
				[chatId]: messages,
			},
		})),

	addMessage: (chatId, newMessage) =>
		set((state) => ({
			chats: {
				...state.chats,
				[chatId]: [...(state.chats[chatId] || []), newMessage],
			},
		})),
	removeMessage: (chatId, messageId) =>
		set((state) => {
			// Если чата нет в состоянии, ничего не делаем
			if (!state.chats[chatId]) return state;

			return {
				chats: {
					...state.chats,
					[chatId]: state.chats[chatId].filter((msg) => msg.id !== messageId),
				},
			};
		}),
}));
export const usePostsStore = create((set) => ({
	posts: [], // Структура: Post[]

	// Установить все посты (загрузка из БД)
	setPosts: (posts) => {
		console.log("добавлены в zustand все посты");
		set({ posts });
	},

	// Добавить новый пост (в начало массива)
	addPost: (newPost) => {
		console.log("добавлен в zustand один пост");
		set((state) => ({
			posts: [...state.posts, newPost],
		}));
	},

	// Обновить конкретный пост
	updatePost: (postId, updatedData) =>
		set((state) => ({
			posts: state.posts.map((post) => (post.id === postId ? { ...post, ...updatedData } : post)),
		})),

	// Удалить пост
	removePost: (postId) =>
		set((state) => ({
			posts: state.posts.filter((post) => post.id !== postId),
		})),

	// Лайк/анлайк поста
	toggleLike: (postId, userId) =>
		set((state) => ({
			posts: state.posts.map((post) => {
				if (post.id !== postId) return post;

				const isLiked = post.likes?.includes(userId);
				return {
					...post,
					likes: isLiked ? post.likes.filter((id) => id !== userId) : [...(post.likes || []), userId],
					likes_count: isLiked ? post.likes_count - 1 : post.likes_count + 1,
				};
			}),
		})),
}));

export const useAuthUserStore = create((set, get) => ({
	authUser: null, // Изменяем с {} на null для более точной проверки
	isLoading: true,
	setAuthUser: (user) => {
		// Добавляем проверку, чтобы избежать ненужных обновлений
		// console.log("zustand", user);
		const currentUser = get().authUser;
		if (currentUser?.id !== user?.id) {
			set({ authUser: user });
		}
	},
	setLoading: (isLoading) => set({ isLoading }),
	// Добавляем селектор для получения только id пользователя
	getUserId: () => get().authUser?.id,
}));

export const useChangeUserStore = create((set) => ({
	changeUser: {},

	setChangeUser: (user) => {
		set((state) => ({ changeUser: user }));
	},
}));

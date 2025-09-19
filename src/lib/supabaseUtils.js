import { supabase } from "./supabase";
import imageCompression from "browser-image-compression";

const findExistingChat = async (user1Id, user2Id) => {
	const { data, error } = await supabase.rpc("find_existing_chat", { user1: user1Id, user2: user2Id });
	if (error) throw error;
	return data;
};

const createNewChat = async (user1Id, user2Id) => {
	// Создаём новый чат
	const { data: newChat, error: chatError } = await supabase.from("chats").insert({}).select("id").single();

	if (chatError) throw chatError;

	// Добавляем участников
	const { error: participantsError } = await supabase.from("chat_participants").insert([
		{ user_id: user1Id, chat_id: newChat.id },
		{ user_id: user2Id, chat_id: newChat.id },
	]);

	if (participantsError) throw participantsError;

	return newChat.id;
};
export const createChat = async (senderId, receiverId) => {
	// 1. Проверяем, есть ли чат
	const existingChatId = await findExistingChat(senderId, receiverId);
	// 2. Если нет – создаём
	const chatId = existingChatId || (await createNewChat(senderId, receiverId));
	return chatId;
};

export const sendMessage = async (type, typeId = null, senderId, messageText, img = "") => {
	// Отправляем сообщение

	switch (type) {
		case "chat":
			const { data: chatData, error: chatError } = await supabase
				.from("messages")
				.insert({
					chat_id: typeId,
					sender_id: senderId,
					content: messageText,
					imgurl: img,
				})
				.select("id") // Возвращаем ID вставленной записи
				.single();

			if (chatError) throw chatError;
			return chatData.id; // Возвращаем ID сообщения

		case "post":
			const { data: postData, error: postError } = await supabase
				.from("posts")
				.insert({
					user_id: senderId,
					content: messageText,
					imgurl: img,
				})
				.select("id")
				.single();

			if (postError) throw postError;
			return postData.id; // Возвращаем ID поста

		case "comment":
			const { data: commentData, error: commentError } = await supabase
				.from("comments")
				.insert({
					post_id: typeId, // ID поста, к которому комментарий
					user_id: senderId,
					content: messageText,
					imgurl: img,
				})
				.select("id")
				.single();

			if (commentError) throw commentError;
			return commentData.id; // Возвращаем ID комментария

		default:
			throw new Error(`Unknown type: ${type}`);
	}
};

const compressImage = async (file) => {
	const options = {
		maxWidthOrHeight: 800, // Ширина не больше 800px (высота пропорционально)
		fileType: "image/webp", // Формат WebP
		useWebWorker: true, // Фоновая обработка (лучшая производительность)
		initialQuality: 0.8, // Качество 80% (можно регулировать: 0.1 - 1.0)
	};

	try {
		const compressedFile = await imageCompression(file, options);
		console.log("Сжатое изображение:", compressedFile);
		return compressedFile;
	} catch (error) {
		console.error("Ошибка сжатия:", error);
		return null;
	}
};
export const sendImg = async (userId, file) => {
	const compressedFile = await compressImage(file);
	if (compressedFile) {
		const fileName = `${userId}_${Date.now()}.webp`;

		// Загружаем файл в bucket 'photos'
		const { data, error } = await supabase.storage
			.from("photos") // имя bucket
			.upload(fileName, compressedFile, {
				contentType: compressedFile.type, // Автоматически определяет MIME-тип
			});

		if (error) {
			console.error("Ошибка загрузки:", error);
			return null;
		}

		// Получаем публичный URL (если bucket публичный)
		const {
			data: { publicUrl },
		} = supabase.storage.from("photos").getPublicUrl(data.path);

		return publicUrl; // или просто data.path, если bucket приватный
	}
};
const delImg = async (url) => {
	console.log(url);
	const extractFilePathFromUrl = (imgUrl) => {
		// Разбиваем URL на части

		const parts = imgUrl.split("/storage/v1/object/public/");
		if (parts.length < 2) return null;

		// Удаляем имя бакета из пути
		const pathWithBucket = parts[1];
		const pathParts = pathWithBucket.split("/");
		if (pathParts.length < 2) return null;

		// Возвращаем путь без имени бакета
		return pathParts.slice(1).join("/");
	};

	try {
		const filePath = extractFilePathFromUrl(url);
		console.log(filePath);
		if (filePath) {
			// const { data: files } = await supabase.storage.from("photos").list(""); // Пустая строка = корень бакета
			// console.log("file", files);
			const { data, error } = await supabase.storage
				.from("photos") // Укажите имя вашего бакета
				.remove([filePath]);

			if (error) {
				console.error("Error deleting file:", error);
			} else {
				console.log("File deleted successfully", data);
			}
		}
	} catch (err) {
		console.error("Failed to delete file:", err);
	}
};
export const delMessage = async (type, message) => {
	console.log("message", message);
	if (message.imgurl) {
		delImg(message.imgurl);
	}
	switch (type) {
		case "chat":
			try {
				const { error } = await supabase
					.from("messages") // название вашей таблицы
					.delete()
					.eq("id", message.id); // условие: где id = messageId

				if (error) throw error;

				console.log(`Сообщение успешно удалено`);
				return true;
			} catch (error) {
				console.error("Ошибка при удалении сообщения:", error);
				return false;
			}
		case "post":
			try {
				const { error } = await supabase
					.from("posts") // название вашей таблицы
					.delete()
					.eq("id", message.id); // условие: где id = messageId

				if (error) throw error;

				console.log(`пост ${message.id} успешно удален`);
				return true;
			} catch (error) {
				console.error("Ошибка при удалении поста:", error);
				return false;
			}
		case "comment":
			try {
				const { error } = await supabase
					.from("comments") // название вашей таблицы
					.delete()
					.eq("id", message.id); // условие: где id = messageId

				if (error) throw error;

				console.log(`коммент ${message.id} успешно удален`);
				return true;
			} catch (error) {
				console.error("Ошибка при удалении коммента:", error);
				return false;
			}
	}
};

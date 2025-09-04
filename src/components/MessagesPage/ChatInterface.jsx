import React, { useEffect, useRef, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import MessageItem from "./MessageItem";
import { useAuthUserStore, useChangeUserStore, useChatsStore } from "../../lib/zustand";
import { useFetchMessagesFromSupabase } from "../../lib/useFetchMessagesFromSupabase";

import ImagePreview from "./ImagePreview";
import PickerComponent from "./PickerComponent";
import { useChatState } from "../../lib/useChatState";
import { authButton } from "../../lib/colorsConst";

//сдесь показываются сообщения списком
const ChatInterface = ({ chatId }) => {
	const { selectedFile, showPicker } = useChatState();
	const { authUser } = useAuthUserStore();
	const { changeUser } = useChangeUserStore();
	const { chats } = useChatsStore();
	const endOfMessagesRef = useRef(null);
	// Подписываемся на обновления сообщений
	useFetchMessagesFromSupabase(chatId);

	// Получаем сообщения для текущего чата
	const messages = chats[chatId] || [];
	// Автоскролл при новых сообщениях

	useEffect(() => {
		endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, showPicker]);

	useEffect(() => {
		if (selectedFile) {
			const timer = setTimeout(() => {
				endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
			}, 150);
			return () => clearTimeout(timer);
		}
	}, [selectedFile]);

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				padding: 2,
				height: "80vh",
				overflowY: "auto",
				border: "1px solid #0e0e0eff",
				borderRadius: 1,
				position: "relative",
				backdropFilter: "blur(5px) ",
			}}
		>
			{messages.length === 0 ? (
				<Box sx={{ textAlign: "center", mt: 2 }}>
					<Typography variant="body2" sx={{ color: authButton }}>
						Сообщений пока нет. Начните разговор!
					</Typography>
				</Box>
			) : (
				messages.map((message) => (
					<MessageItem key={message.id} message={message} authUser={authUser} changeUser={changeUser} />
				))
			)}

			<div ref={endOfMessagesRef} />
		</Box>
	);
};

export default ChatInterface;

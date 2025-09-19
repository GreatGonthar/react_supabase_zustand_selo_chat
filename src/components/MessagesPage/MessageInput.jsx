import React, { useState } from "react";
import { Box, TextField, Button, IconButton, Card, CardActions, CardHeader, CardMedia, Fab } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import EmojiIcon from "@mui/icons-material/InsertEmoticon";
import { sendImg, sendMessage } from "../../lib/supabaseUtils";
import { useAuthUserStore } from "../../lib/zustand";
import { authButton, mainText } from "../../lib/colorsConst";

import CloseIcon from "@mui/icons-material/Close";
import ImagePreview from "./ImagePreview";
import PickerComponent from "./PickerComponent";
import { useChatState } from "../../lib/useChatState";

// инпут со всеми кнопками, логикой, и textarea

const MessageInput = ({ type, setOpenMessageInput = false, chatId }) => {
	const { selectedFile, setSelectedFile, isLoading, setIsLoading, message, setMessage, showPicker, setShowPicker } =
		useChatState();
	const { authUser } = useAuthUserStore();

	const handleSend = async () => {
		setIsLoading(true);
		if (!message.trim() && !selectedFile) return;
		setShowPicker(false);
		setOpenMessageInput && setOpenMessageInput(false);
		try {
			// setIsLoading(true);
			// Логика отправки сообщения

			if (selectedFile) {
				try {
					// 1. Сначала дожидаемся загрузки изображения
					const img = await sendImg(authUser.id, selectedFile);
					// 2. Только после получения URL отправляем сообщение
					console.log("message", message, type, chatId, authUser.id);
					await sendMessage(type, chatId, authUser.id, message, img);
					// 3. Очищаем поле ввода
					setMessage("");
					setSelectedFile(null); // Не забудьте сбросить файл
				} catch (error) {
					console.error("Ошибка отправки:", error);
					toast.error("Не удалось отправить изображение");
				}
				// удалять изображение вместе с сообщением
			} else {
				sendMessage(type, chatId, authUser.id, message);
				setMessage("");
			}
		} catch (error) {
			console.error("Ошибка отправки:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleKeyPress = (event) => {
		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault();
			handleSend();
		}
	};

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		console.log("файл выбран");
		if (file) {
			setSelectedFile(file);
			e.target.value = "";
		}
	};

	return (
		<>
			<Box sx={{ display: "flex", flexDirection: "column", gap: 1, p: 2 }}>
				<Box sx={{ display: "flex", justifyContent: "center" }}>
					{selectedFile && <ImagePreview selectedFile={selectedFile} setSelectedFile={setSelectedFile} />}
				</Box>
				<Box sx={{ display: "flex", justifyContent: "center" }}>
					{showPicker && <PickerComponent setMessage={setMessage} />}
				</Box>
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						gap: 1,
					}}
				>
					<Box
						sx={{
							display: "flex",
							alignItems: "center",
							p: 1,
							bgcolor: "background.paper",
							borderRadius: "25px",
							border: "1px solid #ddd",
							flexGrow: 1,
						}}
					>
						<IconButton size="small" onClick={() => setShowPicker((prev) => !prev)}>
							<EmojiIcon />
						</IconButton>

						<TextField
							variant="standard"
							multiline
							fullWidth
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							onKeyPress={handleKeyPress}
							placeholder="Сообщение..."
							InputProps={{ disableUnderline: true }}
							sx={{ flexGrow: 1, mx: 1 }}
						/>

						<label htmlFor="file-input">
							<IconButton component="span" size="small">
								<AttachFileIcon />
							</IconButton>
						</label>
						<input
							type="file"
							id="file-input"
							accept="image/*"
							style={{ display: "none" }}
							onChange={handleFileChange}
						/>
					</Box>
					<Fab
						onClick={handleSend}
						disabled={false}
						sx={{
							borderRadius: "50%",
							minWidth: "48px",
							height: "48px",
							backgroundColor: authButton,
							color: mainText,
						}}
					>
						<SendIcon />
					</Fab>
				</Box>
			</Box>
		</>
	);
};

export default MessageInput;

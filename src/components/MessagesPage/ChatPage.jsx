import React, { useState } from "react";
import ChatInterface from "./ChatInterface";
import MessageInput from "./MessageInput";
import ImagePreview from "./ImagePreview";
import { useParams } from "react-router-dom";
import { Box } from "@mui/material";
const ChatPage = () => {
	const chatId = useParams().params;

	return (
		<Box>
			<ChatInterface chatId={chatId} />

			<MessageInput chatId={chatId} />
		</Box>
	);
};

export default ChatPage;

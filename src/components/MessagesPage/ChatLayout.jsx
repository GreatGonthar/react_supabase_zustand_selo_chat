import React, { useState } from "react";
import MessagesContainer from "./MessagesContainer";
import MessageInput from "./MessageInput";
import ImagePreview from "./ImagePreview";
import { useParams } from "react-router-dom";
import { Box } from "@mui/material";
const ChatLayout = () => {
	const chatId = useParams().params;

	return (
		<Box>
			<MessagesContainer chatId={chatId} />

			<MessageInput type="chat" chatId={chatId} />
		</Box>
	);
};

export default ChatLayout;

import { useState } from "react";
export const useChatState = () => {
	const [selectedFile, setSelectedFile] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [message, setMessage] = useState("");
	const [showPicker, setShowPicker] = useState(false);

	return {
		selectedFile,
		setSelectedFile,
		isLoading,
		setIsLoading,
		message,
		setMessage,
		showPicker,
		setShowPicker,
	};
};

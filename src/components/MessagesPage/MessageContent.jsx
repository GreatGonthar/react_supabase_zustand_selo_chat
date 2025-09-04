import React from "react";
import { Typography } from "@mui/material";
import Linkify from "react-linkify";
import { customEmojis } from "../../lib/customEmojis";
//содержимое облачка. текст и возможно картинка

const MessageContent = ({ message, color = "black" }) => {
	// определяет какие ссылки ведут на изображение
	const isImageUrl = (url) => {
		return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url.toLowerCase());
	};

	// проверяем текст, и если находим :эмодзи:, возвращаем его ссылку на изображение
	const transformMessage = (text) => {
		return text.replace(/:([a-zA-Zа-яА-Я0-9_-]+):/g, (match, emojiId) => {
			// Ищем эмодзи по ID во всех категориях
			for (const category of customEmojis) {
				const foundEmoji = category.emojis.find((emoji) => emoji.id === emojiId.trim());
				if (foundEmoji && foundEmoji.skins?.[0]?.src) {
					return foundEmoji.skins[0].src;
				}
			}
			return match;
		});
	};
	return (
		<>
			{message.imgurl && (
				<img
					src={message.imgurl}
					alt="message attachment"
					style={{ maxWidth: "100%", height: "auto", marginBottom: "8px" }}
				/>
			)}
			<Linkify
				componentDecorator={(decoratedHref, decoratedText, key) => {
					// Если ссылка ведет на изображение, рендерим изображение
					if (isImageUrl(decoratedHref)) {
						return (
							<img
								key={key}
								src={decoratedHref}
								alt="embedded content"
								// важные атрибуты расположения эмодзи
								style={{ maxWidth: "100%", height: "auto", margin: "0 0 -5px 0" }}
							/>
						);
					}
					// Иначе рендерим обычную ссылку
					return (
						<a href={decoratedHref} key={key} target="_blank" rel="noopener noreferrer">
							{decoratedText}
						</a>
					);
				}}
			>
				<Typography variant="body1" sx={{ color: color }}>
					{transformMessage(message.content)}
				</Typography>
			</Linkify>
		</>
	);
};

export default MessageContent;

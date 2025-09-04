import { Grid, Avatar, Typography, Card, CardHeader, AvatarGroup } from "@mui/material";
import { Link } from "react-router-dom";
import {
	useAuthUserStore,
	useChangeUserStore,
	useChatsParticipantsStore,
	useChatsStore,
	useUsersStore,
} from "../../lib/zustand";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { authButton, mainButton, mainText, secondaryText2 } from "../../lib/colorsConst";

import { useChatsWithData } from "../../lib/useChatsWithData";
import MessageContent from "./MessageContent";
// список чатов. не относится к самому чату
const ChatList = () => {
	// Получаем данные из хранилищ
	const { users } = useUsersStore();
	const { authUser } = useAuthUserStore();
	const { setChangeUser } = useChangeUserStore();
	const { loading, error } = useChatsWithData(authUser.id);
	const { chatsParticipants } = useChatsParticipantsStore();
	const chats = chatsParticipants;
	console.log("chats", chats);

	if (loading) {
		return <Typography sx={{ mt: 2, ml: 2, color: authButton }}>загрузка чатов...</Typography>;
	}

	if (error) {
		return (
			<Typography variant="body1" sx={{ mt: 2, ml: 2, color: authButton }}>
				Ошибка загрузки: {error.message}
			</Typography>
		);
	}

	if (!chats || chats.length === 0) {
		return (
			<Typography variant="body1" sx={{ mt: 2, ml: 2, color: authButton }}>
				Сообщений пока нет
			</Typography>
		);
	}

	return (
		<Grid container spacing={1} sx={{ flexDirection: "column", p: 0 }}>
			{chats &&
				chats.map((elem) => {
					return (
						<Grid item key={elem.lastMessage.chat_id}>
							<Link
								to={`/chat/${elem.lastMessage.chat_id}`}
								style={{ textDecoration: "none", color: "white", fontWeight: 600 }}
							>
								<Card sx={{ width: "100%", backgroundColor: mainButton, borderRadius: 4 }}>
									<CardHeader
										// avatar={<Avatar alt="user" src={senderId ? users[senderId].avatar_url : null} />}
										avatar={
											<AvatarGroup
												spacing="small"
												sx={{
													"& .MuiAvatar-root": {
														border: "none",
													},
												}}
											>
												{elem.participants.map((elem) => {
													return (
														<Avatar
															alt="user"
															key={elem.user_id}
															src={users[elem.user_id].avatar_url}
														/>
													);
												})}
											</AvatarGroup>
										}
										title={
											<Typography
												variant="subtitle2"
												sx={{ color: mainText }}
												key={elem.lastMessage.id}
											>
												{elem.participants.map((elem) => {
													return `${users[elem.user_id].username}, `;
												})}
											</Typography>
										}
										subheader={<MessageContent message={elem.lastMessage} color={secondaryText2} />}
									/>
								</Card>
							</Link>
						</Grid>
					);
				})}
		</Grid>
	);
};

ChatList.displayName = "ChatList";

export default ChatList;

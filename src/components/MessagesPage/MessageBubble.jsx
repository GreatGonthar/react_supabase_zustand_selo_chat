import React, { useState } from "react";
import { Box, Avatar, Typography, Grid } from "@mui/material";
import MessageContent from "./MessageContent";
import { Menu, MenuItem } from "@mui/material";
import { useUsersStore } from "../../lib/zustand";
import { delMessage } from "../../lib/supabaseUtils";
import { cozyCreasedKhaki, cozyEmeraldGreen, mainText, secondaryText, secondaryText2 } from "../../lib/colorsConst";

// элемент сообщения. облачко и аватар
const MessageBubble = ({ message, authUser }) => {
	const [anchorEl, setAnchorEl] = useState(null);

	const isOwnMessage = message?.sender_id === authUser?.id;

	const { users } = useUsersStore();

	const handleContextMenu = (event) => {
		if (isOwnMessage) {
			event.preventDefault();
			setAnchorEl(event.currentTarget);
		}
	};

	return (
		<>
			<Grid
				container
				onContextMenu={handleContextMenu}
				justifyContent={isOwnMessage ? "flex-end" : "flex-start"}
				sx={{ marginBottom: 1 }}
			>
				{!isOwnMessage && <Avatar alt="user" src={users[message.sender_id].avatar_url} />}

				<Box
					sx={{
						display: "flex",
						flexDirection: "column",
						maxWidth: isOwnMessage ? "100%" : "85%",
					}}
				>
					<Box
						sx={{
							// backgroundImage: isOwnMessage
							// 	? "url(../public/light_wood.jpg)"
							// 	: "url(../public/Texturelabs_Wood_189S.jpg)",
							// backgroundPosition: "center",
							// backgroundRepeat: "repeat",
							backgroundColor: isOwnMessage ? cozyCreasedKhaki : cozyEmeraldGreen,
							p: "8px 16px",
							borderRadius: 3,
							ml: 1,
							wordWrap: "break-word",
							maxWidth: "100%",
							width: "fit-content",
							boxShadow: "4px 4px 10px rgba(0, 0, 0, 0.6)",
							position: "relative",
							// Стрелочка для чужих сообщений (слева)
							...(isOwnMessage
								? {}
								: {
										"&::before": {
											content: '""',
											position: "absolute",
											left: -7,
											top: 12,
											width: 0,
											height: 0,
											borderTop: "8px solid transparent",
											borderBottom: "8px solid transparent",
											borderRight: "8px solid",
											borderRightColor: cozyEmeraldGreen,
										},
								  }),
							// Стрелочка для своих сообщений (справа)
							...(isOwnMessage
								? {
										"&::after": {
											content: '""',
											position: "absolute",
											right: -7,
											top: 12,
											width: 0,
											height: 0,
											borderTop: "8px solid transparent",
											borderBottom: "8px solid transparent",
											borderLeft: "8px solid",
											borderLeftColor: cozyCreasedKhaki,
										},
								  }
								: {}),
						}}
					>
						<MessageContent message={message} color={isOwnMessage ? cozyEmeraldGreen : cozyCreasedKhaki} />
					</Box>

					<Box sx={{ display: "flex", justifyContent: "flex-end" }}>
						<Typography fontSize={10} sx={{ color: mainText }}>
							{new Date(message.created_at).toLocaleString()}
						</Typography>
					</Box>
				</Box>
			</Grid>
			<Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
				<MenuItem
					onClick={() => {
						delMessage("chat", message);
						setAnchorEl(null);
					}}
				>
					Удалить
				</MenuItem>
			</Menu>
		</>
	);
};

export default MessageBubble;

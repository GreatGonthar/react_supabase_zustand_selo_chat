import Card from "@mui/material/Card";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Avatar, Box, CardHeader, IconButton } from "@mui/material";

import MessageInput from "../MessagesPage/MessageInput";
import { useNavigate } from "react-router-dom";
import { useAuthUserStore } from "../../lib/zustand";
import { mainButton, mainText, secondaryText2 } from "../../lib/colorsConst";

const fakemessage = {
	content:
		"А ты мне опять со своим вот этим, иди суетись дальше, это твоё распределение, это твой путь и твой горизонт познания и ощущения твоей природы, он несоизмеримо мелок по сравнению с моим, понимаешь? Я как будто бы уже давно глубокий старец, бессмертный, ну или там уже почти бессмертный, который на этой планете от её самого зарождения, ещё когда только Солнце только-только сформировалось как звезда, и вот это газопылевое облако, вот, после взрыва, Солнца, когда оно вспыхнуло, как звезда, начало формировать вот эти коацерваты, планеты, понимаешь, я на этой Земле уже как будто почти пять миллиардов лет живу и знаю её вдоль и поперёк этот весь мир, а ты мне какие-то... ",
};
const CommentCard = () => {
	const navigate = useNavigate();
	const { authUser } = useAuthUserStore();

	return (
		<Box sx={{ pb: 3 }}>
			<Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
				<IconButton
					// onClick={() => navigate(`/user/${authUser.id}`)}
					sx={{
						p: 0.5,
					}}
				>
					<Avatar
						alt="user"
						src={"authUser.user_metadata.avatar_url"}
						sx={{
							width: 40,
							height: 40,
						}}
					/>
				</IconButton>

				<Box sx={{ flex: 1, minWidth: 0 }}>
					<Box
						sx={{
							display: "flex",
							alignItems: "baseline",
							gap: 1.5,
							mb: 1,
							flexWrap: "wrap",
						}}
					>
						<Typography
							variant="subtitle2"
							sx={{
								fontWeight: 600,
								color: "text.primary",
								fontSize: "0.95rem",
							}}
						>
							{"metadata.name"}
						</Typography>

						<Typography
							variant="caption"
							sx={{
								color: "text.secondary",
								fontSize: "0.8rem",
							}}
						>
							24.12.18
						</Typography>
					</Box>

					<Typography
						variant="body1"
						sx={{
							lineHeight: 1.5,
							color: "text.primary",
							fontSize: "0.9rem",
							wordBreak: "break-word",
						}}
					>
						{fakemessage.content}
					</Typography>
				</Box>
			</Box>
		</Box>
	);
};

export default CommentCard;

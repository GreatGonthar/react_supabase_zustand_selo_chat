import BoardCard from "./BoardCard";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import MessageInput from "../MessagesPage/MessageInput";

import { Dialog, DialogContent } from "@mui/material";

import { useAuthUserStore, usePostsStore } from "../../lib/zustand";
import { useFetchPostsFromSupabase } from "../../lib/useFetchPostsFromSupabase";
import { authButton, mainButton, mainText, secondaryElement } from "../../lib/colorsConst";

const BoardMessages = () => {
	const [openMessageInput, setOpenMessageInput] = useState(false);
	const { authUser } = useAuthUserStore();
	useFetchPostsFromSupabase();
	const { posts } = usePostsStore();

	const reversePosts = [...posts].reverse();
	return (
		<>
			{reversePosts.map((item) => {
				return <BoardCard item={item} key={item.id} />;
			})}

			{authUser && (
				<Fab
					onClick={() => setOpenMessageInput((prev) => !prev)}
					sx={{
						position: "fixed",
						bottom: 64,
						right: 32,
						backgroundColor: authButton,
						color: mainText,
						zIndex: 1000, // Чтобы была поверх всех элементов
						"&:focus": {
							backgroundColor: authButton, // Возвращаем основной цвет
						},
						"&:focus-visible": {},
					}}
				>
					<AddIcon />
				</Fab>
			)}

			<Dialog open={openMessageInput} onClose={() => setOpenMessageInput(false)}>
				<DialogContent sx={{ background: mainButton, p: 0 }}>
					<MessageInput setOpenMessageInput={setOpenMessageInput} />
				</DialogContent>
			</Dialog>
		</>
	);
};

export default BoardMessages;

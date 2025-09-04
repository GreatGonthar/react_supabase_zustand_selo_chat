import { Box } from "@mui/material";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import ru from "@emoji-mart/data/i18n/ru.json";
import { customEmojis } from "../../lib/customEmojis";
//превью сообщения с картинкой
const PickerComponent = ({ setMessage }) => {
	return (
		<Box sx={{ display: "flex", justifyContent: "center", margin: "0 0 0 0 " }}>
			<Picker
				data={data}
				i18n={ru}
				navPosition="top"
				perLine={7}
				custom={customEmojis}
				categories={["стандартные", "RPG", "палата №6", "персоны", "laie"]}
				// categoryIcons={customCategoryIcons}
				onEmojiSelect={(emoji) => {
					const emojiToInsert = emoji.native
						? emoji.native // Для кастомных
						: `:${emoji.id}:`; // Для Unicode
					setMessage((prev) => `${prev} ${emojiToInsert}`);
				}}
				theme="dark" // или "dark", "auto"
			/>
		</Box>
	);
};

export default PickerComponent;

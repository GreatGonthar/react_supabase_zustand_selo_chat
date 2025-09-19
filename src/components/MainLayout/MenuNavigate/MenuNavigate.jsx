import React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { NavLink, useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { styled, useTheme } from "@mui/material/styles";
import { useAuthUserStore } from "../../../lib/zustand";
import { hover } from "../../../lib/colorsConst";
import homeIcon from "../../../../public/img/icons/home.png";
import userIcon from "../../../../public/img/icons/user.png";
import carrotIcon from "../../../../public/img/icons/carrot.png";
import wallIcon from "../../../../public/img/icons/wall.png";
import cowIcon from "../../../../public/img/icons/cow.png";
import traktorIcon from "../../../../public/img/icons/traktor.png";

const NavigateLink = ({ text, url, icon }) => {
	return (
		<NavLink to={`/${url}`} style={{ textDecoration: "none", color: "black" }}>
			{({ isActive }) => (
				<ListItem
					key={text}
					disablePadding
					sx={{
						backgroundColor: isActive ? hover : "transparent",
						mr: 5,
					}}
				>
					<ListItemButton>
						<ListItemIcon
							sx={{
								minWidth: "auto", // Важно! Отключаем фиксированную min-width от MUI
								mr: 1.5, // Или используйте значение меньше стандартного. 1 = 8px, 0.5 = 4px
								// mr: 0.5, // Попробуйте это значение для еще меньшего отступа
							}}
						>
							<img
								src={icon}
								alt={"icon"}
								style={{
									width: "24px", // Задаем финальный размер, который должен быть в интерфейсе
									height: "24px",
								}}
							/>
						</ListItemIcon>
						<ListItemText primary={text} />
					</ListItemButton>
				</ListItem>
			)}
		</NavLink>
	);
};
const MenuNavigate = ({ setOpenMenu, openMenu }) => {
	const { authUser } = useAuthUserStore();
	const theme = useTheme();
	const DrawerHeader = styled("div")(({ theme }) => ({
		display: "flex",
		alignItems: "center",
		padding: theme.spacing(0, 1),
		...theme.mixins.toolbar,
		justifyContent: "flex-end",
	}));
	return (
		<Drawer
			open={openMenu}
			onClose={() => setOpenMenu(false)}
			variant="temporary"
			transitionDuration={1000}
			PaperProps={{
				sx: {
					backgroundColor: "#D8C6A5",
				},
			}}
			sx={{ m: 10 }}
		>
			<Box>
				<DrawerHeader>
					<IconButton onClick={() => setOpenMenu(false)}>
						{theme.direction === "ltr" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
					</IconButton>
				</DrawerHeader>
				<Divider />
				<List onClick={() => setOpenMenu(false)}>
					<NavigateLink text={"Домой"} url={""} icon={homeIcon} />
					{authUser ? <NavigateLink text={"Селянин"} url={`user/${authUser.id}`} icon={userIcon} /> : false}
					<NavigateLink text={"Селяне"} url={"users"} icon={carrotIcon} />

					{authUser ? <NavigateLink text={"Общение"} url={"chats"} icon={cowIcon} /> : false}
					<NavigateLink text={"Посты"} url={"public"} icon={traktorIcon} />
					<Divider />
				</List>
			</Box>
		</Drawer>
	);
};

export default MenuNavigate;

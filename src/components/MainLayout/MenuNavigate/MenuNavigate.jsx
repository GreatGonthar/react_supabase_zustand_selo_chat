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

const NavigateLink = ({ text, url }) => {
	const theme = useTheme();
	return (
		<NavLink to={`/${url}`} style={{ textDecoration: "none", color: "black" }}>
			{({ isActive }) => (
				<ListItem
					key={text}
					disablePadding
					sx={{
						backgroundColor: isActive ? hover : "transparent",
					}}
				>
					<ListItemButton>
						<ListItemIcon>{isActive ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
						<ListItemText primary={text} />
					</ListItemButton>
				</ListItem>
			)}
		</NavLink>
	);
};
const MenuNavigate = ({ setOpenMenu, openMenu }) => {
	const { authUser } = useAuthUserStore();
	const navigate = useNavigate();
	const theme = useTheme();
	const blockMenu1 = ["Home", "User", "Users", "Messages", "Chat(toDo)"];
	const blockMenu2 = ["LogIn/LogOut"];
	const DrawerHeader = styled("div")(({ theme }) => ({
		display: "flex",
		alignItems: "center",
		padding: theme.spacing(0, 1),
		...theme.mixins.toolbar,
		justifyContent: "flex-end",
	}));
	return (
		<Drawer open={openMenu} onClose={() => setOpenMenu(false)} variant="temporary" transitionDuration={1000}>
			<Box>
				<DrawerHeader>
					<IconButton onClick={() => setOpenMenu(false)}>
						{theme.direction === "ltr" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
					</IconButton>
				</DrawerHeader>
				<Divider />
				<List onClick={() => setOpenMenu(false)}>
					<NavigateLink text={"Home"} url={""} />
					{authUser ? <NavigateLink text={"User"} url={`user/${authUser.id}`} /> : false}
					<NavigateLink text={"Users"} url={"users"} />

					{authUser ? <NavigateLink text={"Chats"} url={"chats"} /> : false}
					<NavigateLink text={"Public"} url={"public"} />
					<Divider />
					<NavigateLink text={"LogIn/LogOut"} url={"login"} />
				</List>
			</Box>
		</Drawer>
	);
};

export default MenuNavigate;

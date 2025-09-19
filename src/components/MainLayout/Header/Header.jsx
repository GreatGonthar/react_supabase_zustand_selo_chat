import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Box, Button, Avatar, IconButton, Container, Menu } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import MenuNavigate from "../MenuNavigate/MenuNavigate";
import { useAuthUserStore } from "../../../lib/zustand";
import { NavLink } from "react-router-dom";
import { authButton, hover } from "../../../lib/colorsConst";
import { handleGoogleAuth } from "../../../lib/handleGoogleAuth";
import vintageVillage from "../../../../public/img/Vintage_village.jpg";

const Header = () => {
	const [openMenu, setOpenMenu] = useState(false);
	const { authUser } = useAuthUserStore();
	const handleMenuToggle = () => {
		setOpenMenu(!openMenu);
	};

	return (
		<>
			<AppBar
				position="fixed"
				sx={{
					backgroundImage: `url(${vintageVillage})`,
					backgroundSize: "cover",
					backgroundRepeat: "no-repeat",
					color: hover,
				}}
			>
				<Toolbar sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
					<IconButton edge="start" color="black" onClick={handleMenuToggle}>
						<MenuIcon />
					</IconButton>
					<Typography
						variant="h4"
						sx={{
							fontFamily: "Ponomar, system-ui",
							fontWeight: "800",
							textShadow: "1px 1px 1px rgba(0,0,0,0.9)",
						}}
					>
						Село чат
					</Typography>
					{authUser?.user_metadata?.avatar_url ? (
						<NavLink to={`/user/${authUser.id}`}>
							<Avatar alt="user" src={authUser.user_metadata.avatar_url} />
						</NavLink>
					) : (
						<Button color="inherit" onClick={handleGoogleAuth}>
							<Typography
								sx={{
									color: authButton,
									fontWeight: 600,
									textShadow: "1px 1px 1px rgba(0,0,0,0.5)",
								}}
							>
								login
							</Typography>
						</Button>
					)}
				</Toolbar>
			</AppBar>
			{openMenu && <MenuNavigate setOpenMenu={setOpenMenu} openMenu={openMenu} />}
		</>
	);
};

export default Header;

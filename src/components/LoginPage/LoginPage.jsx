import { Box, Button, Typography } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import LogoutIcon from "@mui/icons-material/Logout";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { toast } from "react-toastify";
import { useAuthUserStore, useUsersStore } from "../../lib/zustand";

import { safeAddUserToSupabase } from "../../lib/addUserToSupabase";
import { handleGoogleAuth, handleLogout } from "../../lib/handleGoogleAuth";
import { mainButton, secondaryText2 } from "../../lib/colorsConst";

const LoginPage = () => {
	const [loading, setLoading] = useState(false);
	const { authUser, setAuthUser } = useAuthUserStore();
	const handleOut = () => {
		handleLogout();
		setAuthUser(null);
	};

	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "center", // Центрирование по вертикали
				alignItems: "center", // Центрирование по горизонтали (если нужно)
				height: "70vh", // Высота экрана
			}}
		>
			<Box>
				{authUser ? (
					<Button
						variant="contained"
						startIcon={<LogoutIcon />}
						sx={{ mt: 2, backgroundColor: mainButton, color: secondaryText2, p: 2 }}
						onClick={handleOut}
						disabled={loading}
					>
						выйти
					</Button>
				) : (
					<Button
						variant="contained"
						startIcon={<GoogleIcon />}
						sx={{ mt: 2, backgroundColor: mainButton, color: secondaryText2, p: 2 }}
						onClick={handleGoogleAuth}
						disabled={loading}
					>
						войти с google
					</Button>
				)}
			</Box>
		</Box>
	);
};

export default LoginPage;

import { useEffect } from "react";
import { useAuthUserStore } from "./zustand";

export const useAuthUserFromSupabase = () => {
	const { authUser, setAuthUser } = useAuthUserStore();
	useEffect(() => {
		const getAuthUser = async () => {
			const {
				data: { user },
				error,
			} = await supabase.auth.getUser();
			setAuthUser(user);
		};
		getAuthUser();
		if (user) {
			const data = {
				id: user.id,
				username: user.user_metadata.name,
				email: user.email,
				avatar_url: user.user_metadata.avatar_url,
			};
			safeAddUserToSupabase(data);
		}
	}, [setAuthUser]);
};

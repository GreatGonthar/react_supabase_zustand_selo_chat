import { toast } from "react-toastify";
import { supabase } from "./supabase";

export const safeAddUserToSupabase = async (userData) => {
	// Используем UPSERT (если пользователь с таким email или username уже есть, обновляем запись)
	const { data, error } = await supabase
		.from("users")
		.insert([userData], { onConflict: "email,username", ignoreDuplicates: true })
		.select();

	if (error) {
		// toast.error(`пользователь ${userData.username} уже существует`);
		console.log(`пользователь ${userData.username} уже существует`);
	}

	if (data && data.length > 0) {
		toast.success(`Пользователь ${data[0].username} успешно добавлен`);
		console.log(`Пользователь ${data[0].username} успешно добавлен`);
		return data[0];
	}

	return null;
};

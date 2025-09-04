import { createClient } from "@supabase/supabase-js";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey, {
	auth: {
		persistSession: true, // ⚡ ВКЛЮЧИТЕ ЭТУ ОПЦИЮ!
		storage: localStorage,
		autoRefreshToken: true,
		detectSessionInUrl: true,
	},
});

// export const handleUploadFileToSupabase = async (file) => {
// 	if (!file) return;

// 	// Генерируем уникальное имя файла
// 	function normalizeFileName(filename) {
// 		return filename
// 			.replace(/[^a-zA-Z0-9._-]/g, "_") // Заменяем все неразрешенные символы на _
// 			.replace(/\s+/g, "_"); // Заменяем пробелы на _
// 	}
// 	const fileName = `${Date.now()}_${normalizeFileName(file.name)}`;

// 	// Загружаем файл в Supabase Storage
// 	const { data, error } = await supabase.storage
// 		.from("photos") // Название бакета
// 		.upload(`public/${fileName}`, file, {
// 			contentType: file.type,
// 		}); // Путь + файл

// 	if (error) {
// 		console.error("Ошибка загрузки в supabase:", error);
// 	} else {
// 		console.log("Файл загружен в supabase:", data);

// 		// Получаем публичную ссылку
// 		const urlData = supabase.storage.from("photos").getPublicUrl(data.path);
// 		return urlData;
// 	}
// };

import { app, auth, db } from "../lib/firebase";
import { collection, getDocs, query, where, setDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { toast } from "react-toastify";
import { supabase } from "../lib/supabase";

export const signInWithGoogle = async (setLoading) => {
	const provider = new GoogleAuthProvider();
	await supabase.auth.signInWithPassword({
		email: import.meta.env.VITE_SUPABASE_EMAIL,
		password: import.meta.env.VITE_SUPABASE_PASSWORD,
	});
	try {
		// Вход с помощью всплывающего окна
		setLoading(true);
		const result = await signInWithPopup(auth, provider);
		setLoading(false);
		// Успешный вход
		const user = result.user;
		toast.success(`аутентифицирован как ${user.displayName}`);

		return user;
	} catch (error) {
		// Обработка ошибок
		const errorCode = error.code;
		const errorMessage = error.message;
		toast.info(`Ошибка при входе: ${(errorCode, errorMessage)}`);
	} finally {
		setLoading(false);
	}
};

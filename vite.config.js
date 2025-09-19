import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		// https: {
		// 	key: fs.readFileSync(path.resolve(__dirname, "192.168.0.12-key.pem")),
		// 	cert: fs.readFileSync(path.resolve(__dirname, "192.168.0.12.pem")),
		// },
		host: "localhost", // Разрешаем доступ с других устройств
		port: 5173,
	},
	build: {
		outDir: "dist",
		rollupOptions: {
			input: {
				main: "./index.html",
			},
		},
	},
});

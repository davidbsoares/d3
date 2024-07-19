import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "tailwindcss";

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			"core": path.resolve(__dirname, "./src/core/"),
			"app": path.resolve(__dirname, "./src/app/"),
			"pages": path.resolve(__dirname, "./src/pages/")
		}


	},
	plugins: [react()],
	css: {
		postcss: {
			plugins: [tailwindcss()]
		}
	}
});
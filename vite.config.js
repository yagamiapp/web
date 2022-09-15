import { sveltekit } from "@sveltejs/kit/vite";

const config = {
	plugins: [sveltekit()],
	server: {
		port: 4000,
	},
};

export default config;

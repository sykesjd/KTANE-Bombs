/// <reference types="@sveltejs/kit" />

interface ImportMeta {
	env: {
		VITE_DISCORD_CLIENT_ID: string;
		VITE_DISCORD_CLIENT_SECRET: string;
		VITE_DISCORD_REDIRECT_URL: string;
	};
}

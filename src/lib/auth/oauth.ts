import OAuth from 'discord-oauth2';

export const scope = ['identify'];

export default new OAuth({
	clientId: import.meta.env.VITE_DISCORD_CLIENT_ID,
	clientSecret: import.meta.env.VITE_DISCORD_CLIENT_SECRET,
	redirectUri: import.meta.env.VITE_DISCORD_REDIRECT_URL
});

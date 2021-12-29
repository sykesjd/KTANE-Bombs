<script lang="ts">
	import { session } from '$app/stores';
	import type { FrontendUser } from '$lib/types';

	const user: FrontendUser | null = $session.user;
</script>

<div class="navbar">
	<a href="/">Home</a>
	<div class="block user">
		{#if user}
			<img
				class="avatar"
				src="https://cdn.discordapp.com/avatars/{user.id}/{user.avatar}.webp?size=32"
				alt="Avatar"
			/>
			<span>{user.username}</span>
		{:else}
			<a rel="external" href="/login">Login</a>
		{/if}
	</div>
	{#if user}
		<a class="block" rel="external" href="/logout">Logout</a>
	{/if}
</div>
<div class="padding">
	<slot />
</div>

<style>
	:root {
		--gap: 5px;
		--background: lightgray;
		--foreground: white;
		--text-color: black;
		--light-text-color: rgb(100, 100, 100);
		--link-text-color: currentColor;
		--link-visited-text-color: currentColor;
		--accent: #bc421e;
	}

	@media (prefers-color-scheme: dark) {
		:root {
			--background: rgb(50, 50, 50);
			--foreground: rgb(30, 30, 30);
			--text-color: white;
			--light-text-color: rgb(150, 150, 150);
			--link-text-color: rgb(200, 200, 200);
			--link-visited-text-color: rgb(130, 130, 130);
		}
	}

	:global(html) {
		height: 100%;
	}

	:global(body) {
		height: 100%;
		margin: 0;
		font-family: sans-serif;
		color: var(--text-color);
		background: var(--background);
	}

	:global(#svelte) {
		height: 100%;
	}

	:global(a:link) {
		color: var(--link-text-color);
	}

	:global(a:visited) {
		color: var(--link-visited-text-color);
	}

	:global(.foreground) {
		background-color: var(--foreground);
	}

	:global(.padding) {
		padding: var(--gap);
	}

	:global(.margin) {
		margin: var(--gap);
	}

	:global(.block) {
		background-color: var(--foreground);
		padding: var(--gap);
	}

	.navbar {
		display: flex;
		padding: var(--gap);
		gap: var(--gap);
		font-size: 125%;

		background: var(--accent);
		border-bottom: var(--background) 2px dashed;
	}

	.navbar > a {
		color: var(--link);
		text-decoration: none;
	}

	.navbar > * {
		background: var(--foreground);
		padding: var(--gap);
	}

	.navbar .user {
		margin-left: auto;

		display: flex;
		flex-direction: row;
		gap: var(--gap);
		align-items: center;
	}

	.avatar {
		border-radius: 50%;
		height: 20px;
	}
</style>

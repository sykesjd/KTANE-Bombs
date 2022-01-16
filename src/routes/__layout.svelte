<script lang="ts">
	import { session } from '$app/stores';
	import { FrontendUser, Permission } from '$lib/types';
	import UserCard from '$lib/UserCard.svelte';
	import { hasPermission } from '$lib/util';
	import { onMount } from 'svelte';
	import { toasts, ToastContainer, FlatToast } from 'svelte-toasts';

	const user: FrontendUser | null = $session.user;

	onMount(() => {
		const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

		toasts.setDefaults({
			theme: darkQuery.matches ? 'dark' : 'light',
			placement: 'top-center',
			duration: 5000
		});

		darkQuery.addEventListener('change', (event) => {
			toasts.setDefaults({
				theme: event.matches ? 'dark' : 'light'
			});
		});
	});
</script>

<div class="navbar-background">
	<div class="navbar max-width">
		<a class="block" href="/">Home</a>
		<a class="block" href="/upload">Upload</a>
		{#if user}
			{#if hasPermission(user, Permission.ModifyPermissions)}
				<a class="block" href="/users">Users</a>
			{/if}

			<div style="margin-left: auto;">
				<UserCard {user} />
			</div>
			<a class="block" rel="external" href="/logout">Logout</a>
		{:else}
			<div class="block">
				<a rel="external" href="/login">Login</a>
			</div>
		{/if}
	</div>
</div>
<div class="flex column max-width padding">
	<slot />
</div>

<ToastContainer let:data>
	<FlatToast {data} />
</ToastContainer>

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

	:global(button) {
		background-color: var(--accent);
		color: white;
		padding: 2.5px 5px;
		border: 1px solid hsl(14, 72%, 33%);
		border-radius: 5px;
		font-size: inherit;
	}

	:global(button:hover) {
		background-color: hsl(14, 72%, 38%);
	}

	:global(button:active) {
		background-color: hsl(14, 72%, 33%);
	}

	:global(button:disabled) {
		opacity: 0.5;
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

	:global(.flex) {
		display: flex;
		gap: var(--gap);
	}

	:global(.flex.column) {
		flex-direction: column;
	}

	:global(.flex.content-width) {
		align-items: flex-start;
	}

	:global(h1.header) {
		background: var(--foreground);
		text-align: center;
		padding: var(--gap);
		font-size: 200%;
		margin: 0;
	}

	:global(.st-toast.light) {
		background: white !important;
	}

	.navbar-background {
		background: var(--accent);
		border-bottom: var(--background) 2px dashed;
	}

	.navbar {
		display: flex;
		padding: var(--gap);
		gap: var(--gap);
		font-size: 125%;
		white-space: nowrap;
	}

	.navbar > a {
		color: var(--link);
		text-decoration: none;
	}

	.max-width {
		width: min(calc(100vw - 2 * var(--gap)), 1150px);
		margin: 0 auto;
	}
</style>

<script context="module" lang="ts">
	import type { ErrorLoad } from '@sveltejs/kit';

	export const load: ErrorLoad = function ({ error, status, page }) {
		return {
			props: {
				status,
				error,
				path: page.path
			}
		};
	};
</script>

<script lang="ts">
	import { session } from '$app/stores';

	export let status: number;
	export let error: Error;
	export let path: string;

	const user: { username: string } | null = $session.user;

	// https://stackoverflow.com/a/7616484/8213163
	function hashCode(value: string) {
		var hash = 0,
			i,
			chr;
		if (value.length === 0) return hash;
		for (i = 0; i < value.length; i++) {
			chr = value.charCodeAt(i);
			hash = (hash << 5) - hash + chr;
			hash |= 0; // Convert to 32bit integer
		}
		return hash;
	}

	const message =
		status >= 500
			? `Looks like ${path} ran into a problem while loading the page, automatically solving page.`
			: `@${user?.username ?? 'User'}, that command for ${path} (${
					hashCode(path) % 100
			  }) is invalid.`;
</script>

<div class="container">
	<div class="block" style="padding: calc(var(--gap) * 5);">
		<h1 style="margin-top: 0;">{status}</h1>
		<div>{error.message}</div>
	</div>
	<div class="block" style="margin-top: auto;">
		<i>{message}</i>
	</div>
</div>

<style>
	:global(#svelte) {
		display: grid;
		grid-template-rows: auto 1fr;
	}

	.container {
		display: flex;
		flex-direction: column;

		height: 100%;
	}
</style>

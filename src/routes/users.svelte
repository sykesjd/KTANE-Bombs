<script context="module" lang="ts">
	import type { FrontendUser } from '$lib/types';
	import type { Load } from '@sveltejs/kit';
	import { authLoad, jsonLoadStatic } from '$lib/loaders';

	export const load: Load = authLoad(
		jsonLoadStatic({
			users: 'users'
		})
	);
</script>

<script lang="ts">
	import UserCard from '$lib/UserCard.svelte';

	export let users: FrontendUser[];
</script>

<svelte:head>
	<title>Users</title>
</svelte:head>

<h1 class="header">Users</h1>
{#each users as user}
	<a href="user/{user.id}">
		<UserCard {user} />
	</a>
{/each}

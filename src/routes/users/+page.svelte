<script lang="ts">
	throw new Error("@migration task: Add data prop (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292707)");

	import type { FrontendUser } from '$lib/types';
	import UserCard from '$lib/cards/UserCard.svelte';

	export let users: FrontendUser[];

	// Sort users
	users.sort((a, b) => a.username.localeCompare(b.username));
</script>

<svelte:head>
	<title>Users</title>
</svelte:head>

<h1 class="header">Users</h1>
{#each users as user}
	<a href="user/{user.username}">
		<UserCard {user} />
	</a>
{/each}

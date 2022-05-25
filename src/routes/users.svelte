<script lang="ts">
	import type { FrontendUser } from '$lib/types';
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

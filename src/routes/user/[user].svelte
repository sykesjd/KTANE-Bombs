<script lang="ts">
	import type { FrontendUser } from '$lib/types';
	import UserPermissions from './_UserPermissions.svelte';

	export let username: string;
	export let user: FrontendUser | null;

</script>

<svelte:head>
	<title>{username}</title>
</svelte:head>

<h1 class="header">Permissions</h1>
<div class="block flex column content-width">
	<UserCard {user} />
	<div class="flex">
		{#each Object.entries(permissions) as [name, value]}
			<input
				type="checkbox"
				id={name}
				checked={newPermissions.has(value)}
				on:change={() => togglePermission(value)}
			/>
			<label for={name}>{name}</label>
		{/each}
	</div>
	<button disabled={!modified} on:click={saveChanges}>Save Changes</button>
</div>
{#if user !== null}
	<UserPermissions {user} />
{/if}

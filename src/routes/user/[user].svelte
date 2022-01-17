<script context="module" lang="ts">
	import { authLoad, jsonLoad } from '$lib/loaders';
	import type { FrontendUser } from '$lib/types';
	import type { Load } from '@sveltejs/kit';

	export const load: Load = authLoad(
		jsonLoad(({ params }) => {
			const { user } = params;

			return {
				user: `user/${user}`
			};
		})
	);
</script>

<script lang="ts">
	import { Permission } from '$lib/types';
	import UserCard from '$lib/UserCard.svelte';

	export let user: FrontendUser;

	const permissions: Record<string, number> = {};
	for (const [name, value] of Object.entries(Permission)) {
		if (typeof value === 'string') {
			continue;
		}

		permissions[name] = value;
	}

	let newPermissions = new Set(user.permissions);

	function togglePermission(permission: number) {
		if (newPermissions.has(permission)) {
			newPermissions.delete(permission);
		} else {
			newPermissions.add(permission);
		}

		newPermissions = newPermissions;
	}

	$: modified =
		user.permissions.length != newPermissions.size ||
		user.permissions.some((permission) => !newPermissions.has(permission));

	async function saveChanges() {
		await fetch(`/user/${user.id}.json`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(Array.from(newPermissions))
		});

		user.permissions = Array.from(newPermissions);
	}
</script>

<svelte:head>
	<title>{user.username}</title>
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

<script lang="ts">
	import { Permission, type FrontendshownUser } from '$lib/types';

	export let shownUser: FrontendshownUser;

	const permissions: Record<string, number> = {};
	for (const [name, value] of Object.entries(Permission)) {
		if (typeof value === 'string') {
			continue;
		}

		permissions[name] = value;
	}
	let newPermissions = new Set(shownUser.permissions);

	function togglePermission(permission: number) {
		if (newPermissions.has(permission)) {
			newPermissions.delete(permission);
		} else {
			newPermissions.add(permission);
		}

		newPermissions = newPermissions;
	}

	$: modified =
		shownUser.permissions.length != newPermissions.size ||
		shownUser.permissions.some((permission) => !newPermissions.has(permission));

	async function saveChanges() {
		await fetch(`/user/${shownUser.id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(Array.from(newPermissions))
		});

		shownUser.permissions = Array.from(newPermissions);
	}
</script>

<div class="block flex column content-width">
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

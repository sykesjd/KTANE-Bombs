<script lang="ts">
	import { session } from '$app/stores';
	import Dialog from '$lib/Dialog.svelte';
	import Input from '$lib/Input.svelte';
	import { Permission, type FrontendUser } from '$lib/types';
	import { hasPermission } from '$lib/util';
	import UserPermissions from './_UserPermissions.svelte';

	export let username: string;
	export let user: FrontendUser | null;

	let newUsername = username;
	const oldUsername = username;

	let dialog: HTMLDialogElement;

	async function editName() {
		const response = await fetch('/user/rename', {
			method: 'POST',
			body: JSON.stringify({
				oldUsername,
				username: newUsername
			})
		});

		if (response.ok) {
			location.href = `/user/${newUsername}`;
			return;
		}

		alert('Failed to edit name.');
	}
</script>

<svelte:head>
	<title>{username}</title>
</svelte:head>

<h1 class="header">{username}</h1>
<div class="block">
	{#if hasPermission($session.user, Permission.RenameUser)}
		<button on:click={() => dialog.showModal()}>Edit Name</button>
	{/if}
	<Dialog bind:dialog>
		<div class="flex column content-width">
			<h2>Edit Name</h2>
			<form on:submit|preventDefault={() => editName()}>
				<Input
					id="username"
					label="Username"
					bind:value={newUsername}
					required
					validate={(value) => (value === oldUsername ? 'Please enter the new username.' : true)}
				/>
				<button type="submit">Submit</button>
			</form>
		</div>
	</Dialog>
</div>
{#if user !== null}
	<UserPermissions {user} />
{/if}

<style>
	h2 {
		margin: 0;
	}
</style>

<script lang="ts">
	import { session } from '$app/stores';
	import Dialog from '$lib/Dialog.svelte';
	import Input from '$lib/Input.svelte';
	import { Completion, Mission, Permission, type FrontendUser } from '$lib/types';
	import { hasPermission } from '$lib/util';
	import UserPermissions from './_UserPermissions.svelte';

	export let username: string;
	export let user: FrontendUser | null;
	export let completions: (Pick<Completion, 'team' | 'solo'> & { mission: { name: string } })[];

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

	function getPersonColor(completion: Pick<Completion, 'team' | 'solo'>): string {
		return completion.team.length === 1
			? completion.solo
				? '#00ffff'
				: 'hsl(300, 100%, 75%)'
			: completion.team.indexOf(username) === 0
			? 'hsl(210, 100%, 65%)'
			: 'hsl(0, 100%, 70%)';
	}
</script>

<svelte:head>
	<title>{username}</title>
</svelte:head>

<h1 class="header">{username}</h1>
<div class="block">
	<h2>Solves</h2>
	<div class="solves flex grow">
		{#each completions as completion}
			<a href="/mission/{completion.mission.name}">
				<div class="block" style:background-color={getPersonColor(completion)}>
					{completion.mission.name}
				</div>
			</a>
		{/each}
	</div>
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

	.solves {
		flex-wrap: wrap;
		white-space: nowrap;

		max-height: 250px;
		overflow-y: scroll;
	}

	.solves a {
		color: black;
	}
</style>

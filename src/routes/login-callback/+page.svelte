<script lang="ts">

	import Input from '$lib/controls/Input.svelte';
	import type { TokenRequestResult } from 'discord-oauth2';
	import { applyAction } from '$app/forms';
	export let data;
	let oauthResult: TokenRequestResult = data.result;
	let username: string = data.username;
	let takenUsernames: string[] = data.takenUsernames;

	async function submit() {
		if (takenUsernames.includes(username)) return;
		
		const fData = new FormData();
		fData.append('result', JSON.stringify(oauthResult))
		fData.append('username',username)

		const response = await fetch('?/editName', {
			method: 'POST',
			body: fData
		});
		/** @type {import('@sveltejs/kit').ActionResult} */
	 const result = await response.json();

	 applyAction(result);
		
	}
</script>

<svelte:head>
	<title>Username Conflict</title>
</svelte:head>

<h1 class="header">Username Conflict</h1>
<div class="block flex column content-width">
	<div>Someone already has that username, please select another.</div>
	<form method="POST", on:submit|preventDefault={submit}>
		<Input
			name="username"
			id="username"
			label="Username"
			bind:value={username}
			validate={(value) => !takenUsernames.includes(value)}
		/>
		<button type="submit">Submit</button>
	</form>
</div>

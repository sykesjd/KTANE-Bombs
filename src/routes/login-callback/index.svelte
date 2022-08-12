<script lang="ts">
	import Input from '$lib/Input.svelte';
	import type { TokenRequestResult } from 'discord-oauth2';

	export let result: TokenRequestResult;
	export let username: string;
	export let takenUsernames: string[];

	async function submit() {
		if (takenUsernames.includes(username)) return;

		const response = await fetch('/login-callback', {
			method: 'POST',
			body: JSON.stringify({ result, username })
		});

		if (response.redirected) {
			location.href = response.url;
		}
	}
</script>

<svelte:head>
	<title>Username Conflict</title>
</svelte:head>

<h1 class="header">Username Conflict</h1>
<div class="block flex column content-width">
	<div>Someone already has that username, please select another.</div>
	<form on:submit|preventDefault={submit}>
		<Input
			id="username"
			label="Username"
			bind:value={username}
			validate={(value) => !takenUsernames.includes(value)}
		/>
		<button type="submit">Submit</button>
	</form>
</div>

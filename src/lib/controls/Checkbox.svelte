<script lang="ts">
	export let id: string;
	export let checked: any;
	export let label: string = '';
	export let sideLabel: boolean = false;
	export let labelAfter: boolean = false;
	export let disabled: boolean = false;
</script>

<div class:hstack={sideLabel}>
	{#if !labelAfter}
	<label for={id}>
		{label}
		<slot />
	</label>
	{/if}
	<input {id} type="checkbox" bind:checked {disabled}
		on:change/>
	{#if labelAfter}
	<label for={id}>
		{label}
		<slot />
	</label>
	{/if}
</div>

<style>
	input {
		display: block;
		background-color: rgb(15, 15, 15);
		padding: var(--gap);
		border: none;
		border-radius: 5px;
		color: white;
		box-sizing: border-box;
	}
	label {
		cursor: pointer;
		user-select: none;
	}
	.hstack {
		gap: 3px;
	}
</style>

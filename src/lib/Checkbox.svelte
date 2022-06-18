<script lang="ts">
	export let id: string;
	export let checked: any;
	export let label: string = '';
</script>

<div class="flex column content-width">
	<label for={id}>
		{label}
		<slot />
	</label>
	<input {id} type="checkbox" bind:checked />
</div>

<style>
	input {
		background-color: rgb(15, 15, 15);
		padding: var(--gap);
		border: none;
		border-radius: 5px;
		color: white;
		box-sizing: border-box;
	}
</style>

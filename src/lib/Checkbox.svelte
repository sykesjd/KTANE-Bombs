<script lang="ts">
	export let id: string;
	export let checked: any;
	export let label: string = '';
	export let disabled: boolean = false;
</script>

<div>
	<label for={id}>
		{label}
		<slot />
	</label>
	<input {id} type="checkbox" bind:checked {disabled} />
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
</style>

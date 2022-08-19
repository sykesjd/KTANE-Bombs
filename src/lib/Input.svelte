<script lang="ts">
	import { onMount } from 'svelte';

	export let id: string;
	export let value: any;
	export let label: string;
	export let type: string = 'text';
	export let placeholder: string = '';
	export let required: boolean = false;
	export let options: any[] | null = null;
	export let display = (value: any) => value.toString();
	export let parse = (value: string): any => value;
	export let validate = (_value: any): boolean | string => true;

	let input: HTMLInputElement;
	let displayValue = display(value);

	let error = '';

	const handleInput = (e: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
		displayValue = e.currentTarget.value;

		let newValue = parse(e.currentTarget.value);
		if (options !== null) {
			for (const option of options) {
				if (newValue === display(option)) {
					value = option;
					return;
				}
			}

			newValue = null;
		}

		if (handleValidity(newValue)) value = newValue;
	};

	function handleValidity(value: any) {
		const validity = validate(value);
		input.setCustomValidity(
			typeof validity === 'string' ? validity : validity ? '' : 'Invalid value.'
		);
		input.reportValidity();

		error = input.validationMessage;

		return validity === true || validity === '';
	}

	onMount(() => handleValidity(value));
</script>

<div>
	<label for={id}>
		{label}
		<slot />
	</label>
	<input
		{id}
		{type}
		{placeholder}
		{required}
		bind:this={input}
		list={id + '-list'}
		value={displayValue}
		on:input={handleInput}
		on:change={() => {
			if (error === '') {
				displayValue = display(value);
			}
		}}
	/>
	{#if error}
		<div style="color: rgb(255, 80, 80);">{error}</div>
	{/if}
	{#if options}
		<datalist id={id + '-list'}>
			{#each options as option}
				<option value={display(option)} />
			{/each}
		</datalist>
	{/if}
</div>

<style>
	input {
		background-color: rgb(15, 15, 15);
		padding: var(--gap);
		border: none;
		border-radius: 5px;
		color: white;
		width: 100%;
		box-sizing: border-box;
	}
</style>

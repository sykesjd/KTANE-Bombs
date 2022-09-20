<script lang="ts">
	import { onMount } from 'svelte';

	export let id: string;
	export let value: any;
	export let label: string = '';
	export let type: string = 'text';
	export let placeholder: string = '';
	export let classes: string = '';
	export let required: boolean = false;
	export let sideLabel: boolean = false;
	export let options: any[] | null = null;
	export let display = (value: any) => value.toString();
	export let parse = (value: string): any => value;
	export let validate = (_value: any): boolean | string => true;
	export let handleChange = () => {};
	export let handleInputCall = () => {};

	let text_area: HTMLTextAreaElement;
	let displayValue = display(value);

	let error = '';

	const handleInput = (e: Event & { currentTarget: EventTarget & HTMLTextAreaElement }) => {
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
		handleInputCall();
	};

	function handleValidity(value: any) {
		const validity = validate(value);
		text_area.setCustomValidity(
			typeof validity === 'string' ? validity : validity ? '' : 'Invalid value.'
		);
		text_area.reportValidity();

		error = text_area.validationMessage;

		return validity === true || validity === '';
	}

	onMount(() => handleValidity(value));
</script>

<div class="{sideLabel ? 'hstack':''}">
	<label for={id}>
		{label}
		<slot />
	</label>
	<textarea
		{id}
		{type}
		{placeholder}
		class={classes}
		{required}
		bind:this={text_area}
		list={id + '-list'}
		value={displayValue}
		on:input={handleInput}
		on:change={handleChange != undefined ? handleChange : () => {
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
	textarea {
		background-color: rgb(15, 15, 15);
		padding: var(--gap);
		border: none;
		border-radius: 5px;
		color: white;
		width: 100%;
		box-sizing: border-box;
	}
	.hstack {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 3px;
	}
	label {
		user-select: none;
	}
</style>

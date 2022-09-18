<script lang="ts">
	import type { Mission } from '$lib/types';
	import Checkbox from '$lib/controls/Checkbox.svelte';
	import Input from '$lib/controls/Input.svelte';
	import { onMount } from 'svelte';
	import { writable, type Writable } from "svelte/store";
	import { browser } from "$app/env";

	let searchOptionsW: Writable<string | null>;
	let searchOptions: string;
	let searchField: HTMLInputElement | null;
    export let missions: Mission[];
    export let missionCards: any = {};
	export let validSearchOptions = [true, false];
	export let searchOptionBoxes = ["names", "authors"];
	export let searchText: string = "";
    export let resultsText = missions.length;

	if (browser) {
		searchOptions = localStorage.getItem("searchOptions") || '';
		searchOptionBoxes.forEach((o, i) => {
			validSearchOptions[i] = searchOptions.includes(o);
		});
		searchOptionsW = writable(searchOptions);
		searchOptionsW.subscribe(value => {
			localStorage.setItem("searchOptions", value || '');
		});
	}
	let searching = false;
	
	function setSearchOptions() {
		let options = searchOptionBoxes.filter((_, idx) => { return validSearchOptions[idx]; });
		searchOptions = JSON.stringify(options);
		searchOptionsW.set(searchOptions);
		searchOptionBoxes.forEach((o, i) => {
			validSearchOptions[i] = searchOptions.includes(o);
		});
		updateSearch();
	}

	function clearSearch() {
		searchText = '';
		if (searchField) searchField.value = '';
		Object.keys(missionCards).forEach(name => {
			missionCards[name].style.display = "grid";
		});
		resultsText = missions.length;
		searchField?.focus();
	}

	function updateSearch () {
		searching = false;
		updateSearchTerms();
	}

	function updateSearchTerms() {
		resultsText = 0;
		searching = true;
		for (let i = 0; searching && i < missions.length; i++) {
			let name = missions[i].name;
			let searchWhat = '';
			if (searchOptions.includes("names")) searchWhat += ' ' + name.toLowerCase();
			if (searchOptions.includes("authors")) searchWhat += ' ' + missions[i].authors?.join(' ').toLowerCase();

			if (searchWhat.includes(searchText.toLowerCase())) {
				missionCards[name].style.display="grid";
				resultsText++;
			}
			else
				missionCards[name].style.display="none";
		}
		// console.log("Searched: " + searchText);
	}

	onMount(async ()=> {
		searchField = <HTMLInputElement>document.getElementById("search-field");
		searchField?.focus();
	});
</script>

<div class="search-bar">
	<span>Results: {resultsText}</span>
	<div class="spacer2"></div>
	<Input label="Search:" sideLabel={true} id="search-field"
		handleInputCall={updateSearch}
		bind:value={searchText}/>
	<div class="search-field-clear" on:click={clearSearch}></div>
	
	{#each searchOptionBoxes as option, index}
		<Checkbox id="search-by-{option}"
			label={option.charAt(0).toUpperCase() + option.slice(1)}
			sideLabel={true} labelAfter={true}
			handleChange={setSearchOptions}
			bind:checked={validSearchOptions[index]}>
		</Checkbox>
	{/each}
	<div class="spacer"></div>
	<div class="tab">Filters</div>
</div>

<style>
	.search-bar {
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		gap: 3px;
	}
	:global(#search-field) { min-width: 55px; }
	.search-bar > span { min-width: 100px; }
	.search-bar .spacer { width: 50px; }
	.search-bar .spacer2 { width: 100px; }

	.tab {
		/* background-color: #eef; */
		background-color: #BBB;
		color: #024;
		border: 1px solid #eef;
		border-bottom: none;
		border-top-color: #ccf;
		border-right-color: #ccf;
		border-right-width: 2px;
		border-top-left-radius: .5em;
		border-top-right-radius: .5em;
		/* cursor: pointer; */
		padding: .2em .7em .1em;
		margin-left: .2em;
	}

	.search-field-clear {
		background: url('$lib/img/clear-button.svg') right center no-repeat;
		width: 1.25em;
		height: 1.25em;
		min-width: 1.25em;
		margin-right: 5px;
		display: inline-block;
		vertical-align: middle;
		cursor: pointer;
	}
</style>
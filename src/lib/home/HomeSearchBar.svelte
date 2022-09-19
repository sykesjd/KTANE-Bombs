<script lang="ts">
	import type { Mission } from '$lib/types';
	import Checkbox from '$lib/controls/Checkbox.svelte';
	import Input from '$lib/controls/Input.svelte';
	import LayoutSearchFilter from '$lib/comp/LayoutSearchFilter.svelte';
	import { onMount } from 'svelte';
	import { writable, type Writable } from "svelte/store";
	import { browser } from "$app/env";

	let searchOptionsW: Writable<string | null>;
	let searchOptions: string;
	let searchField: HTMLInputElement | null;
	export let missions: Mission[];
	export let missionCards: { [name: string]: any } = {};
	export let validSearchOptions = [true, false];
	export let searchOptionBoxes = ["names", "authors"];
	// export let searchText: string = "";
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
	let layoutSearch: LayoutSearchFilter;
	
	function setSearchOptions() {
		let options = searchOptionBoxes.filter((_, idx) => { return validSearchOptions[idx]; });
		searchOptions = JSON.stringify(options);
		searchOptionsW.set(searchOptions);
		searchOptionBoxes.forEach((o, i) => {
			validSearchOptions[i] = searchOptions.includes(o);
		});
		layoutSearch.updateSearch();
	}

	function bombSearchFilter(name:string, searchText:string) {
		let searchWhat = '';
		if (searchOptions.includes("names")) searchWhat += ' ' + name.toLowerCase();
		if (searchOptions.includes("authors")) searchWhat += ' ' + missions.find(x => x.name == name)?.authors?.join(' ').toLowerCase();

		return searchWhat.includes(searchText.toLowerCase());
	}

	onMount(async ()=> {
		searchField = <HTMLInputElement>document.getElementById("bomb-search-field");
		searchField?.focus();
	});
</script>

<div class="search-bar">
	<span>Results: {resultsText}</span>
	<div class="spacer2"></div>
	<LayoutSearchFilter id="bomb-search-field" label="Search:"
		bind:items={missionCards}
		filterFunc={bombSearchFilter}
		bind:numResults={resultsText}
		bind:this={layoutSearch}/>
	
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
</style>
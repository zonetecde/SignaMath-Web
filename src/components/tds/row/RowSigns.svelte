<script lang="ts">
	import type Cellule from '../../../models/cellule';
	import CellSign from './CellSign.svelte';

	export let cellules: Cellule[];

	// Pour que les colonnes se rejoignent (le trait continue)
	export let extendSize: boolean;
</script>

<div
	class={'w-full flex flex-row text-md text-center ' +
		(cellules.some((x) => x.sign.length > 3)
			? '' /* Message d'intervalle de définition, taille du texte réduit */
			: 'lg:text-3xl')}
>
	{#each cellules as cellule, index}
		<CellSign {cellule} {index} {extendSize} />
	{/each}
</div>

<style>
	::-webkit-scrollbar {
		height: 8px;
	}

	::-webkit-scrollbar-thumb {
		background-color: #ddbdbd; /* Change the color of the scrollbar thumb */
	}

	::-webkit-scrollbar-thumb:hover {
		background-color: #968686; /* Change the color on hover */
	}

	::-webkit-scrollbar-thumb:active {
		background-color: #4d4444; /* Change the color on hover */
	}
</style>

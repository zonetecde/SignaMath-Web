<script lang="ts">
	import type Cellule from '../../../models/cellule';
	import CellSign from './CellSign.svelte';

	export let cellules: Cellule[];

	// Pour que les colonnes se rejoignent (le trait continue)
	export let extendSize: boolean;

	$: textSize = cellules.some((x) => x.sign.length > 3) ? 'text-md' : 'text-md lg:text-3xl';
</script>

<div class="w-full flex flex-row text-center {textSize}">
	{#each cellules as cellule, index}
		<CellSign {cellule} {index} {extendSize} />
	{/each}
</div>

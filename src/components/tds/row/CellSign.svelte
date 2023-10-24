<script lang="ts">
	import type Cellule from '../../../models/cellule';

	export let cellule: Cellule;
	export let index: number;

	let columnClass = 'column-' + index;
</script>

<div class={'w-full h-auto  -my-2.5 relative '}>
	<div
		class={`h-full border-black select-none flex justify-center items-center ${columnClass} ` +
			(index === 0 ? '' : 'border-l')}
		id={cellule.sign}
	>
		{cellule.sign}
	</div>

	<!-- Met un trait avec un 0 pour la colonne à gauche du signe si l'expression s'annule en 0 à la solution -->
	{#if cellule.doesCancelOnZero}
		<!-- Annulation en 0 -->
		<p
			class="absolute select-none -translate-y-1/2 top-1/2 -translate-x-1/2 left-[0.05rem] md:left-[0.02rem] lg:left-[0.01rem] w-fit font-normal text-lg lg:text-3xl"
		>
			0
		</p>
	{/if}
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

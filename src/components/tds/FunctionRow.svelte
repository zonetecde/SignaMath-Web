<script lang="ts">
	import Choix from '../../models/choix';
	import type Solution from '../../models/solution';
	import SaisieFonction from '../SaisieFonction.svelte';

	export let functionName: string = 'f';
	export let variableName: string = 'x';
	export let inRangeSolutions: Solution[];
	export let signs: string[] = [];

	export let choix: Choix = Choix.Variation;
</script>

<div class="h-12 lg:h-16 w-full bg-white border-b border-x border-black flex flex-row relative">
	<!-- Nom de la variable -->
	<section
		class="w-2/12 h-full border-r border-black flex items-center justify-center text-lg lg:text-xl"
	>
		<SaisieFonction
			on:handleFunctionNameChanged
			on:handleVariableNameChanged
			functionName={functionName + (choix === Choix.Variation ? "'" : '')}
			{variableName}
			isDisabled={choix === Choix.Variation}
		/>
	</section>

	<div class={'w-full flex flex-row text-md lg:text-3xl '}>
		<div class="w-full select-none flex justify-center items-center">{signs[0]}</div>

		{#each inRangeSolutions as _, i}
			<div class="w-full h-full relative">
				<div class="h-full border-l border-black select-none flex justify-center items-center">
					{signs[i + 1].replace('|', '')}
				</div>

				<!-- Met un trait avec un 0 pour la colonne à gauche du signe si l'expression s'annule en 0 à la solution -->
				<!-- C'est une valeur interdite si dans le signe il y a une barre -->
				{#if signs[i + 1].includes('|') === false}
					<!-- Annulation en 0 -->
					<p
						class="absolute select-none -translate-y-1/2 top-1/2 -translate-x-1/2 left-[0.05rem] md:left-[0.02rem] lg:left-[0.01rem] w-fit font-normal text-lg lg:text-3xl"
					>
						0
					</p>
				{:else}
					<!-- Valeur interdite : double barre -->
					<div class="w-full h-full top-0 absolute -left-1 border-l border-black" />
				{/if}
			</div>
		{/each}
	</div>
</div>
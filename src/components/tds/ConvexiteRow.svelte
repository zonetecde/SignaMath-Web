<script lang="ts">
	import Choix from '../../models/choix';
	import type Solution from '../../models/solution';
	import SaisieFonction from '../saisie/SaisieFonction.svelte';
	import SaisieMath from '../saisie/SaisieMath.svelte';

	export let functionName: string = 'f';
	export let inRangeSolutions: Solution[];
	export let signs: string[] = [];

	export let isBorneMinForbidden: boolean = false;
	export let isBorneMaxForbidden: boolean = false;

	$: {
		for (let i = 0; i < signs.length; i++) {
			if (signs[i] === '+') signs[i] = 'convexe';
			else signs[i] = 'concave';
		}
	}
</script>

<div class="h-12 lg:h-16 w-full bg-white border-b border-x border-black flex flex-row relative">
	<!-- Nom de la variable -->
	<section
		class="w-2/12 h-full border-r border-black flex items-center justify-center text-lg lg:text-xl"
	>
		<SaisieMath
			on:handleFunctionNameChanged
			eventName="handleFunctionNameChanged"
			classes="text-center text-right pl-2 rounded-l-lg"
			classesInput="w-10"
			value={functionName}
			maxLength={3}
			onlyAllowLetter
		/>
	</section>

	<div
		class={'w-full flex flex-row text-md text-center ' +
			(signs.some((x) => x.length > 3)
				? '' /* Message d'intervalle de définition */
				: 'lg:text-3xl')}
	>
		<div class="w-full select-none flex justify-center items-center">
			<!-- Si la borneMin est une valeur interdite, alors ajoute une double barre (juste après
			la première colonne)-->
			{#if isBorneMinForbidden}
				<div class="w-full h-full top-0 absolute left-1 border-l border-black" />
			{/if}

			{signs[0]}
		</div>

		{#each inRangeSolutions as _, i}
			<div class="w-full h-full relative">
				<div
					class="h-full border-l border-black select-none flex justify-center items-center text-center"
				>
					{signs[i + 1]}
				</div>

				{#if inRangeSolutions[i].isForbidden}
					<!-- Valeur interdite : double barre -->
					<div class="w-full h-full top-0 absolute -left-1 border-l border-black" />
				{/if}
			</div>
		{/each}

		<!-- Si la borneMax est une valeur interdite, alors ajoute une double barre (juste après
la dernière colonne colonne)-->
		{#if isBorneMaxForbidden}
			<div class="w-full h-full top-0 absolute right-1 border-r border-black" />
		{/if}
	</div>
</div>

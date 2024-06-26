<script lang="ts">
	import Choix from '../../models/choix';
	import type Solution from '../../models/solution';
	import SaisieFonction from '../saisie/SaisieFonction.svelte';
	import SaisieMath from '../saisie/SaisieMath.svelte';

	export let isBorneMinForbidden: boolean = false;
	export let isBorneMaxForbidden: boolean = false;

	export let functionName: string = 'f';
	export let variableName: string = 'x';
	export let inRangeSolutions: Solution[];
	export let signs: string[] = [];
	export let directFormula: string = ''; // Si renseigné, alors on affiche directement la formule à la place d'un nom de fonction

	export let choix: Choix = Choix.Variation;

	let functionNameTableau: string = functionName;
	$: {
		switch (choix) {
			case Choix.Variation:
				functionNameTableau = functionName + "'";
				break;
			case Choix.Convexite:
				functionNameTableau = functionName + "''";
				break;
			case Choix.Tableau:
				functionNameTableau = functionName;
				break;
		}
	}
</script>

<div class="h-12 lg:h-16 w-full bg-white border-b border-x border-black flex flex-row relative">
	<!-- Nom de la variable -->
	<section
		class="w-2/12 h-full border-r border-black flex items-center justify-center text-lg lg:text-xl"
	>
		{#if directFormula === ''}
			<SaisieFonction
				on:handleFunctionNameChanged
				on:handleVariableNameChanged
				functionName={functionNameTableau}
				{variableName}
				isDisabled={choix === Choix.Variation || choix === Choix.Convexite}
			/>
		{:else}
			<SaisieMath value={directFormula} isDisabled />
		{/if}
	</section>

	<div
		class={'w-full flex flex-row text-md text-center ' +
			(signs.some((x) => x.length > 3)
				? '' /* Message d'intervalle de définition */
				: 'lg:text-3xl')}
	>
		<div class="w-full select-none flex justify-center items-center relative">
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

				<!-- Met un trait avec un 0 pour la colonne à gauche du signe si l'expression s'annule en 0 à la solution -->
				<!-- C'est une valeur interdite si dans le signe il y a une barre -->
				{#if inRangeSolutions[i].isForbidden === false}
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

		<!-- Si la borneMax est une valeur interdite, alors ajoute une double barre (juste après
la dernière colonne colonne)-->
		{#if isBorneMaxForbidden}
			<div class="w-full h-full top-0 absolute right-1 border-r border-black" />
		{/if}
	</div>
</div>

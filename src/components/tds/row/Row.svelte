<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type ExpressionElement from '../../../models/expression';
	import type Solution from '../../../models/solution';
	import ExpressionCell from './ExpressionCell.svelte';
	import type Cellule from '../../../models/cellule';
	import Solver from '../../../api/solver';
	import RowSigns from './RowSigns.svelte';
	import AddRowHover from './AddRowHover.svelte';

	export let expression: ExpressionElement;
	export let variableName: string = 'x';
	export let inRangeSolutions: Solution[];
	export let index: number = 0;
	export let newLineHasBeenAdded: number = 0; // hook

	const dispatcher = createEventDispatcher();

	const expressionChanged = (e: CustomEvent<any>) => {
		expression.Expression = e.detail;

		// Trigger le recalcul des signes de la colonne (ceux de la row sont fait automatiquement)
		// juste après que les signes de cette row ont été recalculés
		dispatcher('expressionChanged');
	};

	let cellules: Cellule[] = [];

	// A chaque fois que les solutions changent on recalcule les signes .
	$: {
		inRangeSolutions;
		expression; // Pour que ça soit trigger lorsque l'expression change

		cellules = [];

		// Le premier signe se trouve entre borneMin et la première solution
		cellules.push({
			sign: getSign(0),
			doesCancelOnZero: false
		});

		// Pour tout les autres signes entre les différentes solutions
		inRangeSolutions.forEach((solution, i) => {
			cellules.push({
				sign: getSign(i + 1),
				doesCancelOnZero: solution.associatedEquations.includes(expression.Expression.trim())
			});
		});
	}

	/**
	 * Calcul le signe d'une cellule du tableau (d'index index)
	 * @param index L'index de la cellule
	 */
	function getSign(index: number): string {
		let resultat = 0;

		if (inRangeSolutions.length === 0) {
			// signe constant
			resultat = Solver.formulaToInt(expression, variableName, 1);
		} else if (index === 0) {
			// entre borneMin et la premiere solution
			// (donc en gros juste avant la premiere solution)
			resultat = Solver.formulaToInt(
				expression,
				variableName,
				inRangeSolutions[0].integer - 0.0000001
			);
		} else {
			// entre la solution précédente et la suivante
			// (donc en gros juste apres la solution précédente)
			resultat = Solver.formulaToInt(
				expression,
				variableName,
				inRangeSolutions[index - 1].integer + 0.0000001
			);
		}

		return isNaN(resultat)
			? "Ø racine d'un nombre négatif, changer l'intervalle de définition"
			: resultat < 0
			? '-'
			: '+';
	}

	/**
	 * Appuie sur le bouton pour supprimer la ligne
	 */
	function handleDeleteLine() {
		dispatcher('deleteLine', index);
	}

	let showAddsButton = true;
	$: {
		newLineHasBeenAdded;
		showAddsButton = false;
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!--

-->
<div
	class="w-full bg-white border-b border-x border-black flex relative flex-col"
	on:mouseenter={() => (showAddsButton = true)}
	on:mouseleave={() => (showAddsButton = false)}
>
	<!-- Indicateur si c'est une ligne de valeur interdite -->
	<div class="absolute top-0 bottom-0 -left-28">
		<div class="flex h-full items-center justify-center">
			<p class="text-sm text-opacity-50 text-black italic">
				{expression.Interdite ? 'valeur interdite' : ''}
			</p>
		</div>
	</div>

	{#if showAddsButton}
		<AddRowHover {index} on:createNewRow isTop={true} />
	{/if}

	<div class="h-fit py-2.5 w-full flex flex-row">
		<!-- Nom de la variable -->
		<ExpressionCell on:handleExpressionChanged={expressionChanged} {expression} />

		<RowSigns {cellules} extendSize={showAddsButton} />
	</div>

	{#if showAddsButton}
		<button
			class="absolute right-1 bottom-1 text-xs md:text-base bg-red-200 px-4 py-0.5 rounded-md hover:bg-red-300 duration-100"
			on:click={handleDeleteLine}>Supprimer</button
		>

		<AddRowHover index={index + 1} on:createNewRow isTop={false} />
	{/if}
</div>

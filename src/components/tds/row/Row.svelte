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

	const dispatcher = createEventDispatcher();

	const expressionChanged = (e: CustomEvent<any>) => {
		expression.Expression = e.detail;

		// Trigger le recalcul des signes de la colonne (ceux de la row sont fait automatiquement)
		// juste après que les signes de cette row ont été recalculés
		setTimeout(() => dispatcher('updateColumnsSigns'), 20);
	};

	let cellules: Cellule[] = [];

	// A chaque fois que les solutions changent on recalcule les signes
	$: {
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

	let showAddsButton = false;
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<!--
	on:mouseenter={() => (showAddsButton = true)}
	on:mouseleave={() => (showAddsButton = false)}
-->
<div class="w-full bg-white border-b border-x border-black flex relative flex-col">
	{#if showAddsButton}
		<AddRowHover index={index - 1} />
	{/if}

	<div class="h-12 lg:h-16 w-full flex flex-row">
		<!-- Nom de la variable -->
		<ExpressionCell on:handleExpressionChanged={expressionChanged} {expression} />

		<RowSigns {cellules} />
	</div>

	{#if showAddsButton}
		<AddRowHover index={index + 1} />
	{/if}
</div>

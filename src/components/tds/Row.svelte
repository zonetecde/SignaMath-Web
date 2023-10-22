<script lang="ts">
	import Katex from 'svelte-katex';
	import type ExpressionElement from '../../models/expression';
	import type Solution from '../../models/solution';
	import SaisieMath from '../SaisieMath.svelte';
	import Solver from '../../api/solver';

	export let expression: ExpressionElement;
	export let variableName: string = 'x';
	export let inRangeSolutions: Solution[];

	const expressionChanged = (e: CustomEvent<any>) => {
		console.log('t');
		expression.Expression = e.detail;
	};

	// Tableau contenant les signes des solutions, par ordre des colonnes du tableau
	let signs: string[] = [];
	// A chaque fois que les solutions changent on recalcule les signes
	$: {
		expression; // Pour que ça soit trigger lorsque l'expression change aussi

		signs = [];
		// Le premier signe se trouve entre borneMin et la première solution
		signs.push(getSign(0));
		signs.push(
			...inRangeSolutions.map((solution, i) => {
				return getSign(i + 1);
			})
		);
	}

	/**
	 * Calcul le signe d'une cellule du tableau (d'index index)
	 * @param index L'index de la cellule
	 */
	function getSign(index: number) {
		let resultat = 0;

		if (inRangeSolutions.length === 0) {
			// signe constant
			resultat = Solver.formulaToInt(expression, variableName, 0);
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

		return resultat < 0 ? '-' : '+';
	}

	/**
	 * Est-ce que l'expression se cancel en 0 à la solution précédente ?
	 * @param index L'index de la solution
	 */
	function doesCancelOnZero(index: number): boolean {
		const solution = inRangeSolutions[index];
		return solution.associatedEquations.includes(expression.Expression);
	}
</script>

<div class="h-12 lg:h-16 w-full bg-white border-b border-x border-black flex flex-row relative">
	<!-- Nom de la variable -->
	<section
		class="w-2/12 h-full border-r border-black flex items-center justify-center text-lg lg:text-xl"
	>
		<SaisieMath
			value={expression.Expression}
			maxLength={999}
			placeholder={(' ' + expression.Expression).slice(1)}
			eventName="handleExpressionChanged"
			on:handleExpressionChanged={expressionChanged}
			classes="text-center w-full"
		/>
	</section>

	<div class={'w-full flex flex-row text-md lg:text-3xl '}>
		<div class="w-full select-none flex justify-center items-center">{signs[0]}</div>

		{#each inRangeSolutions as _, i}
			<div class="w-full h-full relative">
				<div class="h-full border-l border-black select-none flex justify-center items-center">
					{signs[i + 1]}
				</div>

				<!-- Met un trait avec un 0 pour la colonne à gauche du signe si l'expression s'annule en 0 à la solution -->
				{#if doesCancelOnZero(i)}
					<!-- Annulation en 0 -->
					<p
						class="absolute select-none -translate-y-1/2 top-1/2 -translate-x-1/2 left-[0.05rem] md:left-[0.02rem] lg:left-[0.01rem] w-fit font-normal text-lg lg:text-3xl"
					>
						0
					</p>
				{/if}
			</div>
		{/each}
	</div>
</div>

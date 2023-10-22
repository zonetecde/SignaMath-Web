<script lang="ts">
	import Sheller from '../api/sheller';
	import Solver from '../api/solver';
	import Choix from '../models/choix';
	import ExpressionElement from '../models/expression';
	import type Solution from '../models/solution';
	import FunctionRow from './tds/FunctionRow.svelte';
	import Header from './tds/Header.svelte';
	import Row from './tds/Row.svelte';
	import Variation from './tds/Variation.svelte';

	export let functionName: string = 'f';
	export let variableName: string = 'x';
	export let formula: string = 'x^2 - 4x';

	export let borneMin: string = '-inf';
	export let borneMax: string = '+inf';

	// La formule de base écrite par l'utilisateur,
	// qui est différente de celle dérivée
	export let formulaBase: string = 'x^2 - 4x';

	// Permet d'afficher ce que l'utilisateur veut
	export let choix: Choix = Choix.Variation;

	// Shell la fonction et la décompose en plusieurs parties à chaque fois que la formule est modifié
	$: lignes = Sheller.ShellFunction(formula);

	let solutions: Solution[] = [];

	// Calcul des solutions
	$: {
		solutions = [];
		lignes.forEach((line) => {
			let lineSolutions = Solver.solveEquation(line.toString(), variableName);

			// Ajoute les solutions qui n'ont pas déjà été ajoutées
			lineSolutions.forEach((solution) => {
				if (solutions.some((s) => s.value === solution.value) === false) {
					solution.associatedEquations.push(line.toString());
					solutions.push(solution);
				} else {
					// Il existe déjà: on ajoute la formule qui a aussi sa solution associé
					const existingSolution = solutions.find((s) => s.value === solution.value)!;

					// Vérifie quand même que la solution associé n'existe pas déjà non plus
					if (existingSolution.associatedEquations.some((s) => s === line.toString()) === false) {
						existingSolution.associatedEquations.push(line.toString());
					}
				}
			});
		});

		// Order les solutions par valeur (ordre croissat)
		solutions.sort((a, b) => {
			return a.integer - b.integer;
		});
	}

	// Prend uniquement les solutions dans l'interval demandé
	let inRangeSolutions: Solution[] = [];
	$: {
		solutions;
		inRangeSolutions = solutions.filter((solution) => {
			return (
				solution.integer >= Solver.toInteger(borneMin) &&
				solution.integer <= Solver.toInteger(borneMax)
			);
		});
	}

	// Tableau contenant le signe final de la fonction
	let signs: string[] = [];
	$: {
		if (inRangeSolutions.length > 0) {
			signs = [];

			// Signe entre bornMin et la première solution
			const resultat = Solver.formulaToInt(
				new ExpressionElement(true, false, formula, ''),
				variableName,
				inRangeSolutions[0].integer - 0.0000001
			);

			signs.push(resultat < 0 ? '-' : '+');

			// Signe entre chaque autres solution
			inRangeSolutions.forEach((solution) => {
				let signe = '';

				// Si c'est une valeur interdite on l'écrit dans le signe
				// le component FunctionRow va ensuite l'interpreter pour y mettre une double barre
				if (
					lignes.some((x) => x.Interdite && solution.associatedEquations.includes(x.Expression))
				) {
					signe += '|';
				}

				const resultat = Solver.formulaToInt(
					new ExpressionElement(true, false, formula, ''),
					variableName,
					solution.integer + 0.0000001
				);

				signs.push(resultat < 0 ? signe + '-' : signe + '+');
			});
		}
	}
</script>

<div class="w-full h-full flex items-center justify-center">
	<div class="w-10/12" id="tableau-de-signe">
		<Header
			{variableName}
			{borneMax}
			{borneMin}
			{inRangeSolutions}
			on:handleVariableNameChanged
			on:handleBorneMaxChanged
			on:handleBorneMinChanged
		/>

		{#each lignes as line}
			<Row expression={line} {inRangeSolutions} {variableName} />
		{/each}

		<FunctionRow
			{inRangeSolutions}
			{functionName}
			{signs}
			{variableName}
			on:handleFunctionNameChanged
			on:handleVariableNameChanged
		/>

		{#if choix === Choix.Variation}
			<Variation
				{inRangeSolutions}
				{functionName}
				{signs}
				{variableName}
				{borneMax}
				{borneMin}
				formula={formulaBase}
				on:handleFunctionNameChanged
				on:handleVariableNameChanged
			/>
		{/if}
	</div>
</div>

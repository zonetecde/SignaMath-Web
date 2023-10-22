<script lang="ts">
	import Sheller from '../api/sheller';
	import Solver from '../api/solver';
	import type Solution from '../models/solution';
	import Header from './tds/Header.svelte';
	import Row from './tds/Row.svelte';

	export let functionName: string = 'f';
	export let variableName: string = 'x';
	export let formula: string = 'x^2 - 4x';

	export let borneMin: string = '-inf';
	export let borneMax: string = '+inf';

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
	$: inRangeSolutions = solutions.filter((solution) => {
		return (
			solution.integer >= Solver.toInteger(borneMin) &&
			solution.integer <= Solver.toInteger(borneMax)
		);
	});
</script>

<div class="w-full h-full flex items-center justify-center">
	<div class="w-10/12">
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
			<Row expression={line} {inRangeSolutions} />
		{/each}
	</div>
</div>

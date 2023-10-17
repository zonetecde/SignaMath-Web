<script lang="ts">
	import Katex from 'svelte-katex';

	let equ = `x = \\frac{5}{x} `;
</script>

<div class="md:w-2/12 md:min-w-[200px] bg-[#c3aac5cb] md:h-full p-3 flex flex-col">
	<p class="text-md md:text-xl">Étude des variations d'une fonction :</p>
	<button
		on:mousedown={() => {
			equ = `z = \\frac{5}{x}`;
		}}>click me</button
	>

	<Katex>{equ}</Katex>
</div>

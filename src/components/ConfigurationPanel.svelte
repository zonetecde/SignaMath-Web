<script lang="ts">
	import MathJax from '../extensions/MathJax.svelte';

	$: equ = `$$x = \\frac{t}{3}$$`;
</script>

<div class="md:w-2/12 md:min-w-[200px] bg-[#c3aac5cb] md:h-full p-3 flex flex-col">
	<p class="text-md md:text-xl">Étude des variations d'une fonction :</p>
	<button
		on:mousedown={() => {
			equ = `$$x = \\frac{t}{503}$$`;
		}}>{equ}</button
	>
</div>

<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let index: number;
	export let isTop: boolean;

	const dispatcher = createEventDispatcher();

	function handleCreateNewRow(isForbidden: boolean) {
		dispatcher('createNewRow', { index: index, isForbidden: isForbidden });
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="w-full h-8 bg-white flex items-center">
	<!-- <svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		stroke-width="1.5"
		stroke="currentColor"
		class="w-6 h-6 ml-2"
	>
		<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
	</svg> -->
	<div
		class={'flex flex-row border-black md:text-base z-50 text-xs md:my-0 ' +
			(isTop ? 'border-b rounded-br-md -mt-2' : 'border-t rounded-tr-md -mb-2')}
	>
		<button class="px-3 py-1 bg-green-200 cursor-pointer" on:click={() => handleCreateNewRow(false)}
			>Ajouter une ligne</button
		>
		<button
			class={'px-3 py-1 bg-red-200 border-r cursor-pointer z-50 border-black ' +
				(isTop ? 'rounded-br-md' : 'rounded-tr-md')}
			on:click={() => handleCreateNewRow(true)}>Ajouter une ligne de valeur interdite</button
		>
	</div>
</div>

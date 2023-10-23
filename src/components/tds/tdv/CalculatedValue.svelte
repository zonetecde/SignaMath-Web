<!--
    Component contenant une valeur du tableau de variations
    Cette valeur doit être placé dans le tableau de variations en fonction
    de la direction de la flèche, de s'il y a une valeur à cette position etc
-->

<script lang="ts">
	export let value: number = 0;
	export let sign: string = '+';
	export let position: 'borneMax' | 'borneMin' | 'centre' = 'centre';
</script>

<div
	class={'absolute ' +
		(sign.includes('+') ? ' top-2 lg:top-4 ' : ' bottom-2 lg:bottom-4 ') +
		' ' +
		(position === 'borneMax'
			? 'right-0'
			: position === 'centre'
			? '-left-0.5 transform -translate-x-1/2 '
			: 'left-0')}
>
	<p class="w-fit bg-white px-3 bg-opacity-50 rounded-full text-xs md:text-xs lg:text-xl">
		{value}
	</p>
</div>

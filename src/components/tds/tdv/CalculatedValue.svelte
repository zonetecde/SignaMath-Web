<!--
    Component contenant une valeur du tableau de variations
    Cette valeur doit être placé dans le tableau de variations en fonction
    de la direction de la flèche, de s'il y a une valeur à cette position etc
-->

<script lang="ts">
    export let value: number | undefined = undefined;
    export let sign: string = '+';
    export let position: 'borneMax' | 'borneMin' | 'centre' = 'centre';

    const getPositionClass = (pos: typeof position) => {
        const positions = {
            borneMax: 'right-0',
            centre: '-left-0.5 transform -translate-x-1/2',
            borneMin: 'left-0'
        };
        return positions[pos];
    };
</script>

<div
    class="absolute {sign.includes('+') ? 'top-2 lg:top-4' : 'bottom-2 lg:bottom-4'} {getPositionClass(position)}"
    aria-label="Calculated value {value}"
>
    {#if value !== undefined}
        <p class="w-fit bg-white/50 px-3 rounded-full text-xs md:text-xs lg:text-xl">
            {value}
        </p>
    {/if}
</div>

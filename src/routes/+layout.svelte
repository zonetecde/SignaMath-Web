<script>
	import '../app.css';
	import Icon from '$lib/assets/icon.png';
	import GitHub from '$lib/assets/github.svg';
</script>

<div class="h-screen w-screen">
	<nav
		class="bg-[#7a647c] h-12 md:h-20 flex flex-row relative items-center px-5 border-b border-gray-900 outline-b"
	>
		<div
			class="absolute left-0 right-0 px-10 py-1 h-full flex flex-row items-center justify-center gap-4 bg-gradient-to-r from-[#c3adc500] via-[#c3adc5] to-[#c3adc500]"
		>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
			<img
				src={Icon}
				alt="Logo du site"
				class="h-full object-contain cursor-pointer"
				on:click={() => window.location.reload()}
			/>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
			<p
				class="text-black md:font-bold text-2xl md:text-3xl select-none cursor-pointer"
				on:click={() => window.location.reload()}
			>
				SignaMath
			</p>

			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
			<img
				src={GitHub}
				alt="GitHub logo"
				class="absolute opacity-60 right-2 md:right-5 w-8 md:w-12 cursor-pointer"
				on:click={() => window.open('https://github.com/zonetecde/signamath-web')}
			/>
		</div>
	</nav>

	<div class="h-full -mt-12 pt-12 md:-mt-20 md:pt-20">
		<slot />
	</div>
</div>

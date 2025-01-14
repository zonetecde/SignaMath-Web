<script lang="ts">
    let isHovered = false;
</script>

<a
    href="https://ko-fi.com/vzero"
    target="_blank"
    rel="noopener noreferrer"
    class="fixed bottom-4 right-4 z-50 transition-all duration-300 transform hover:scale-110"
    on:mouseenter={() => isHovered = true}
    on:mouseleave={() => isHovered = false}
    aria-label="Support me on Ko-fi"
>

</a>

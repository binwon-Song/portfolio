<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";
    import { fly, fade, slide } from "svelte/transition";
    import type { NavFile } from "$lib/types";

    const dispatch = createEventDispatcher();

    export let navFiles: NavFile[] = [];

    let isMenuOpen = false;
    let isFilesOpen = false;
    let isMobileFilesOpen = false; // Toggle for files section in mobile menu
    let headerEl: HTMLElement | null = null;
    let headerHeight = 0;

    // portal action: move node to document.body so overlay isn't clipped by parent containers
    function portal(node: HTMLElement) {
        if (typeof window !== "undefined" && document && document.body) {
            document.body.appendChild(node);
        }
        return {
            destroy() {
                try {
                    if (node.parentNode) node.parentNode.removeChild(node);
                } catch (e) {}
            },
        };
    }

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        if (!isMenuOpen) isMobileFilesOpen = false; // Reset mobile files state on close
    }

    function toggleFiles(e?: Event) {
        isFilesOpen = !isFilesOpen;
        if (e) e.stopPropagation();
    }

    function toggleMobileFiles() {
        isMobileFilesOpen = !isMobileFilesOpen;
    }

    // file input handlers (optional upload trigger from nav)
    let fileInput: HTMLInputElement | null = null;
    function onNavFileChange(e: Event) {
        const input = e.target as HTMLInputElement;
        const file = input.files?.[0];
        if (file) {
            // dispatch event so parent/admin can handle upload if desired
            dispatch("navfile", { file });
        }
        if (fileInput) fileInput.value = "";
    }

    // close dropdowns on outer click
    function onDocumentClick() {
        isFilesOpen = false;
    }

    // attach/detach document click
    if (typeof window !== "undefined") {
        window.addEventListener("click", onDocumentClick);
    }

    onMount(() => {
        // set initial header height and update on resize
        const setHeaderHeight = () => {
            headerHeight = headerEl ? headerEl.offsetHeight : 0;
        };
        setHeaderHeight();
        window.addEventListener("resize", setHeaderHeight);
        return () => {
            window.removeEventListener("resize", setHeaderHeight);
        };
    });
</script>

<header
    bind:this={headerEl}
    class="bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm"
>
    <nav class="container mx-auto px-6 py-4">
        <div class="flex items-center justify-between relative">
            <div class="flex items-center space-x-4">
                <!-- mobile menu toggler (left) -->
                <button
                    class="md:hidden text-gray-600 focus:outline-none"
                    aria-label="Open Menu"
                    on:click={toggleMenu}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        ><path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h16"
                        /></svg
                    >
                </button>
            </div>

            <!-- Centered Desktop Navigation -->
            <div class="hidden md:flex items-center space-x-6 absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <a
                    href="#home"
                    class="text-gray-600 hover:text-primary transition-colors"
                    >Home</a
                >
                <a
                    href="#about"
                    class="text-gray-600 hover:text-primary transition-colors"
                    >About</a
                >
                <a
                    href="#projects"
                    class="text-gray-600 hover:text-primary transition-colors"
                    >Projects</a
                >
                <a
                    href="#publications"
                    class="text-gray-600 hover:text-primary transition-colors"
                    >Publications</a
                >
                <!-- Files dropdown (Desktop only) -->
                <div class="relative">
                    <button
                        class="flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition"
                        aria-haspopup="true"
                        on:click|stopPropagation={toggleFiles}
                    >
                        <span class="font-medium">Files</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4 text-gray-500"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            ><path
                                fill-rule="evenodd"
                                d="M5.23 7.21a.75.75 0 011.06-.02L10 10.67l3.71-3.48a.75.75 0 011.04 1.08l-4.25 4a.75.75 0 01-1.04 0l-4.25-4a.75.75 0 01-.02-1.06z"
                                clip-rule="evenodd"
                            /></svg
                        >
                    </button>

                    {#if isFilesOpen}
                        <div
                            class="absolute left-0 mt-3 w-64 bg-white rounded-xl shadow-xl p-4 z-50 scale-in"
                            role="dialog"
                            tabindex="0"
                            on:click|stopPropagation
                            on:keydown|stopPropagation
                        >
                            <div class="grid grid-cols-1 gap-2 max-h-96 overflow-y-auto">
                                {#if navFiles.length > 0}
                                    {#each navFiles as f}
                                        <a
                                            href={f.url}
                                            class="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50 transition"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                class="h-6 w-6 text-indigo-600 flex-shrink-0"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                ><path
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                    stroke-width="2"
                                                    d="M12 3v12m0 0l3-3m-3 3l-3-3M21 21H3"
                                                /></svg
                                            >
                                            <div class="min-w-0">
                                                <div
                                                    class="text-sm font-medium truncate"
                                                >
                                                    {f.name}
                                                </div>
                                                {#if f.size}
                                                    <div
                                                        class="text-xs text-gray-400"
                                                    >
                                                        {#if f.size >= 1024 * 1024 * 1024}
                                                            {Math.round(
                                                                f.size /
                                                                    (1024 *
                                                                        1024 *
                                                                        1024) *
                                                                    100,
                                                            ) / 100} GB
                                                        {:else if f.size >= 1024 * 1024}
                                                            {Math.round(
                                                                f.size /
                                                                    (1024 *
                                                                        1024) *
                                                                    100,
                                                            ) / 100} MB
                                                        {:else}
                                                            {Math.round(
                                                                f.size / 1024,
                                                            )} KB
                                                        {/if}
                                                    </div>
                                                {/if}
                                            </div>
                                        </a>
                                    {/each}
                                {:else}
                                    <div class="text-sm text-gray-500 px-2">No files available</div>
                                {/if}
                            </div>
                        </div>
                    {/if}
                </div>
            </div>

            <div class="flex items-center gap-4">
                <a
                    href="/admin"
                    class="hidden md:inline text-gray-600 hover:text-primary transition-colors"
                    aria-label="Admin"
                    title="Admin"><i class="bi bi-gear-fill"></i></a
                >
            </div>
        </div>

        {#if isMenuOpen}
            <!-- Mobile Side Drawer -->
            <div
                use:portal
                class="fixed inset-0 z-50 md:hidden"
                aria-hidden={!isMenuOpen}
                role="dialog"
                aria-modal="true"
            >
                <!-- Backdrop -->
                <div
                    class="absolute inset-0 bg-gray-900/50 transition-opacity duration-300"
                    on:click={toggleMenu}
                    transition:fade={{ duration: 200 }}
                ></div>

                <!-- Drawer Panel -->
                <div class="absolute inset-y-0 left-0 max-w-xs w-full flex">
                    <aside
                        class="w-full bg-white shadow-xl flex flex-col h-full"
                        transition:fly={{ x: -300, duration: 300 }}
                    >
                        <!-- Header -->
                        <div class="px-6 py-4 border-b flex items-center justify-between">
                            <h2 class="text-lg font-semibold text-gray-900">Menu</h2>
                            <button
                                type="button"
                                class="rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                                on:click={toggleMenu}
                            >
                                <span class="sr-only">Close menu</span>
                                <svg
                                    class="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>

                        <!-- Content -->
                        <div class="flex-1 overflow-y-auto px-6 py-4">
                            <nav class="flex flex-col space-y-4">
                                <a
                                    href="#home"
                                    class="text-gray-700 hover:text-primary text-lg font-medium"
                                    on:click={toggleMenu}>Home</a
                                >
                                <a
                                    href="#about"
                                    class="text-gray-700 hover:text-primary text-lg font-medium"
                                    on:click={toggleMenu}>About</a
                                >
                                <a
                                    href="#projects"
                                    class="text-gray-700 hover:text-primary text-lg font-medium"
                                    on:click={toggleMenu}>Projects</a
                                >
                                <a
                                    href="#publications"
                                    class="text-gray-700 hover:text-primary text-lg font-medium"
                                    on:click={toggleMenu}>Publications</a
                                >
                                
                                <hr class="border-gray-200 my-2" />

                                <!-- Mobile Files Section -->
                                <div>
                                    <button 
                                        class="flex items-center justify-between w-full text-gray-700 hover:text-primary text-lg font-medium group"
                                        on:click={toggleMobileFiles}
                                    >
                                        <span>Files</span>
                                        <svg 
                                            class="w-5 h-5 transform transition-transform duration-200 {isMobileFilesOpen ? 'rotate-180' : ''}" 
                                            fill="none" 
                                            viewBox="0 0 24 24" 
                                            stroke="currentColor"
                                        >
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    
                                    {#if isMobileFilesOpen}
                                        <div class="mt-2 ml-2 space-y-2 border-l-2 border-gray-100 pl-4" transition:slide|local>
                                            {#if navFiles.length > 0}
                                                {#each navFiles as f}
                                                    <a
                                                        href={f.url}
                                                        class="block text-gray-600 hover:text-primary py-1"
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                    >
                                                        <div class="text-sm font-medium">{f.name}</div>
                                                        {#if f.size}
                                                            <div class="text-xs text-gray-400">
                                                                {#if f.size >= 1024 * 1024 * 1024}
                                                                    {Math.round(f.size / (1024 * 1024 * 1024) * 100) / 100} GB
                                                                {:else if f.size >= 1024 * 1024}
                                                                    {Math.round(f.size / (1024 * 1024) * 100) / 100} MB
                                                                {:else}
                                                                    {Math.round(f.size / 1024)} KB
                                                                {/if}
                                                            </div>
                                                        {/if}
                                                    </a>
                                                {/each}
                                            {:else}
                                                <div class="text-sm text-gray-400 py-1">No files available</div>
                                            {/if}
                                        </div>
                                    {/if}
                                </div>

                                <hr class="border-gray-200 my-2" />

                                <a
                                    href="/admin"
                                    class="text-gray-700 hover:text-primary text-lg font-medium flex items-center gap-2"
                                    on:click={toggleMenu}
                                >
                                    <i class="bi bi-gear-fill"></i> Admin
                                </a>
                            </nav>
                        </div>
                    </aside>
                </div>
            </div>
        {/if}
    </nav>
</header>

<style>
    /* Small enhancement for smooth dropdown scale */
    .scale-in {
        transform-origin: top left;
        animation: scaleIn 160ms ease-out forwards;
    }
    @keyframes scaleIn {
        from {
            opacity: 0;
            transform: translateY(-6px) scale(0.98);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
</style>

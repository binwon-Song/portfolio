<script lang="ts">
    import { createEventDispatcher, onMount } from "svelte";
    import { fly, fade } from "svelte/transition";

    const dispatch = createEventDispatcher();

    export let navFiles: any[] = [];

    let isMenuOpen = false;
    let isFilesOpen = false;
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
    }

    function toggleFiles(e?: Event) {
        isFilesOpen = !isFilesOpen;
        if (e) e.stopPropagation();
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
        <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
                <!-- mobile menu toggler (left) -->
                <button
                    class="md:hidden text-gray-600"
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

                <a
                    href="#home"
                    class="hidden md:inline text-gray-600 hover:text-primary transition-colors"
                    >Home</a
                >
                <a
                    href="#about"
                    class="hidden md:inline text-gray-600 hover:text-primary transition-colors"
                    >About</a
                >
                <a
                    href="#projects"
                    class="hidden md:inline text-gray-600 hover:text-primary transition-colors"
                    >Projects</a
                >
                <a
                    href="#publication"
                    class="hidden md:inline text-gray-600 hover:text-primary transition-colors"
                    >Publications</a
                >
                <a
                    href="./chinese.html"
                    class="hidden md:inline text-gray-600 hover:text-primary transition-colors"
                    >CHN Dictionary</a
                >
                <!-- Files dropdown (trendy card style) -->
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
                            class="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl p-4 z-50 scale-in"
                            role="dialog"
                            tabindex="0"
                            on:click|stopPropagation
                            on:keydown|stopPropagation
                        >
                            <div class="grid grid-cols-1 gap-2">
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
                                                class="h-6 w-6 text-indigo-600"
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
                                            <div>
                                                <div
                                                    class="text-sm font-medium"
                                                >
                                                    {f.name}
                                                </div>
                                                {#if f.size}
                                                    <div
                                                        class="text-xs text-gray-400"
                                                    >
                                                        {Math.round(
                                                            f.size / 1024,
                                                        )} KB
                                                    </div>
                                                {/if}
                                            </div>
                                        </a>
                                    {/each}
                                {/if}

                                <!-- fallback/static links -->
                                <a
                                    href="/resume.pdf"
                                    class="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-50 transition"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="h-6 w-6 text-green-600"
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
                                    <div>
                                        <div class="text-sm font-medium">
                                            Resume
                                        </div>
                                        <div class="text-xs text-gray-400">
                                            PDF · 120KB
                                        </div>
                                    </div>
                                </a>
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
            <!-- Slide-over drawer (top) inspired by provided example -->
            <div
                use:portal
                class="fixed inset-0 z-50 md:hidden"
                aria-hidden={!isMenuOpen}
                role="dialog"
                aria-modal="true"
            >
                <!-- Backdrop -->
                <div
                    class="absolute inset-0 bg-gray-900/50 transition-opacity duration-500 ease-in-out"
                    on:click={toggleMenu}
                    transition:fade={{ duration: 200 }}
                ></div>

                <!-- Container that positions the panel at the top -->
                <div class="absolute inset-0 overflow-hidden">
                    <div class="absolute inset-0 overflow-hidden">
                        <section
                            class="absolute inset-x-0 top-0 flex justify-center"
                        >
                            <div class="w-1/2 max-w-full">
                                <aside
                                    class="bg-white shadow-xl p-6 relative"
                                    transition:fly={{ y: -320, duration: 500 }}
                                >
                                    <!-- Close button -->
                                    <div
                                        class="absolute top-0 right-0 -mr-8 pt-4 pl-2"
                                    >
                                        <button
                                            type="button"
                                            class="relative rounded-md text-gray-400 hover:text-gray-200 focus:outline-none"
                                            aria-label="Close panel"
                                            on:click={toggleMenu}
                                        >
                                            <span class="sr-only"
                                                >Close panel</span
                                            >
                                            <svg
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                stroke-width="1.5"
                                                class="w-6 h-6"
                                            >
                                                <path
                                                    d="M6 18L18 6M6 6l12 12"
                                                    stroke-linecap="round"
                                                    stroke-linejoin="round"
                                                ></path>
                                            </svg>
                                        </button>
                                    </div>

                                    <div class="h-full flex flex-col">
                                        <div class="px-4 sm:px-6">
                                            <h2
                                                class="text-base font-semibold text-gray-900"
                                            >
                                                Menu
                                            </h2>
                                        </div>
                                        <div
                                            class="relative mt-6 flex-1 px-4 sm:px-6"
                                        >
                                            <nav
                                                class="flex flex-col space-y-3"
                                            >
                                                <a
                                                    href="#home"
                                                    class="text-gray-700"
                                                    on:click={toggleMenu}
                                                    >Home</a
                                                >
                                                <a
                                                    href="#about"
                                                    class="text-gray-700"
                                                    on:click={toggleMenu}
                                                    >About</a
                                                >
                                                <a
                                                    href="#publication"
                                                    class="text-gray-700"
                                                    on:click={toggleMenu}
                                                    >Publications</a
                                                >
                                                <a
                                                    href="#projects"
                                                    class="text-gray-700"
                                                    on:click={toggleMenu}
                                                    >Projects</a
                                                >
                                                <a
                                                    href="./chinese.html"
                                                    class="text-gray-700"
                                                    on:click={toggleMenu}
                                                    >CHN Dictionary</a
                                                >
                                            </nav>
                                        </div>
                                    </div>
                                </aside>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        {/if}
    </nav>
</header>

<style>
    /* Small enhancement for smooth dropdown scale */
    .scale-in {
        transform-origin: top right;
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

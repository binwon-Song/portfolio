<script lang="ts">
    import { getAuthClient } from "$lib/firebase";
    import { onAuthStateChanged, signOut } from "firebase/auth";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { page } from "$app/stores";

    let { children } = $props();
    let user = $state(null);
    let loading = $state(true);

    onMount(() => {
        const auth = getAuthClient();
        const unsubscribe = onAuthStateChanged(auth, (u) => {
            user = u;
            loading = false;
            if (!u) {
                goto("/login");
            }
        });
        return unsubscribe;
    });

    async function logout() {
        const auth = getAuthClient();
        await signOut(auth);
        goto("/login");
    }

    function isActive(path: string) {
        return $page.url.pathname.startsWith(path)
            ? "text-indigo-600 font-bold"
            : "text-gray-600 hover:text-indigo-600 transition-colors";
    }
</script>

{#if loading}
    <div class="flex items-center justify-center h-screen bg-gray-50">
        <div
            class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"
        ></div>
    </div>
{:else if user}
    <div class="min-h-screen bg-gray-50 font-sans flex flex-col">
        <!-- Top Navigation Bar -->
        <header
            class="bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm border-b border-gray-200"
        >
            <nav class="container mx-auto px-6 py-4">
                <div
                    class="flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                    <!-- Brand & Logo -->
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div
                                class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center"
                            >
                                <i class="bi bi-grid-fill text-white text-sm"
                                ></i>
                            </div>
                            <span
                                class="text-xl font-bold text-gray-800 tracking-tight"
                                >Admin Dashboard</span
                            >
                        </div>

                        <!-- Logout Button (Mobile only) -->
                        <button
                            on:click={logout}
                            class="md:hidden p-2 text-gray-500 hover:text-red-600 transition-colors"
                            aria-label="Logout"
                        >
                            <i class="bi bi-box-arrow-right text-xl"></i>
                        </button>
                    </div>

                    <!-- Navigation Links (Horizontal) -->
                    <div
                        class="flex items-center justify-center gap-8 overflow-x-auto pb-2 md:pb-0"
                    >
                        <a
                            href="/admin/files"
                            class="text-lg font-medium whitespace-nowrap {isActive(
                                '/admin/files',
                            )}"
                        >
                            Files
                        </a>
                        <a
                            href="/admin/publications"
                            class="text-lg font-medium whitespace-nowrap {isActive(
                                '/admin/publications',
                            )}"
                        >
                            Publications
                        </a>
                        <a
                            href="/admin/projects"
                            class="text-lg font-medium whitespace-nowrap {isActive(
                                '/admin/projects',
                            )}"
                        >
                            Projects
                        </a>
                    </div>

                    <!-- Logout Button (Desktop) -->
                    <div class="hidden md:block">
                        <button
                            on:click={logout}
                            class="flex items-center gap-2 px-4 py-2 rounded-lg text-lg font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                            <i class="bi bi-box-arrow-right text-lg"></i>
                            Logout
                        </button>
                    </div>
                </div>
            </nav>
        </header>

        <!-- Main Content -->
        <main class="flex-1 container mx-auto px-6 py-8 max-w-7xl">
            {@render children()}
        </main>
    </div>
{/if}

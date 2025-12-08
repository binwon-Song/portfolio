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
        return $page.url.pathname.startsWith(path) ? "bg-indigo-700" : "";
    }
</script>

{#if loading}
    <div class="flex items-center justify-center h-screen">Loading...</div>
{:else if user}
    <div class="flex h-screen bg-gray-100">
        <!-- Sidebar -->
        <div class="w-64 bg-indigo-800 text-white flex flex-col">
            <div class="p-6 text-2xl font-bold">Admin</div>
            <nav class="flex-1 px-4 space-y-2">
                <a
                    href="/admin/files"
                    class="block px-4 py-2 rounded hover:bg-indigo-700 {isActive(
                        '/admin/files',
                    )}">Files</a
                >
                <a
                    href="/admin/publications"
                    class="block px-4 py-2 rounded hover:bg-indigo-700 {isActive(
                        '/admin/publications',
                    )}">Publications</a
                >
                <a
                    href="/admin/projects"
                    class="block px-4 py-2 rounded hover:bg-indigo-700 {isActive(
                        '/admin/projects',
                    )}">Projects</a
                >
            </nav>
            <div class="p-4 border-t border-indigo-700">
                <button
                    on:click={logout}
                    class="w-full text-left px-4 py-2 rounded hover:bg-indigo-700"
                    >Logout</button
                >
            </div>
        </div>

        <!-- Main Content -->
        <div class="flex-1 overflow-auto p-8">
            {@render children()}
        </div>
    </div>
{/if}

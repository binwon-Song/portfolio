<script lang="ts">
    import { getAuthClient } from "$lib/firebase";
    import { onAuthStateChanged, signOut, type User } from "firebase/auth";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import AdminNav from "$lib/components/admin/AdminNav.svelte";

    let { children } = $props();
    let user = $state<User | null>(null);
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
</script>

{#if loading}
    <div class="flex items-center justify-center h-screen bg-gray-50">
        <div
            class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"
        ></div>
    </div>
{:else if user}
    <div class="min-h-screen bg-gray-50 font-sans flex flex-col">
        <AdminNav logoutHandler={logout} />

        <!-- Main Content -->
        <main class="flex-1 container mx-auto px-6 py-8 max-w-7xl">
            {@render children()}
        </main>
    </div>
{/if}

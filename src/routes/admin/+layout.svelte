<script lang="ts">
    import { getAuthClient } from '$lib/firebase';
    import { onAuthStateChanged, signOut } from 'firebase/auth';
    import { goto } from '$app/navigation';
    import { onMount } from 'svelte';

    let loading = true;

    onMount(() => {
        const unsubscribe = onAuthStateChanged(getAuthClient(), (user) => {
            if (!user) {
                goto('/login');
            } else {
                loading = false;
            }
        });

        return unsubscribe;
    });

    async function handleLogout() {
        await signOut(getAuthClient());
        goto('/login');
    }
</script>

{#if loading}
    <div class="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
    </div>
{:else}
    <div class="min-h-screen bg-gray-50">
        <nav class="bg-white shadow px-6 py-4 flex justify-between items-center">
            <h1 class="text-xl font-bold">Admin Panel</h1>
            <div class="flex items-center gap-4">
                <a href="/" class="text-gray-600 hover:text-gray-900">View Site</a>
                <button on:click={handleLogout} class="text-red-500 hover:text-red-700">Logout</button>
            </div>
        </nav>
        <main>
            <slot />
        </main>
    </div>
{/if}

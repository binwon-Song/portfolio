<script lang="ts">
    import { getAuthClient } from '$lib/firebase';
    import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
    import { goto } from '$app/navigation';
    import "../layout.css";

    let email = '';
    let password = '';
    let error = '';

    async function handleLogin() {
        try {
            const a = getAuthClient();
            await signInWithEmailAndPassword(a, email, password);
            goto('/admin');
        } catch (e: any) {
            console.error(e);
            error = 'Invalid email or password';
        }
    }

    async function handleGoogleLogin() {
        try {
            const a = getAuthClient();
            const provider = new GoogleAuthProvider();
            await signInWithPopup(a, provider);
            goto('/admin');
        } catch (e: any) {
            console.error('Google sign-in error', e);
            error = e?.message || 'Google sign-in failed';
        }
    }
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 class="text-2xl font-bold mb-6 text-center">Admin Login</h1>
        
        {#if error}
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
            </div>
        {/if}

        <form on:submit|preventDefault={handleLogin} class="space-y-4">
            <div>
                <label for="email" class="block text-gray-700 mb-2">Email</label>
                <input type="email" id="email" bind:value={email} class="w-full border p-2 rounded" required />
            </div>
            <div>
                <label for="password" class="block text-gray-700 mb-2">Password</label>
                <input type="password" id="password" bind:value={password} class="w-full border p-2 rounded" required />
            </div>
            <button type="submit" class="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors">
                Login
            </button>
        </form>
        <div class="mt-4">
            <button on:click={handleGoogleLogin} class="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition-colors">
                Sign in with Google
            </button>
        </div>
    </div>
</div>

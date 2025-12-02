<script>
	import Navbar from '$lib/components/Navigation.svelte';
	let { children } = $props();
</script>

<Navbar></Navbar>
{@render children()}

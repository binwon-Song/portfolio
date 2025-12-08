<script lang="ts">
    import "./layout.css";
    import Navbar from "$lib/components/Navigation.svelte";
    import Hero from "$lib/components/Hero.svelte";
    import About from "$lib/components/About.svelte";
    import Publications from "$lib/components/Publications.svelte";
    import Projects from "$lib/components/Projects.svelte";
    import type { PageData } from "./$types.js";

    export let data: PageData;
</script>

<Navbar navFiles={data.navFiles}></Navbar>
<div class="min-h-screen bg-gradient-to-br font-sans">
    <main>
        <!-- Hero + About/Education Side Panel -->
        <section id="home" class="py-20 bg-white">
            <div class="container mx-auto px-[5%]">
                <div
                    class="grid grid-cols-1 lg:grid-cols-5 items-start lg:items-center"
                >
                    <Hero />
                    <About />
                </div>
            </div>
        </section>

        <!-- Publications Section -->
        <!-- if load -->
        <Publications publications={data.publications} />

        <!-- Projects Section -->
        <Projects projects={data.projects} />
    </main>
</div>

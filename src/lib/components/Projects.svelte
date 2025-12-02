<script lang="ts">
    export let projects: any[] = [];

    let expandedProjects: Set<number> = new Set();

    function toggleProject(index: number) {
        if (expandedProjects.has(index)) {
            expandedProjects.delete(index);
        } else {
            expandedProjects.add(index);
        }
        expandedProjects = expandedProjects; // Trigger reactivity
    }
</script>

<section id="projects" class="py-20 bg-white">
    <div class="container mx-auto px-6">
        <h2 class="text-4xl font-bold text-center text-gray-800 mb-16">Featured Projects</h2>
        <div id="project-list" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {#each projects as proj, index}
                <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                    <img src={proj.image} alt={proj.title} class="w-full h-48 object-cover" loading="lazy" />
                    <div class="p-6">
                        <h3 class="text-xl font-semibold text-gray-800 mb-2">{proj.title}</h3>
                        <div>
                            {#if !expandedProjects.has(index)}
                                <p class="text-gray-600 mb-1">
                                    {proj.summary}
                                </p>
                            {:else}
                                <div class="text-gray-600 mb-1">
                                    {proj.description}
                                </div>
                            {/if}

                            <button type="button" on:click={() => toggleProject(index)}
                                class="text-sm text-gray-600 hover:underline mb-4">
                                {expandedProjects.has(index) ? '간단히 보기' : '자세히 보기'}
                            </button>
                        </div>
                        <a href={proj.link} class="text-primary hover:underline text-right block">View Project</a>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</section>

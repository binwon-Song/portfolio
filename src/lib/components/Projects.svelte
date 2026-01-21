<script lang="ts">
    import type { Project } from "$lib/types";
    import ProjectDetailModal from "./ProjectDetailModal.svelte";

    export let projects: Project[] = [];

    let selectedProject: Project | null = null;
    let isModalOpen = false;

    function openProject(proj: Project) {
        selectedProject = proj;
        isModalOpen = true;
    }

    function closeProject() {
        selectedProject = null;
        isModalOpen = false;
    }
</script>

<section id="projects" class="py-20 bg-white">
    <div class="container mx-auto px-6">
        <h2 class="text-4xl font-bold text-center text-gray-800 mb-16">
            Projects
        </h2>
        <div
            id="project-list"
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
            {#each projects as proj, index}
                <div
                    class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                    <img
                        src={proj.image}
                        alt={proj.title}
                        class="w-full h-48 object-cover"
                        loading="lazy"
                    />
                    <div class="p-6">
                        <h3 class="text-xl font-semibold text-gray-800 mb-2">
                            {proj.title}
                        </h3>
                        <div>
                            <p class="text-gray-600 mb-4 line-clamp-2">
                                {proj.summary}
                            </p>

                            {#if proj.postId}
                                <a
                                    href="/posts/{proj.postId}"
                                    class="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                                >
                                    Details <i class="bi bi-journal-text"></i>
                                </a>
                            {:else}
                                <button
                                    type="button"
                                    on:click={() => openProject(proj)}
                                    class="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                                >
                                    Details <i class="bi bi-plus-circle"></i>
                                </button>
                            {/if}
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    </div>
</section>

{#if isModalOpen && selectedProject}
    <ProjectDetailModal project={selectedProject} onClose={closeProject} />
{/if}

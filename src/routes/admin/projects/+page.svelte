<script lang="ts">
    import { enhance } from "$app/forms";
    import { invalidateAll } from "$app/navigation";
    import ProjectModal from "$lib/components/admin/ProjectModal.svelte";
    import type { Project } from "$lib/types";

    export let data;

    let projects: Project[] = data.projects;
    let showAddProjModal = false;
    let createProjForm: HTMLFormElement;
    let newProj = {
        title: "",
        image: "",
        summary: "",
        description: "",
        link: "",
    };

    // Editing state for projects
    let editingProjId: string | null = null;
    let editProj = {
        title: "",
        image: "",
        summary: "",
        description: "",
        link: "",
    };

    $: projects = data.projects;

    function handleAddProject(e: any) {
        newProj = e;
        showAddProjModal = false;
        setTimeout(() => createProjForm.requestSubmit(), 0);
    }

    function startEditProject(proj: Project) {
        editingProjId = proj.id!;
        editProj = {
            title: proj.title || "",
            image: proj.image || "",
            summary: proj.summary || "",
            description: proj.description || "",
            link: proj.link || "",
        };
    }

    function cancelEditProject() {
        editingProjId = null;
        editProj = {
            title: "",
            image: "",
            summary: "",
            description: "",
            link: "",
        };
    }
</script>

<div class="animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div
        class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
    >
        <div>
            <h2 class="text-3xl font-bold text-gray-800 tracking-tight">
                Projects
            </h2>
            <p class="text-gray-500 mt-1">Manage your portfolio projects</p>
        </div>
        <button
            on:click={() => (showAddProjModal = true)}
            class="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md flex items-center gap-2 font-medium"
        >
            <i class="bi bi-plus-lg"></i> Add Project
        </button>
    </div>

    <!-- Hidden Form for Create -->
    <form
        action="?/createProject"
        method="POST"
        use:enhance={() => {
            return async ({ result }) => {
                if (result.type === "success") {
                    newProj = {
                        title: "",
                        image: "",
                        summary: "",
                        description: "",
                        link: "",
                    };
                    await invalidateAll();
                } else {
                    alert("Error adding project");
                }
            };
        }}
        bind:this={createProjForm}
        class="hidden"
    >
        <input type="text" name="title" value={newProj.title} />
        <input type="text" name="image" value={newProj.image} />
        <input type="text" name="summary" value={newProj.summary} />
        <input type="text" name="description" value={newProj.description} />
        <input type="text" name="link" value={newProj.link} />
    </form>

    <div class="space-y-4 max-w-5xl">
        {#each projects as proj}
            <div class="flex items-start gap-3 group">
                <!-- Main Card -->
                <div
                    class="flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col sm:flex-row"
                >
                    {#if editingProjId === proj.id}
                        <div class="p-6 w-full">
                            <form
                                action="?/updateProject"
                                method="POST"
                                use:enhance={() => {
                                    return async ({ result }) => {
                                        if (result.type === "success") {
                                            editingProjId = null;
                                            await invalidateAll();
                                        } else {
                                            alert("Error updating project");
                                        }
                                    };
                                }}
                                class="space-y-4"
                            >
                                <input
                                    type="hidden"
                                    name="id"
                                    value={proj.id}
                                />
                                <div
                                    class="grid grid-cols-1 md:grid-cols-2 gap-4"
                                >
                                    <div>
                                        <label
                                            class="block text-xs font-semibold text-gray-500 uppercase mb-1"
                                            >Title</label
                                        >
                                        <input
                                            type="text"
                                            name="title"
                                            bind:value={editProj.title}
                                            class="w-full border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                                            placeholder="Project Title"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label
                                            class="block text-xs font-semibold text-gray-500 uppercase mb-1"
                                            >Link</label
                                        >
                                        <input
                                            type="text"
                                            name="link"
                                            bind:value={editProj.link}
                                            class="w-full border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                                            placeholder="Project Link"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label
                                        class="block text-xs font-semibold text-gray-500 uppercase mb-1"
                                        >Image URL</label
                                    >
                                    <input
                                        type="text"
                                        name="image"
                                        bind:value={editProj.image}
                                        class="w-full border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                                        placeholder="https://..."
                                    />
                                </div>
                                <div>
                                    <label
                                        class="block text-xs font-semibold text-gray-500 uppercase mb-1"
                                        >Summary</label
                                    >
                                    <input
                                        type="text"
                                        name="summary"
                                        bind:value={editProj.summary}
                                        class="w-full border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
                                        placeholder="Short summary"
                                    />
                                </div>
                                <div>
                                    <label
                                        class="block text-xs font-semibold text-gray-500 uppercase mb-1"
                                        >Description</label
                                    >
                                    <textarea
                                        name="description"
                                        bind:value={editProj.description}
                                        class="w-full border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm h-24"
                                        placeholder="Detailed description"
                                    ></textarea>
                                </div>
                                <div class="flex gap-2 justify-end pt-2">
                                    <button
                                        type="button"
                                        on:click={cancelEditProject}
                                        class="px-3 py-1.5 text-sm rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
                                        >Cancel</button
                                    >
                                    <button
                                        type="submit"
                                        class="px-3 py-1.5 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm"
                                        >Save Changes</button
                                    >
                                </div>
                            </form>
                        </div>
                    {:else}
                        <!-- Display Mode -->
                        <div
                            class="sm:w-48 h-48 sm:h-auto relative bg-gray-100 flex-shrink-0"
                        >
                            {#if proj.image}
                                <img
                                    src={proj.image}
                                    alt={proj.title}
                                    class="w-full h-full object-cover"
                                />
                            {:else}
                                <div
                                    class="flex items-center justify-center h-full text-gray-300"
                                >
                                    <i class="bi bi-image text-4xl"></i>
                                </div>
                            {/if}
                        </div>
                        <div class="p-6 flex-1 flex flex-col">
                            <div class="flex justify-between items-start mb-2">
                                <h4 class="font-bold text-lg text-gray-800">
                                    {proj.title}
                                </h4>
                            </div>
                            <p class="text-sm text-gray-500 mb-4 line-clamp-2">
                                {proj.summary}
                            </p>

                            <div
                                class="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between"
                            >
                                {#if proj.link}
                                    <a
                                        href={proj.link}
                                        target="_blank"
                                        class="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center gap-1"
                                    >
                                        Visit Project <i
                                            class="bi bi-arrow-up-right text-xs"
                                        ></i>
                                    </a>
                                {:else}
                                    <span class="text-gray-400 text-sm"
                                        >No link provided</span
                                    >
                                {/if}
                            </div>
                        </div>
                    {/if}
                </div>

                <!-- Side Actions Buttons (Outside Card) -->
                <div
                    class="flex flex-col gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <button
                        on:click={() => startEditProject(proj)}
                        class="p-2.5 bg-white text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 border border-gray-200 rounded-lg shadow-sm transition-all"
                        title="Edit"
                    >
                        <i class="bi bi-pencil-fill"></i>
                    </button>
                    <form action="?/deleteProject" method="POST" use:enhance>
                        <input type="hidden" name="id" value={proj.id} />
                        <button
                            type="submit"
                            class="p-2.5 bg-white text-gray-500 hover:text-red-600 hover:bg-red-50 border border-gray-200 rounded-lg shadow-sm transition-all"
                            on:click={(e) =>
                                !confirm(
                                    "Are you sure you want to delete this project?",
                                ) && e.preventDefault()}
                            title="Delete"
                        >
                            <i class="bi bi-trash-fill"></i>
                        </button>
                    </form>
                </div>
            </div>
        {/each}

        {#if projects.length === 0}
            <div
                class="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50"
            >
                <p class="text-gray-500">
                    No projects found. Click 'Add Project' to create one.
                </p>
            </div>
        {/if}
    </div>

    {#if showAddProjModal}
        <ProjectModal
            onAdd={handleAddProject}
            onClose={() => (showAddProjModal = false)}
        />
    {/if}
</div>

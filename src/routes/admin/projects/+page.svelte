<script lang="ts">
    import { enhance } from "$app/forms";
    import { invalidateAll } from "$app/navigation";
    import ProjectModal from "$lib/components/admin/ProjectModal.svelte";

    export let data;

    let projects: any[] = data.projects;
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

    function handleAddProject(e: CustomEvent) {
        newProj = e.detail;
        setTimeout(() => createProjForm.requestSubmit(), 0);
    }

    function startEditProject(proj: any) {
        editingProjId = proj.id;
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

<div>
    <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-semibold">Manage Projects</h2>
        <button
            on:click={() => (showAddProjModal = true)}
            class="bg-indigo-600 text-white px-4 py-2 rounded">추가 하기</button
        >
    </div>

    <!-- Hidden Form for Create -->
    <form
        action="?/createProject"
        method="POST"
        use:enhance={() => {
            return async ({ result }) => {
                if (result.type === "success") {
                    alert("Project added!");
                    showAddProjModal = false;
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

    <div class="space-y-4">
        {#each projects as proj}
            <div class="bg-white p-4 rounded shadow">
                {#if editingProjId === proj.id}
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
                        class="space-y-2"
                    >
                        <input type="hidden" name="id" value={proj.id} />
                        <input
                            type="text"
                            name="title"
                            bind:value={editProj.title}
                            class="w-full border p-2 rounded"
                            placeholder="Title"
                            required
                        />
                        <input
                            type="text"
                            name="image"
                            bind:value={editProj.image}
                            class="w-full border p-2 rounded"
                            placeholder="Image URL"
                        />
                        <input
                            type="text"
                            name="link"
                            bind:value={editProj.link}
                            class="w-full border p-2 rounded"
                            placeholder="Link"
                        />
                        <input
                            type="text"
                            name="summary"
                            bind:value={editProj.summary}
                            class="w-full border p-2 rounded"
                            placeholder="Summary"
                        />
                        <textarea
                            name="description"
                            bind:value={editProj.description}
                            class="w-full border p-2 rounded"
                            placeholder="Description"
                        ></textarea>
                        <div class="flex gap-2">
                            <button
                                type="submit"
                                class="bg-green-500 text-white px-3 py-1 rounded"
                                >Save</button
                            >
                            <button
                                type="button"
                                on:click={cancelEditProject}
                                class="bg-gray-300 px-3 py-1 rounded"
                                >Cancel</button
                            >
                        </div>
                    </form>
                {:else}
                    <div class="flex justify-between items-start">
                        <div>
                            <h4 class="font-bold">{proj.title}</h4>
                            <p class="text-sm text-gray-500">{proj.summary}</p>
                        </div>
                        <div class="flex items-center gap-2">
                            <button
                                on:click={() => startEditProject(proj)}
                                class="text-blue-500 hover:text-blue-700"
                                >Edit</button
                            >
                            <form
                                action="?/deleteProject"
                                method="POST"
                                use:enhance
                            >
                                <input
                                    type="hidden"
                                    name="id"
                                    value={proj.id}
                                />
                                <button
                                    type="submit"
                                    class="text-red-500 hover:text-red-700"
                                    on:click={(e) =>
                                        !confirm("Are you sure?") &&
                                        e.preventDefault()}>Delete</button
                                >
                            </form>
                        </div>
                    </div>
                {/if}
            </div>
        {/each}
    </div>

    {#if showAddProjModal}
        <ProjectModal
            on:add={handleAddProject}
            on:close={() => (showAddProjModal = false)}
        />
    {/if}
</div>

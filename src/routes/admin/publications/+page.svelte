<script lang="ts">
    import { enhance } from "$app/forms";
    import { invalidateAll } from "$app/navigation";
    import PubModal from "$lib/components/admin/PubModal.svelte";
    import type { Publication } from "$lib/types";

    export let data;

    let publications: Publication[] = data.publications;
    let showModal = false;
    let selectedPub: Publication | null = null;

    let createPubForm: HTMLFormElement;
    let updatePubForm: HTMLFormElement;

    let formData = {
        id: "",
        title: "",
        conference: "",
        description: "",
    };

    $: publications = data.publications;

    function openAddModal() {
        selectedPub = null;
        formData = { id: "", title: "", conference: "", description: "" };
        showModal = true;
    }

    function openEditModal(pub: Publication) {
        selectedPub = pub;
        showModal = true;
    }

    function handleSave(data: Partial<Publication>) {
        formData = {
            id: selectedPub?.id || "",
            title: data.title || "",
            conference: data.conference || "",
            description: data.description || "",
        };

        showModal = false;

        setTimeout(() => {
            if (selectedPub) {
                updatePubForm.requestSubmit();
            } else {
                createPubForm.requestSubmit();
            }
        }, 0);
    }
</script>

<div class="animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div
        class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4"
    >
        <div>
            <h2 class="text-3xl font-bold text-gray-800 tracking-tight">
                Publications
            </h2>
            <p class="text-gray-500 mt-1">
                Manage research papers and publications
            </p>
        </div>
        <button
            on:click={openAddModal}
            class="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md flex items-center gap-2 font-medium"
        >
            <i class="bi bi-plus-lg"></i> Add Publication
        </button>
    </div>

    <!-- Hidden Form for Create -->
    <form
        action="?/createPublication"
        method="POST"
        use:enhance={() => {
            return async ({ result }) => {
                if (result.type === "success") {
                    await invalidateAll();
                } else {
                    alert("Error adding publication");
                }
            };
        }}
        bind:this={createPubForm}
        class="hidden"
    >
        <input type="text" name="title" bind:value={formData.title} />
        <input type="text" name="conference" bind:value={formData.conference} />
        <input
            type="text"
            name="description"
            bind:value={formData.description}
        />
    </form>

    <!-- Hidden Form for Update -->
    <form
        action="?/updatePublication"
        method="POST"
        use:enhance={() => {
            return async ({ result }) => {
                if (result.type === "success") {
                    await invalidateAll();
                } else {
                    alert("Error updating publication");
                }
            };
        }}
        bind:this={updatePubForm}
        class="hidden"
    >
        <input type="hidden" name="id" bind:value={formData.id} />
        <input type="text" name="title" bind:value={formData.title} />
        <input type="text" name="conference" bind:value={formData.conference} />
        <input
            type="text"
            name="description"
            bind:value={formData.description}
        />
    </form>

    <div class="space-y-4 max-w-10xl">
        {#each publications as pub}
            <div class="flex items-start gap-3 group">
                <!-- Main Card -->
                <div
                    class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex-1"
                >
                    <div class="flex items-center gap-3 mb-2">
                        <span
                            class="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-xs font-semibold tracking-wide uppercase"
                            >Paper</span
                        >
                        <h4
                            class="text-lg font-bold text-gray-800 leading-tight"
                        >
                            {pub.title}
                        </h4>
                    </div>
                    <p class="text-sm font-medium text-indigo-600 mb-2">
                        {pub.conference}
                    </p>
                    <p
                        class="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap"
                    >
                        {pub.description}
                    </p>
                </div>

                <!-- Side Actions Buttons (Outside Card) -->
                <div
                    class="flex flex-col gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <button
                        on:click={() => openEditModal(pub)}
                        class="p-2.5 bg-white text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 border border-gray-200 rounded-lg shadow-sm transition-all"
                        title="Edit"
                    >
                        <i class="bi bi-pencil-fill"></i>
                    </button>
                    <form
                        action="?/deletePublication"
                        method="POST"
                        use:enhance
                    >
                        <input type="hidden" name="id" value={pub.id} />
                        <button
                            type="submit"
                            class="p-2.5 bg-white text-gray-500 hover:text-red-600 hover:bg-red-50 border border-gray-200 rounded-lg shadow-sm transition-all"
                            on:click={(e) =>
                                !confirm("Are you sure?") && e.preventDefault()}
                            title="Delete"
                        >
                            <i class="bi bi-trash-fill"></i>
                        </button>
                    </form>
                </div>
            </div>
        {/each}

        {#if publications.length === 0}
            <div
                class="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50"
            >
                <p class="text-gray-500">
                    No publications found. Click 'Add Publication' to create
                    one.
                </p>
            </div>
        {/if}
    </div>

    {#if showModal}
        <PubModal
            publication={selectedPub || undefined}
            onSave={handleSave}
            onClose={() => (showModal = false)}
        />
    {/if}
</div>

<script lang="ts">
    import { enhance } from "$app/forms";
    import { invalidateAll } from "$app/navigation";
    import PubModal from "$lib/components/admin/PubModal.svelte";

    export let data;

    let publications: any[] = data.publications;
    let showAddPubModal = false;
    let createPubForm: HTMLFormElement;
    let newPub = { title: "", conference: "", description: "" };

    // Editing state for publications
    let editingPubId: string | null = null;
    let editPub = { title: "", conference: "", description: "" };

    $: publications = data.publications;

    function handleAddPublication(e: CustomEvent) {
        newPub = e.detail;
        setTimeout(() => createPubForm.requestSubmit(), 0);
    }

    function startEditPublication(pub: any) {
        editingPubId = pub.id;
        editPub = {
            title: pub.title || "",
            conference: pub.conference || "",
            description: pub.description || "",
        };
    }

    function cancelEditPublication() {
        editingPubId = null;
        editPub = { title: "", conference: "", description: "" };
    }
</script>

<div>
    <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-semibold">Manage Publications</h2>
        <button
            on:click={() => (showAddPubModal = true)}
            class="bg-indigo-600 text-white px-4 py-2 rounded">추가 하기</button
        >
    </div>

    <!-- Hidden Form for Create -->
    <form
        action="?/createPublication"
        method="POST"
        use:enhance={() => {
            return async ({ result }) => {
                if (result.type === "success") {
                    alert("Publication added!");
                    showAddPubModal = false;
                    newPub = { title: "", conference: "", description: "" };
                    await invalidateAll();
                } else {
                    alert("Error adding publication");
                }
            };
        }}
        bind:this={createPubForm}
        class="hidden"
    >
        <input type="text" name="title" value={newPub.title} />
        <input type="text" name="conference" value={newPub.conference} />
        <input type="text" name="description" value={newPub.description} />
    </form>

    <div class="space-y-4">
        {#each publications as pub}
            <div class="bg-white p-4 rounded shadow">
                {#if editingPubId === pub.id}
                    <form
                        action="?/updatePublication"
                        method="POST"
                        use:enhance={() => {
                            return async ({ result }) => {
                                if (result.type === "success") {
                                    editingPubId = null;
                                    await invalidateAll();
                                } else {
                                    alert("Error updating publication");
                                }
                            };
                        }}
                        class="space-y-2"
                    >
                        <input type="hidden" name="id" value={pub.id} />
                        <input
                            type="text"
                            name="title"
                            bind:value={editPub.title}
                            class="w-full border p-2 rounded"
                            placeholder="Title"
                            required
                        />
                        <input
                            type="text"
                            name="conference"
                            bind:value={editPub.conference}
                            class="w-full border p-2 rounded"
                            placeholder="Conference"
                        />
                        <textarea
                            name="description"
                            bind:value={editPub.description}
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
                                on:click={cancelEditPublication}
                                class="bg-gray-300 px-3 py-1 rounded"
                                >Cancel</button
                            >
                        </div>
                    </form>
                {:else}
                    <div class="flex justify-between items-start">
                        <div>
                            <h4 class="font-bold">{pub.title}</h4>
                            <p class="text-sm text-gray-500">
                                {pub.conference}
                            </p>
                        </div>
                        <div class="flex items-center gap-2">
                            <button
                                on:click={() => startEditPublication(pub)}
                                class="text-blue-500 hover:text-blue-700"
                                >Edit</button
                            >
                            <form
                                action="?/deletePublication"
                                method="POST"
                                use:enhance
                            >
                                <input type="hidden" name="id" value={pub.id} />
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

    {#if showAddPubModal}
        <PubModal
            on:add={handleAddPublication}
            on:close={() => (showAddPubModal = false)}
        />
    {/if}
</div>

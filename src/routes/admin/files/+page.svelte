<script lang="ts">
    import { enhance } from "$app/forms";
    import { invalidateAll } from "$app/navigation";
    import FileModal from "$lib/components/admin/FileModal.svelte";

    export let data;

    let navFiles: any[] = data.navFiles;
    let showAddFileModal = false;

    $: navFiles = data.navFiles;
</script>

<div>
    <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-semibold">Navbar Files</h2>
        <button
            on:click={() => (showAddFileModal = true)}
            class="bg-indigo-600 text-white px-4 py-2 rounded">추가 하기</button
        >
    </div>

    <div class="bg-white p-6 rounded-lg shadow mb-6">
        <div class="space-y-4">
            <div>
                <h3 class="text-lg font-medium mb-2">Existing Navbar Files</h3>
                <div class="space-y-2">
                    {#each navFiles as nf}
                        <div
                            class="flex items-center justify-between bg-gray-50 p-2 rounded"
                        >
                            <div>
                                <div class="font-medium">{nf.name}</div>
                                <div class="text-xs text-gray-500">
                                    {nf.url}
                                </div>
                            </div>
                            <div class="flex items-center gap-2">
                                <a
                                    href={nf.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="text-indigo-600">Open</a
                                >
                                <form
                                    action="?/deleteNavFile"
                                    method="POST"
                                    use:enhance
                                >
                                    <input
                                        type="hidden"
                                        name="id"
                                        value={nf.id}
                                    />
                                    <input
                                        type="hidden"
                                        name="storagePath"
                                        value={nf.storagePath}
                                    />
                                    <button
                                        type="submit"
                                        class="text-red-600"
                                        on:click={(e) =>
                                            !confirm("Delete nav file?") &&
                                            e.preventDefault()}>Delete</button
                                    >
                                </form>
                            </div>
                        </div>
                    {/each}
                    {#if navFiles.length === 0}
                        <div class="text-sm text-gray-500">
                            No navbar files yet.
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    </div>

    {#if showAddFileModal}
        <FileModal
            onClose={() => (showAddFileModal = false)}
            onUploaded={async () => {
                await invalidateAll();
            }}
        />
    {/if}
</div>

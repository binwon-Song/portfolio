<script lang="ts">
    import { enhance } from "$app/forms";
    import { invalidateAll } from "$app/navigation";
    import FileModal from "$lib/components/admin/FileModal.svelte";
    import type { NavFile } from "$lib/types";

    export let data;

    let navFiles: NavFile[] = data.navFiles;
    let showAddFileModal = false;

    $: navFiles = data.navFiles;
</script>

<div>
    <div class="flex justify-end items-center mb-6">
        <button
            on:click={() => (showAddFileModal = true)}
            class="bg-indigo-600 text-white px-4 py-2 rounded">추가 하기</button
        >
    </div>

    <div class="bg-white p-6 rounded-lg shadow mb-6">
        <div class="space-y-4">
            <div>
                <div class="space-y-2">
                    {#each navFiles as nf}
                        <div
                            class="flex items-center justify-between bg-gray-50 p-2 rounded"
                        >
                            <div>
                                <div class="font-medium">{nf.name}</div>
                                <div class="text-xs text-gray-500">
                                    {#if nf.size < 1024 * 1024}
                                        {(nf.size / 1024).toFixed(2)} KB
                                    {:else}
                                        {(nf.size / (1024 * 1024)).toFixed(2)} MB
                                    {/if}
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
                        <div
                            class="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50"
                        >
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

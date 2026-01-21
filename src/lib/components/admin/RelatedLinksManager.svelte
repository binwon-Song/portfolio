<script lang="ts">
    interface Link {
        label: string;
        url: string;
    }

    interface Props {
        links: Link[];
    }

    let { links = $bindable([]) }: Props = $props();

    function addLink() {
        links = [...links, { label: "", url: "" }];
    }

    function removeLink(index: number) {
        links = links.filter((_, i) => i !== index);
    }
</script>

<div class="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
    <div class="flex items-center justify-between mb-4">
        <h3
            class="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2"
        >
            <i class="bi bi-link-45deg text-lg"></i> Related Links
        </h3>
        <button
            type="button"
            onclick={addLink}
            class="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1"
        >
            <i class="bi bi-plus-lg"></i> Add Link
        </button>
    </div>

    {#if links.length === 0}
        <p class="text-xs text-gray-400 italic">No related links added.</p>
    {:else}
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            {#each links as link, i}
                <div
                    class="flex items-center gap-2 bg-gray-50 p-2 rounded-md border border-gray-100"
                >
                    <input
                        type="text"
                        placeholder="Label"
                        bind:value={link.label}
                        class="flex-1 text-xs border border-gray-200 rounded p-1.5 focus:ring-1 focus:ring-indigo-500 outline-none"
                    />
                    <input
                        type="text"
                        placeholder="URL"
                        bind:value={link.url}
                        class="flex-[2] text-xs border border-gray-200 rounded p-1.5 focus:ring-1 focus:ring-indigo-500 outline-none"
                    />
                    <button
                        type="button"
                        onclick={() => removeLink(i)}
                        class="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Remove link"
                    >
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            {/each}
        </div>
    {/if}
</div>

<script lang="ts">
    import type { Project } from "$lib/types";
    import PostRenderer from "$lib/components/posts/PostRenderer.svelte";
    import RelatedLinksManager from "$lib/components/admin/RelatedLinksManager.svelte";

    interface Props {
        contentMd: string;
        title: string;
        projectId?: string;
        projects?: Project[];
        links?: { label: string; url: string }[];
    }

    let {
        contentMd = $bindable(""),
        title = $bindable(""),
        projectId = $bindable(""),
        projects = [],
        links = $bindable([]),
    }: Props = $props();

    async function handleImageUpload(event: Event) {
        const input = event.target as HTMLInputElement;
        if (!input.files || input.files.length === 0) return;

        const file = input.files[0];
        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/api/posts/upload", {
                method: "POST",
                body: formData,
            });
            const result = await response.json();
            if (result.success) {
                const imgMarkdown = `![${file.name}](${result.url})`;
                contentMd += `\n${imgMarkdown}\n`;
            } else {
                alert("Upload failed: " + result.error);
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Upload failed");
        }
    }
</script>

<div class="flex flex-col h-full gap-4 p-4 bg-gray-50">
    <div
        class="flex items-center justify-between gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200"
    >
        <input
            type="text"
            bind:value={title}
            placeholder="Post Title"
            class="flex-1 p-2 text-2xl font-bold border-none focus:outline-none focus:ring-0"
        />
        <div class="flex items-center gap-2">
            <span
                class="text-sm font-medium text-gray-500 uppercase tracking-wider"
                >Project:</span
            >
            <select
                bind:value={projectId}
                class="p-2 text-sm border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
                <option value="">No link</option>
                {#each projects as p}
                    <option value={p.id}>{p.title}</option>
                {/each}
            </select>
        </div>
        <div class="flex gap-2">
            <label
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm cursor-pointer hover:bg-gray-50 flex items-center gap-2"
            >
                <i class="bi bi-image"></i>
                Insert Image
                <input
                    type="file"
                    accept="image/*"
                    class="hidden"
                    onchange={handleImageUpload}
                />
            </label>
        </div>
    </div>

    <!-- Related Links Section -->
    <RelatedLinksManager bind:links />

    <div class="flex flex-1 gap-4 overflow-hidden min-h-0">
        <!-- Editor -->
        <div
            class="flex-1 flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
        >
            <div
                class="px-4 py-2 border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider"
            >
                Markdown Editor
            </div>
            <textarea
                bind:value={contentMd}
                class="flex-1 p-4 font-mono text-sm border-none focus:outline-none focus:ring-0 resize-none"
                placeholder="Write your markdown here..."
            ></textarea>
        </div>

        <!-- Preview -->
        <div
            class="flex-1 flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
        >
            <div
                class="px-4 py-2 border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider"
            >
                Live Preview
            </div>
            <div class="flex-1 overflow-auto p-8">
                <PostRenderer {contentMd} />
            </div>
        </div>
    </div>
</div>

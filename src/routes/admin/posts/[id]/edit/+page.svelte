<script lang="ts">
    import MarkdownEditor from "$lib/components/MarkdownEditor.svelte";
    import { enhance } from "$app/forms";
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();

    let title = $state(data.post.title);
    let contentMd = $state(data.post.content_md);
    let projectId = $state(data.post.projectId || "");
    let links = $state<{ label: string; url: string }[]>(data.post.links || []);
    let loading = $state(false);
</script>

<form
    method="POST"
    use:enhance={() => {
        loading = true;
        return async ({ update }) => {
            loading = false;
            update();
        };
    }}
    class="flex flex-col h-screen"
>
    <!-- Hidden inputs to bind Svelte state to form data -->
    <input type="hidden" name="title" value={title} />
    <input type="hidden" name="content_md" value={contentMd} />
    <input type="hidden" name="projectId" value={projectId} />
    <input type="hidden" name="links" value={JSON.stringify(links)} />

    <div class="flex-1 overflow-hidden flex flex-col">
        <MarkdownEditor
            bind:title
            bind:contentMd
            bind:projectId
            bind:links
            projects={data.projects}
        />
    </div>

    <div class="p-4 bg-white border-t border-gray-200 flex justify-end gap-3">
        <a
            href="/admin/posts"
            class="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
        >
            Cancel
        </a>
        <button
            type="submit"
            disabled={loading || !title || !contentMd}
            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
            {#if loading}
                <div
                    class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                ></div>
            {/if}
            Update Post
        </button>
    </div>
</form>

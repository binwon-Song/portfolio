<script lang="ts">
    import { enhance } from "$app/forms";
    import type { PageProps } from "./$types";

    let { data }: PageProps = $props();
</script>

<div class="p-6">
    <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold">Posts</h1>
        <a
            href="/admin/posts/new"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
            <i class="bi bi-plus-lg mr-2"></i>New Post
        </a>
    </div>

    <div
        class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
    >
        <table class="w-full text-left">
            <thead class="bg-gray-50 border-b border-gray-200">
                <tr>
                    <th
                        class="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                        >Title</th
                    >
                    <th
                        class="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                        >Project</th
                    >
                    <th
                        class="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider"
                        >Created At</th
                    >
                    <th
                        class="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right"
                        >Actions</th
                    >
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
                {#each data.posts as post}
                    {@const linkedProject = data.projects.find(
                        (p) => p.id === post.projectId,
                    )}
                    <tr class="hover:bg-gray-50 transition">
                        <td class="px-6 py-4">
                            <div class="font-medium text-gray-900">
                                {post.title}
                            </div>
                        </td>
                        <td class="px-6 py-4 text-sm">
                            {#if linkedProject}
                                <span
                                    class="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md border border-indigo-100 font-medium"
                                >
                                    {linkedProject.title}
                                </span>
                            {:else}
                                <span class="text-gray-400 italic"
                                    >No project linked</span
                                >
                            {/if}
                        </td>
                        <td class="px-6 py-4 text-sm text-gray-500">
                            {post.createdAt?.toLocaleDateString()}
                        </td>
                        <td class="px-6 py-4 text-right">
                            <div class="flex justify-end gap-2">
                                <a
                                    href="/admin/posts/{post.id}/edit"
                                    class="p-2 text-gray-600 hover:text-blue-600 transition"
                                    title="Edit"
                                >
                                    <i class="bi bi-pencil-square text-xl"></i>
                                </a>
                                <form
                                    method="POST"
                                    action="?/delete"
                                    use:enhance
                                >
                                    <input
                                        type="hidden"
                                        name="id"
                                        value={post.id}
                                    />
                                    <button
                                        type="submit"
                                        class="p-2 text-gray-600 hover:text-red-600 transition"
                                        title="Delete"
                                        on:click={(e) =>
                                            !confirm("Are you sure?") &&
                                            e.preventDefault()}
                                    >
                                        <i class="bi bi-trash text-xl"></i>
                                    </button>
                                </form>
                            </div>
                        </td>
                    </tr>
                {/each}
                {#if data.posts.length === 0}
                    <tr>
                        <td
                            colspan="3"
                            class="px-6 py-8 text-center text-gray-500"
                        >
                            No posts found. Create your first post!
                        </td>
                    </tr>
                {/if}
            </tbody>
        </table>
    </div>
</div>

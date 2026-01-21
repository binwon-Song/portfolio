<script lang="ts">
    import type { Project } from "$lib/types";
    import { fade, fly } from "svelte/transition";

    export let project: Project;
    export let onClose: () => void;

    function handleBackdropClick(e: MouseEvent) {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm"
    on:click={handleBackdropClick}
    transition:fade={{ duration: 200 }}
>
    <div
        class="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]"
        transition:fly={{ y: 20, duration: 300 }}
    >
        <!-- Close Button -->
        <button
            on:click={onClose}
            class="absolute top-4 right-4 z-10 p-2 bg-white/80 backdrop-blur-md rounded-full text-gray-500 hover:text-gray-800 transition-colors shadow-sm"
            aria-label="Close"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                />
            </svg>
        </button>

        <!-- Project Image -->
        <div class="h-64 sm:h-80 w-full bg-gray-100 flex-shrink-0">
            {#if project.image}
                <img
                    src={project.image}
                    alt={project.title}
                    class="w-full h-full object-cover"
                />
            {:else}
                <div
                    class="w-full h-full flex items-center justify-center text-gray-300"
                >
                    <i class="bi bi-image text-6xl"></i>
                </div>
            {/if}
        </div>

        <!-- Content -->
        <div class="p-6 sm:p-8 overflow-y-auto flex-1">
            <h3 class="text-3xl font-bold text-gray-900 mb-4">
                {project.title}
            </h3>

            <div class="space-y-6">
                <div>
                    <h4
                        class="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-2"
                    >
                        Summary
                    </h4>
                    <p class="text-gray-700 leading-relaxed text-lg italic">
                        {project.summary}
                    </p>
                </div>

                <div>
                    <h4
                        class="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-2"
                    >
                        Description
                    </h4>
                    <div
                        class="text-gray-700 leading-relaxed whitespace-pre-wrap"
                    >
                        {project.description}
                    </div>
                </div>
            </div>

            <div
                class="mt-8 pt-6 border-t border-gray-100 flex flex-wrap gap-4 items-center justify-between"
            >
                <div class="flex gap-4">
                    {#if project.link}
                        <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition shadow-md hover:shadow-lg font-medium"
                        >
                            Visit Project <i class="bi bi-arrow-up-right"></i>
                        </a>
                    {/if}

                    {#if project.postId}
                        <a
                            href="/posts/{project.postId}"
                            class="inline-flex items-center gap-2 bg-white border border-indigo-200 text-indigo-600 px-6 py-2.5 rounded-xl hover:bg-indigo-50 transition font-medium"
                        >
                            Read More <i class="bi bi-journal-text"></i>
                        </a>
                    {/if}
                </div>

                <button
                    on:click={onClose}
                    class="text-gray-500 hover:text-gray-700 font-medium px-4"
                >
                    Close
                </button>
            </div>
        </div>
    </div>
</div>

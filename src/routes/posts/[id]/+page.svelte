<script lang="ts">
    import type { PageProps } from "./$types";
    import PostRenderer from "$lib/components/posts/PostRenderer.svelte";
    import RelatedLinks from "$lib/components/posts/RelatedLinks.svelte";

    let { data }: PageProps = $props();

    // Use a derived state or simple variable if needed,
    // but PostRenderer will handle the content directly.
</script>

<svelte:head>
    <title>{data.post.title} | Portfolio</title>
</svelte:head>

<div class="max-w-4xl mx-auto p-6 md:p-12">
    <header class="border-b border-gray-100 pb-6">
        <h1 class="text-4xl font-extrabold text-gray-900 mb-4">
            {data.post.title}
        </h1>
        <div class="flex items-center gap-4 text-gray-500 text-sm">
            <time datetime={data.post.createdAt?.toISOString()}>
                <i class="bi bi-calendar3 mr-1"></i>
                {data.post.createdAt?.toLocaleDateString("ko-KR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })}
            </time>
        </div>
    </header>

    <RelatedLinks links={data.post.links} />
    <PostRenderer contentMd={data.post.content_md} />
</div>

<style>
    /* Styles are centralized in PostRenderer.svelte */
</style>

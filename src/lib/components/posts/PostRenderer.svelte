<script lang="ts">
    import { onMount } from "svelte";
    import { marked } from "marked";
    import DOMPurify from "dompurify";
    import { createHighlighter } from "shiki";

    interface Props {
        contentMd: string;
    }

    let { contentMd }: Props = $props();

    let previewHtml = $state("");
    let highlighter = $state<any>(null);

    onMount(async () => {
        highlighter = await createHighlighter({
            themes: ["github-dark"],
            langs: ["javascript", "typescript", "python", "bash", "cpp", "c"],
        });
        await renderMarkdown();
    });

    async function renderMarkdown() {
        if (!contentMd) {
            previewHtml = "";
            return;
        }

        const renderer = new marked.Renderer();
        const originalCode = renderer.code.bind(renderer);

        renderer.code = function (token) {
            const { text, lang } = token;
            if (highlighter && lang) {
                try {
                    return highlighter.codeToHtml(text, {
                        lang,
                        theme: "github-dark",
                    });
                } catch (e) {
                    return originalCode(token);
                }
            }
            return originalCode(token);
        };

        const rawHtml = await marked.parse(contentMd, {
            renderer,
            gfm: true,
            breaks: true,
        });
        previewHtml = DOMPurify.sanitize(rawHtml);
    }

    $effect(() => {
        if (contentMd || highlighter) {
            renderMarkdown();
        }
    });
</script>

<article class="prose max-w-none prose-slate lg:prose-lg">
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html previewHtml}
</article>

<style>
    :global(.prose h1) {
        font-size: 2.25rem;
        font-weight: 800;
        margin-top: 0;
        margin-bottom: 0.8888889em;
        line-height: 1.1111111;
    }
    :global(.prose h2) {
        font-size: 1.5rem;
        font-weight: 700;
        margin-top: 2em;
        margin-bottom: 1em;
        line-height: 1.3333333;
    }
    :global(.prose h3) {
        font-size: 1.25rem;
        font-weight: 600;
        margin-top: 1.6em;
        margin-bottom: 0.6em;
        line-height: 1.6;
    }
    :global(.prose p) {
        margin-top: 1.25em;
        margin-bottom: 1.25em;
    }
    :global(.prose ul) {
        list-style-type: disc;
        margin-top: 1.25em;
        margin-bottom: 1.25em;
        padding-left: 1.625em;
    }
    :global(.prose ol) {
        list-style-type: decimal;
        margin-top: 1.25em;
        margin-bottom: 1.25em;
        padding-left: 1.625em;
    }
    :global(.prose table) {
        width: 100%;
        table-layout: auto;
        text-align: left;
        margin-top: 2em;
        margin-bottom: 2em;
        font-size: 0.875em;
        line-height: 1.7142857;
    }
    :global(.prose thead) {
        border-bottom: 1px solid #e5e7eb;
    }
    :global(.prose th) {
        font-weight: 600;
        vertical-align: bottom;
        padding-right: 0.5714286em;
        padding-bottom: 0.5714286em;
        padding-left: 0.5714286em;
    }
    :global(.prose td) {
        vertical-align: baseline;
        padding: 0.5714286em;
        border-bottom: 1px solid #f3f4f6;
    }
    :global(.prose blockquote) {
        font-weight: 500;
        font-style: italic;
        color: #111827;
        border-left: 0.25rem solid #e5e7eb;
        margin-top: 1.6em;
        margin-bottom: 1.6em;
        padding-left: 1.0666667em;
    }
    :global(.prose img) {
        margin-top: 2em;
        margin-bottom: 2em;
        border-radius: 0.75rem;
        max-width: 100%;
        height: auto;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    }
    :global(.prose pre) {
        line-height: 1.45;
        margin-top: 1.7142857em;
        margin-bottom: 1.7142857em;
        border-radius: 0.5rem;
        padding: 1.25em;
        background-color: #1e293b;
        color: #f8fafc;
    }
    :global(.prose code) {
        color: #111827;
        font-weight: 600;
        font-size: 0.875em;
    }
    :global(.prose code::before) {
        content: "`";
    }
    :global(.prose code::after) {
        content: "`";
    }
    :global(.shiki) {
        margin: 0;
    }
</style>

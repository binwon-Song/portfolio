<script lang="ts">
    interface Link {
        label: string;
        url: string;
    }

    interface Props {
        links?: Link[];
        title?: string;
    }

    let { links = [], title = "관련 링크" }: Props = $props();
</script>

{#if links && links.length > 0}
    <div class="mb-6 pt-6 pb-6 border-b border-gray-100">
        <h3
            class="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2"
        >
            <i class="bi bi-link-45deg text-xl"></i>
            {title}
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {#each links as link}
                <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-indigo-50 hover:text-indigo-700 transition-all border border-transparent hover:border-indigo-100 group"
                >
                    <span class="font-medium">{link.label}</span>
                    <i
                        class="bi bi-arrow-up-right text-gray-400 group-hover:text-indigo-600 transition-colors"
                    ></i>
                </a>
            {/each}
        </div>
    </div>
{/if}

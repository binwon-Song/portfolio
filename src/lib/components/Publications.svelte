<script lang="ts">
    import type { Publication } from "$lib/types";

    export let publications: Publication[] = [];
</script>

<section id="publications" class="py-20 bg-gray-50">
    <div class="container mx-auto px-6">
        <h2 class="text-4xl font-bold text-center text-gray-800 mb-12">Publications</h2>
        <div id="publication-list" class="max-w-4xl mx-auto space-y-6">
            {#each publications as pub}
                <div class="bg-white rounded-xl shadow p-6">
                    <h3 class="font-semibold text-lg">{pub.title}</h3>
                    <div class="text-sm text-gray-500">{pub.conference}</div>
                    <p class="mt-3 text-gray-700 text-sm">{pub.description}</p>
                </div>
            {/each}
        </div>
    </div>
</section>
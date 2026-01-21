<script lang="ts">
    const modules = [
        {
            name: "Posts",
            icon: "bi-journal-text",
            href: "/admin/posts",
            description: "Manage markdown posts",
        },
        {
            name: "Files",
            icon: "bi-files",
            href: "/admin/files",
            description: "Manage uploaded files",
        },
        {
            name: "Publications",
            icon: "bi-book",
            href: "/admin/publications",
            description: "Manage research publications",
        },
        {
            name: "Projects",
            icon: "bi-code-slash",
            href: "/admin/projects",
            description: "Manage portfolio projects",
        },
    ];
</script>

<div class="max-w-4xl mx-auto py-8">
    <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p class="text-gray-600">
            Welcome back. Select a module to manage your content.
        </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        {#each modules as module}
            <a
                href={module.href}
                class="group bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:border-indigo-500 hover:shadow-md transition-all duration-200"
            >
                <div class="flex items-center gap-4 mb-3">
                    <div
                        class="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white"
                    >
                        <i class="bi {module.icon} text-2xl"></i>
                    </div>
                    <h2
                        class="text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors"
                    >
                        {module.name}
                    </h2>
                </div>
                <p class="text-gray-600">{module.description}</p>
            </a>
        {/each}
    </div>
</div>

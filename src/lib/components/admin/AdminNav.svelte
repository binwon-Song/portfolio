<script lang="ts">
    import { page } from "$app/stores";
    import { getAuthClient } from "$lib/firebase";
    import { signOut } from "firebase/auth";
    import { goto } from "$app/navigation";

    let { logoutHandler } = $props<{ logoutHandler: () => void }>();

    function isActive(path: string) {
        return $page.url.pathname.startsWith(path)
            ? "text-indigo-600 font-bold"
            : "text-gray-600 hover:text-indigo-600 transition-colors";
    }
</script>

<header
    class="bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm border-b border-gray-200"
>
    <nav class="container mx-auto px-6 py-4 max-w-7xl">
        <div
            class="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
            <!-- Brand & Logo -->
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div
                        class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center"
                    >
                        <a
                            href="/"
                            class="flex items-center justify-center w-full h-full"
                        >
                            <i class="bi bi-grid-fill text-white text-sm"></i>
                        </a>
                    </div>
                </div>

                <!-- Logout Button (Mobile only) -->
                <button
                    onclick={logoutHandler}
                    class="md:hidden p-2 text-gray-500 hover:text-red-600 transition-colors"
                    aria-label="Logout"
                >
                    <i class="bi bi-box-arrow-right text-xl"></i>
                </button>
            </div>

            <!-- Navigation Links (Horizontal) -->
            <div
                class="flex items-center justify-center gap-8 overflow-x-auto pb-2 md:pb-0"
            >
                <a
                    href="/admin/posts"
                    class="text-lg font-medium whitespace-nowrap {isActive(
                        '/admin/posts',
                    )}"
                >
                    Posts
                </a>
                <a
                    href="/admin/files"
                    class="text-lg font-medium whitespace-nowrap {isActive(
                        '/admin/files',
                    )}"
                >
                    Files
                </a>
                <a
                    href="/admin/publications"
                    class="text-lg font-medium whitespace-nowrap {isActive(
                        '/admin/publications',
                    )}"
                >
                    Publications
                </a>
                <a
                    href="/admin/projects"
                    class="text-lg font-medium whitespace-nowrap {isActive(
                        '/admin/projects',
                    )}"
                >
                    Projects
                </a>
            </div>

            <!-- Logout Button (Desktop) -->
            <div class="hidden md:block">
                <button
                    onclick={logoutHandler}
                    class="flex items-center gap-2 px-4 py-2 rounded-lg text-lg font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                    <i class="bi bi-box-arrow-right text-lg"></i>
                    Logout
                </button>
            </div>
        </div>
    </nav>
</header>

<script lang="ts">
    let isMenuOpen = false;

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
    }

</script>

<header class="bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
    <nav class="container mx-auto px-6 py-4">
        <div class="flex justify-between items-center">
            <div class="hidden md:flex space-x-8">
                <a href="#home" class="text-gray-600 hover:text-primary transition-colors duration-200">Home</a>
                <a href="#about" class="text-gray-600 hover:text-primary transition-colors duration-200">About</a>
                <a href="#projects" class="text-gray-600 hover:text-primary transition-colors duration-200">Projects</a>
                <a href="#publication" class="text-gray-600 hover:text-primary transition-colors duration-200">Publications</a>
                <a href="./chinese.html" class="text-gray-600 hover:text-primary transition-colors duration-200">CHN Dictionary</a>
            </div>
            <button class="md:hidden text-gray-600" aria-label="Open Menu" on:click={toggleMenu}>
                <i class="fas fa-bars text-xl"></i>
            </button>
        </div>
        {#if isMenuOpen}
            <div class="dropdown md:hidden">
                <ul class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 mb-4 shadow-lg bg-white absolute right-0">
                    <li class="mb-4"><a href="#home" class="text-gray-600 hover:text-primary transition-colors duration-200 block" on:click={toggleMenu}>Home</a></li>
                    <li class="mb-4"><a href="#about" class="text-gray-600 hover:text-primary transition-colors duration-200 block" on:click={toggleMenu}>About</a></li>
                    <li class="mb-4"><a href="#publication" class="text-gray-600 hover:text-primary transition-colors duration-200 block" on:click={toggleMenu}>Publications</a></li>
                    <li class="mb-4"><a href="#projects" class="text-gray-600 hover:text-primary transition-colors duration-200 block" on:click={toggleMenu}>Projects</a></li>
                    <li class="mb-4"><a href="./chinese.html" class="text-gray-600 hover:text-primary transition-colors duration-200 block" on:click={toggleMenu}>CHN Dictionary</a></li>
                </ul>
            </div>
        {/if}
    </nav>
</header>

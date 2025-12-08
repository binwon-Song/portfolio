<script lang="ts">
    // Import image so Vite handles hashing/asset copying correctly
    import profileImage from '../assets/binwon.png';
</script>

<div class="col-span-1 lg:col-span-3 lg:col-start-1 flex flex-col items-start justify-center h-full">
    <div class="flex flex-col md:flex-row items-center md:items-center gap-6 w-full">
        <div class="relative">
            <div class="w-40 h-40 bg-primary/10 rounded-full absolute -top-1 -left-1 hidden md:block">
            </div>
            <img src={profileImage} alt="Binwon Song profile"
                class="w-40 h-40 md:w-64 md:h-64 rounded-full object-cover relative z-10 shadow-xl"
                loading="lazy" />
        </div>
        <div class="flex pl-10 items-start">
            <h1 class="text-4xl md:text-5xl font-bold text-gray-800 mb-4 text-start">Hi, I'm
                <div class="text-green-700">Binwon Song</div>
            </h1>
            <div class="flex space-x-5 gap-10 pt-10 pb-10">
                <a href="https://github.com/binwon-Song" target="_blank" rel="noopener noreferrer"
                    aria-label="GitHub" class="inline-block">
                    <i class="fab fa-github text-3xl md:text-5xl text-gray-700 hover:text-green-700 transition-colors"
                        aria-hidden="true"></i>
                </a>

                <a href="https://www.linkedin.com/in/binwon-Song" target="_blank"
                    rel="noopener noreferrer" aria-label="LinkedIn" class="inline-block ml-3">
                    <i class="fab fa-linkedin text-3xl md:text-5xl text-gray-700 hover:text-green-700 transition-colors"
                        aria-hidden="true"></i>
                </a>
            </div>
        </div>
    </div>
</div>

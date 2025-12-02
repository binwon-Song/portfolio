<script lang="ts">
    import { db } from '$lib/firebase';
    import { collection, addDoc, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
    import { onMount } from 'svelte';
    import "../layout.css";

    
    let publications: any[] = [];
    let projects: any[] = [];

    let newPub = { title: '', conference: '', description: '' };
    let newProj = { title: '', image: '', summary: '', description: '', link: '' };

    onMount(() => {
        const unsubPub = onSnapshot(collection(db, 'publications'), (snapshot) => {
            publications = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        });

        const unsubProj = onSnapshot(collection(db, 'projects'), (snapshot) => {
            projects = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        });

        return () => {
            unsubPub();
            unsubProj();
        };
    });

    async function addPublication() {
        try {
            await addDoc(collection(db, 'publications'), newPub);
            newPub = { title: '', conference: '', description: '' };
            alert('Publication added!');
        } catch (e) {
            console.error("Error adding publication: ", e);
            alert('Error adding publication');
        }
    }

    async function deletePublication(id: string) {
        if (!confirm('Are you sure?')) return;
        try {
            await deleteDoc(doc(db, 'publications', id));
        } catch (e) {
            console.error("Error deleting publication: ", e);
        }
    }

    async function addProject() {
        try {
            await addDoc(collection(db, 'projects'), newProj);
            newProj = { title: '', image: '', summary: '', description: '', link: '' };
            alert('Project added!');
        } catch (e) {
            console.error("Error adding project: ", e);
            alert('Error adding project');
        }
    }

    async function deleteProject(id: string) {
        if (!confirm('Are you sure?')) return;
        try {
            await deleteDoc(doc(db, 'projects', id));
        } catch (e) {
            console.error("Error deleting project: ", e);
        }
    }
</script>

<div class="container mx-auto px-6 py-10">
    <h1 class="text-3xl font-bold mb-8">Admin Dashboard</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
        <!-- Publications Section -->
        <div>
            <h2 class="text-2xl font-semibold mb-4">Manage Publications</h2>
            <div class="bg-white p-6 rounded-lg shadow mb-6">
                <h3 class="text-lg font-medium mb-4">Add New Publication</h3>
                <form on:submit|preventDefault={addPublication} class="space-y-4">
                    <input type="text" placeholder="Title" bind:value={newPub.title} class="w-full border p-2 rounded" required />
                    <input type="text" placeholder="Conference" bind:value={newPub.conference} class="w-full border p-2 rounded" required />
                    <textarea placeholder="Description" bind:value={newPub.description} class="w-full border p-2 rounded" required></textarea>
                    <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Add Publication</button>
                </form>
            </div>

            <div class="space-y-4">
                {#each publications as pub}
                    <div class="bg-white p-4 rounded shadow flex justify-between items-start">
                        <div>
                            <h4 class="font-bold">{pub.title}</h4>
                            <p class="text-sm text-gray-500">{pub.conference}</p>
                        </div>
                        <button on:click={() => deletePublication(pub.id)} class="text-red-500 hover:text-red-700">Delete</button>
                    </div>
                {/each}
            </div>
        </div>

        <!-- Projects Section -->
        <div>
            <h2 class="text-2xl font-semibold mb-4">Manage Projects</h2>
            <div class="bg-white p-6 rounded-lg shadow mb-6">
                <h3 class="text-lg font-medium mb-4">Add New Project</h3>
                <form on:submit|preventDefault={addProject} class="space-y-4">
                    <input type="text" placeholder="Title" bind:value={newProj.title} class="w-full border p-2 rounded" required />
                    <input type="text" placeholder="Image URL" bind:value={newProj.image} class="w-full border p-2 rounded" required />
                    <input type="text" placeholder="Link" bind:value={newProj.link} class="w-full border p-2 rounded" required />
                    <textarea placeholder="Summary" bind:value={newProj.summary} class="w-full border p-2 rounded" required></textarea>
                    <textarea placeholder="Description" bind:value={newProj.description} class="w-full border p-2 rounded" required></textarea>
                    <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Add Project</button>
                </form>
            </div>

            <div class="space-y-4">
                {#each projects as proj}
                    <div class="bg-white p-4 rounded shadow flex justify-between items-start">
                        <div>
                            <h4 class="font-bold">{proj.title}</h4>
                            <p class="text-sm text-gray-500">{proj.summary}</p>
                        </div>
                        <button on:click={() => deleteProject(proj.id)} class="text-red-500 hover:text-red-700">Delete</button>
                    </div>
                {/each}
            </div>
        </div>
    </div>
</div>

<script lang="ts">
    
    import { db, getStorageClient } from '$lib/firebase';
    import { collection, addDoc, deleteDoc, doc, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore';
    import { ref as storageRef, deleteObject } from 'firebase/storage';
    import { onMount } from 'svelte';
    import FileModal from '$lib/components/admin/FileModal.svelte';
    import PubModal from '$lib/components/admin/PubModal.svelte';
    import ProjectModal from '$lib/components/admin/ProjectModal.svelte';
    import "../layout.css";

    
    let publications: any[] = [];
    let projects: any[] = [];
    let navFiles: any[] = [];
    
    // UI state
    let activeTab: 'files' | 'publications' | 'projects' = 'files';
    let showAddFileModal = false;
    let showAddPubModal = false;
    let showAddProjModal = false;

    let newPub = { title: '', conference: '', description: '' };
    let newProj = { title: '', image: '', summary: '', description: '', link: '' };
    // Nav file upload state handled inside FileModal component

    // Editing state for publications
    let editingPubId: string | null = null;
    let editPub = { title: '', conference: '', description: '' };

    // Editing state for projects
    let editingProjId: string | null = null;
    let editProj = { title: '', image: '', summary: '', description: '', link: '' };

  onMount(() => {
        const unsubPub = onSnapshot(collection(db, 'publications'), (snap) => {
            publications = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        });

        const unsubProj = onSnapshot(collection(db, 'projects'), (snap) => {
            projects = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        });

        const unsubNav = onSnapshot(collection(db, 'navFiles'), (snap) => {
            navFiles = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        });

        return () => {
            unsubPub();
            unsubProj();
            unsubNav();
        };
  });

    // Close modals on Escape
    onMount(() => {
        const escHandler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (showAddFileModal) {
                    showAddFileModal = false;
                }
                if (showAddPubModal) {
                    showAddPubModal = false;
                    newPub = { title: '', conference: '', description: '' };
                }
                if (showAddProjModal) {
                    showAddProjModal = false;
                    newProj = { title: '', image: '', summary: '', description: '', link: '' };
                }
            }
        };
        window.addEventListener('keydown', escHandler);
        return () => window.removeEventListener('keydown', escHandler);
    });

    // helper: compute button class for tab buttons
    function tabButtonClass(tab: 'files' | 'publications' | 'projects') {
        return activeTab === tab ? 'px-4 py-2 rounded-md bg-indigo-600 text-white' : 'px-4 py-2 rounded-md bg-white border';
    }

    // File modal and dropzone lifecycle handled inside `FileModal.svelte`

    async function addPublication(data?: { title: string; conference: string; description: string }) {
        const payload = data ?? newPub;
        try {
            await addDoc(collection(db, 'publications'), payload);
            if (!data) newPub = { title: '', conference: '', description: '' };
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

    function startEditPublication(pub: any) {
        editingPubId = pub.id;
        editPub = { title: pub.title || '', conference: pub.conference || '', description: pub.description || '' };
    }

    function cancelEditPublication() {
        editingPubId = null;
        editPub = { title: '', conference: '', description: '' };
    }

    async function saveEditPublication(id: string) {
        try {
            await updateDoc(doc(db, 'publications', id), { title: editPub.title, conference: editPub.conference, description: editPub.description });
            editingPubId = null;
        } catch (e) {
            console.error('Error updating publication:', e);
            alert('Error updating publication');
        }
    }

    async function addProject(data?: { title: string; image?: string; summary?: string; description?: string; link?: string }) {
        const payload = data ?? newProj;
        try {
            await addDoc(collection(db, 'projects'), payload);
            if (!data) newProj = { title: '', image: '', summary: '', description: '', link: '' };
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

    // Nav file upload logic is handled inside `FileModal.svelte`.

    async function deleteNavFile(id: string, storagePath?: string) {
        if (!confirm('Delete nav file?')) return;
        try {
            if (storagePath) {
                const storage = getStorageClient();
                const sRef = storageRef(storage, storagePath);
                await deleteObject(sRef).catch(err => {
                    // log but continue to delete metadata
                    console.warn('Failed to delete storage object', err);
                });
            }
            await deleteDoc(doc(db, 'navFiles', id));
        } catch (e) {
            console.error('Error deleting nav file:', e);
            alert('Error deleting nav file');
        }
    }

    function startEditProject(proj: any) {
        editingProjId = proj.id;
        editProj = { title: proj.title || '', image: proj.image || '', summary: proj.summary || '', description: proj.description || '', link: proj.link || '' };
    }

    function cancelEditProject() {
        editingProjId = null;
        editProj = { title: '', image: '', summary: '', description: '', link: '' };
    }

    async function saveEditProject(id: string) {
        try {
            await updateDoc(doc(db, 'projects', id), { title: editProj.title, image: editProj.image, summary: editProj.summary, description: editProj.description, link: editProj.link });
            editingProjId = null;
        } catch (e) {
            console.error('Error updating project:', e);
            alert('Error updating project');
        }
    }
</script>

<div class="container mx-auto px-6 py-10">
    <h1 class="text-3xl font-bold mb-6">Admin Dashboard</h1>

    <!-- Top selector: Files | Publications | Projects -->
    <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
            <button class={tabButtonClass('files')} on:click={() => activeTab = 'files'}>파일 업로드</button>
            <button class={tabButtonClass('publications')} on:click={() => activeTab = 'publications'}>Publications</button>
            <button class={tabButtonClass('projects')} on:click={() => activeTab = 'projects'}>Projects</button>
        </div>

        <div>
            {#if activeTab === 'files'}
                <button on:click={() => showAddFileModal = true} class="bg-indigo-600 text-white px-4 py-2 rounded">추가 하기</button>
            {:else if activeTab === 'publications'}
                <button on:click={() => showAddPubModal = true} class="bg-indigo-600 text-white px-4 py-2 rounded">추가 하기</button>
            {:else}
                <button on:click={() => showAddProjModal = true} class="bg-indigo-600 text-white px-4 py-2 rounded">추가 하기</button>
            {/if}
        </div>
    </div>

    <!-- Sections (only show selected) -->
    {#if activeTab === 'files'}
    
        <div class="bg-white p-6 rounded-lg shadow mb-6">
            <h2 class="text-2xl font-semibold mb-4">Navbar Files</h2>
            <div class="space-y-4">
                <!-- progress handled inside FileModal -->

                <div>
                    <h3 class="text-lg font-medium mb-2">Existing Navbar Files</h3>
                    <div class="space-y-2">
                        {#each navFiles as nf}
                            <div class="flex items-center justify-between bg-gray-50 p-2 rounded">
                                <div>
                                    <div class="font-medium">{nf.name}</div>
                                    <div class="text-xs text-gray-500">{nf.url}</div>
                                </div>
                                <div class="flex items-center gap-2">
                                    <a href={nf.url} target="_blank" rel="noopener noreferrer" class="text-indigo-600">Open</a>
                                    <button on:click={() => deleteNavFile(nf.id, nf.storagePath)} class="text-red-600">Delete</button>
                                </div>
                            </div>
                        {/each}
                        {#if navFiles.length === 0}
                            <div class="text-sm text-gray-500">No navbar files yet.</div>
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    {/if}

    {#if activeTab === 'publications'}
        <div>
            <h2 class="text-2xl font-semibold mb-4">Manage Publications</h2>
            <div class="space-y-4">
                {#each publications as pub}
                    <div class="bg-white p-4 rounded shadow">
                        {#if editingPubId === pub.id}
                            <form on:submit|preventDefault={() => saveEditPublication(pub.id)} class="space-y-2">
                                <input type="text" bind:value={editPub.title} class="w-full border p-2 rounded" placeholder="Title" required />
                                <input type="text" bind:value={editPub.conference} class="w-full border p-2 rounded" placeholder="Conference" />
                                <textarea bind:value={editPub.description} class="w-full border p-2 rounded" placeholder="Description"></textarea>
                                <div class="flex gap-2">
                                    <button type="submit" class="bg-green-500 text-white px-3 py-1 rounded">Save</button>
                                    <button type="button" on:click={cancelEditPublication} class="bg-gray-300 px-3 py-1 rounded">Cancel</button>
                                </div>
                            </form>
                        {:else}
                            <div class="flex justify-between items-start">
                                <div>
                                    <h4 class="font-bold">{pub.title}</h4>
                                    <p class="text-sm text-gray-500">{pub.conference}</p>
                                </div>
                                <div class="flex items-center gap-2">
                                    <button on:click={() => startEditPublication(pub)} class="text-blue-500 hover:text-blue-700">Edit</button>
                                    <button on:click={() => deletePublication(pub.id)} class="text-red-500 hover:text-red-700">Delete</button>
                                </div>
                            </div>
                        {/if}
                    </div>
                {/each}
            </div>
        </div>
    {/if}

    {#if activeTab === 'projects'}
        <div>
            <h2 class="text-2xl font-semibold mb-4">Manage Projects</h2>
            <div class="space-y-4">
                {#each projects as proj}
                    <div class="bg-white p-4 rounded shadow">
                        {#if editingProjId === proj.id}
                            <form on:submit|preventDefault={() => saveEditProject(proj.id)} class="space-y-2">
                                <input type="text" bind:value={editProj.title} class="w-full border p-2 rounded" placeholder="Title" required />
                                <input type="text" bind:value={editProj.image} class="w-full border p-2 rounded" placeholder="Image URL" />
                                <input type="text" bind:value={editProj.link} class="w-full border p-2 rounded" placeholder="Link" />
                                <input type="text" bind:value={editProj.summary} class="w-full border p-2 rounded" placeholder="Summary" />
                                <textarea bind:value={editProj.description} class="w-full border p-2 rounded" placeholder="Description"></textarea>
                                <div class="flex gap-2">
                                    <button type="submit" class="bg-green-500 text-white px-3 py-1 rounded">Save</button>
                                    <button type="button" on:click={cancelEditProject} class="bg-gray-300 px-3 py-1 rounded">Cancel</button>
                                </div>
                            </form>
                        {:else}
                            <div class="flex justify-between items-start">
                                <div>
                                    <h4 class="font-bold">{proj.title}</h4>
                                    <p class="text-sm text-gray-500">{proj.summary}</p>
                                </div>
                                <div class="flex items-center gap-2">
                                    <button on:click={() => startEditProject(proj)} class="text-blue-500 hover:text-blue-700">Edit</button>
                                    <button on:click={() => deleteProject(proj.id)} class="text-red-500 hover:text-red-700">Delete</button>
                                </div>
                            </div>
                        {/if}
                    </div>
                {/each}
            </div>
        </div>
    {/if}

    <!-- Modals (moved to components) -->
    {#if showAddFileModal}
        <FileModal onClose={() => showAddFileModal = false} onUploaded={(detail) => { /* snapshot listener already refreshes navFiles */ }} />
    {/if}

    {#if showAddPubModal}
        <PubModal on:add={(e) => addPublication(e.detail)} on:close={() => showAddPubModal = false} />
    {/if}

    {#if showAddProjModal}
        <ProjectModal on:add={(e) => addProject(e.detail)} on:close={() => showAddProjModal = false} />
    {/if}

    
</div>

<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  let newProj = { title: '', image: '', summary: '', description: '', link: '' };

  function close() {
    newProj = { title: '', image: '', summary: '', description: '', link: '' };
    dispatch('close');
  }

  function submit() {
    dispatch('add', { ...newProj });
    newProj = { title: '', image: '', summary: '', description: '', link: '' };
    dispatch('close');
  }
</script>

<div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
  <div class="bg-white rounded-lg w-full max-w-xl p-6">
    <h3 class="text-xl font-semibold mb-4">Add Project</h3>
    <form on:submit|preventDefault={submit} class="space-y-4">
      <input type="text" placeholder="Title" bind:value={newProj.title} class="w-full border p-2 rounded" required />
      <input type="text" placeholder="Image URL" bind:value={newProj.image} class="w-full border p-2 rounded" />
      <input type="text" placeholder="Link" bind:value={newProj.link} class="w-full border p-2 rounded" />
      <input type="text" placeholder="Summary" bind:value={newProj.summary} class="w-full border p-2 rounded" />
      <textarea placeholder="Description" bind:value={newProj.description} class="w-full border p-2 rounded"></textarea>
      <div class="flex justify-end gap-2">
        <button type="button" on:click={close} class="px-4 py-2 rounded border">Cancel</button>
        <button type="submit" class="bg-green-500 text-white px-4 py-2 rounded">Add Project</button>
      </div>
    </form>
  </div>
</div>

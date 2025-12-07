<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  let newPub = { title: '', conference: '', description: '' };

  function close() {
    newPub = { title: '', conference: '', description: '' };
    dispatch('close');
  }

  function submit() {
    dispatch('add', { ...newPub });
    newPub = { title: '', conference: '', description: '' };
    dispatch('close');
  }
</script>

<div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
  <div class="bg-white rounded-lg w-full max-w-xl p-6">
    <h3 class="text-xl font-semibold mb-4">Add Publication</h3>
    <form on:submit|preventDefault={submit} class="space-y-4">
      <input type="text" placeholder="Title" bind:value={newPub.title} class="w-full border p-2 rounded" required />
      <input type="text" placeholder="Conference" bind:value={newPub.conference} class="w-full border p-2 rounded" required />
      <textarea placeholder="Description" bind:value={newPub.description} class="w-full border p-2 rounded" required></textarea>
      <div class="flex justify-end gap-2">
        <button type="button" on:click={close} class="px-4 py-2 rounded border">Cancel</button>
        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">Add Publication</button>
      </div>
    </form>
  </div>
</div>

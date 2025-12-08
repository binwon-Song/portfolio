<script lang="ts">
  import type { Publication } from "$lib/types";

  // Callback props
  export let onClose: () => void;
  export let onSave: (publication: Partial<Publication>) => void;
  // 수정 모드일 경우 전달받을 기존 데이터
  export let publication: Publication | undefined = undefined;

  let formData = {
    title: publication?.title || "",
    conference: publication?.conference || "",
    description: publication?.description || "",
  };

  function submit() {
    onSave({ ...formData });
  }
</script>

<div
  class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
>
  <div class="bg-white rounded-lg w-full max-w-xl p-6 shadow-xl">
    <h3 class="text-xl font-semibold mb-4">
      {publication ? "Edit Publication" : "Add Publication"}
    </h3>
    <form on:submit|preventDefault={submit} class="space-y-4">
      <div>
        <label
          for="pub-title"
          class="block text-sm font-medium text-gray-700 mb-1">Title</label
        >
        <input
          id="pub-title"
          type="text"
          placeholder="Paper Title"
          bind:value={formData.title}
          class="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          required
        />
      </div>

      <div>
        <label
          for="conference"
          class="block text-sm font-medium text-gray-700 mb-1">Conference</label
        >
        <input
          id="conference"
          type="text"
          placeholder="Conference Name / Year"
          bind:value={formData.conference}
          class="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          required
        />
      </div>

      <div>
        <label
          for="pub-desc"
          class="block text-sm font-medium text-gray-700 mb-1"
          >Description</label
        >
        <textarea
          id="pub-desc"
          placeholder="Authors, Abstract, or details..."
          bind:value={formData.description}
          class="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none h-32"
          required
        ></textarea>
      </div>

      <div class="flex justify-end gap-2 pt-2">
        <button
          type="button"
          on:click={onClose}
          class="px-4 py-2 rounded border border-gray-300 hover:bg-gray-50 text-gray-700 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
        >
          {publication ? "Save Changes" : "Add Publication"}
        </button>
      </div>
    </form>
  </div>
</div>

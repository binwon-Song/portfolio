<script lang="ts">
  import type { Project } from "$lib/types";

  // Callback props
  export let onClose: () => void;
  // 생성과 수정을 모두 처리하므로 onSave로 이름 변경
  export let onSave: (project: Partial<Project>) => void;
  // 수정 모드일 경우 전달받을 기존 데이터 (없으면 생성 모드)
  export let project: Project | undefined = undefined;

  let formData = {
    title: project?.title || "",
    image: project?.image || "",
    summary: project?.summary || "",
    description: project?.description || "",
    link: project?.link || "",
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
      {project ? "Edit Project" : "Add Project"}
    </h3>
    <form on:submit|preventDefault={submit} class="space-y-4">
      <div>
        <label for="title" class="block text-sm font-medium text-gray-700 mb-1"
          >Title</label
        >
        <input
          id="title"
          type="text"
          placeholder="Project Title"
          bind:value={formData.title}
          class="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          required
        />
      </div>

      <div>
        <label for="image" class="block text-sm font-medium text-gray-700 mb-1"
          >Image URL</label
        >
        <input
          id="image"
          type="text"
          placeholder="https://..."
          bind:value={formData.image}
          class="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
      </div>

      <div>
        <label for="link" class="block text-sm font-medium text-gray-700 mb-1"
          >Link</label
        >
        <input
          id="link"
          type="text"
          placeholder="Project Link"
          bind:value={formData.link}
          class="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
      </div>

      <div>
        <label
          for="summary"
          class="block text-sm font-medium text-gray-700 mb-1">Summary</label
        >
        <input
          id="summary"
          type="text"
          placeholder="Short summary"
          bind:value={formData.summary}
          class="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
      </div>

      <div>
        <label for="desc" class="block text-sm font-medium text-gray-700 mb-1"
          >Description</label
        >
        <textarea
          id="desc"
          placeholder="Detailed description"
          bind:value={formData.description}
          class="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none h-32"
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
          {project ? "Save Changes" : "Add Project"}
        </button>
      </div>
    </form>
  </div>
</div>

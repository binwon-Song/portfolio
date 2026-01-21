<script lang="ts">
  import type { Project, Post } from "$lib/types";
  import { onMount } from "svelte";

  // Callback props
  export let onClose: () => void;
  // 생성과 수정을 모두 처리하므로 onSave로 이름 변경
  export let onSave: (project: Partial<Project>) => void;
  // 수정 모드일 경우 전달받을 기존 데이터 (없으면 생성 모드)
  export let project: Project | undefined = undefined;
  export let posts: Post[] = [];

  let imageSource: "url" | "file" = "url";
  let uploadFile: File | null = null;
  let isUploading = false;
  let uploadError = "";

  let formData = {
    title: project?.title || "",
    image: project?.image || "",
    summary: project?.summary || "",
    description: project?.description || "",
    link: project?.link || "",
    postId: project?.postId || "",
  };

  async function handleFileUpload(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      uploadFile = target.files[0];
      await uploadImage();
    }
  }

  async function uploadImage() {
    if (!uploadFile) return;
    isUploading = true;
    uploadError = "";

    const body = new FormData();
    body.append("file", uploadFile);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body,
      });
      const data = await res.json();
      if (data.success) {
        formData.image = data.url;
      } else {
        uploadError = data.error || "Upload failed";
      }
    } catch (err) {
      uploadError = "Upload error occurred";
    } finally {
      isUploading = false;
    }
  }

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
        <label
          for="imageSource"
          class="block text-sm font-medium text-gray-700 mb-2"
          >Image Source</label
        >
        <div class="flex gap-4 mb-3">
          <label class="inline-flex items-center">
            <input
              type="radio"
              value="url"
              bind:group={imageSource}
              class="text-indigo-600 focus:ring-indigo-500"
            />
            <span class="ml-2 text-sm text-gray-700">URL</span>
          </label>
          <label class="inline-flex items-center">
            <input
              type="radio"
              value="file"
              bind:group={imageSource}
              class="text-indigo-600 focus:ring-indigo-500"
            />
            <span class="ml-2 text-sm text-gray-700">File Upload</span>
          </label>
        </div>

        {#if imageSource === "url"}
          <input
            id="image"
            type="text"
            placeholder="https://..."
            bind:value={formData.image}
            class="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
        {:else}
          <div class="flex flex-col gap-2">
            <input
              type="file"
              accept="image/*"
              on:change={handleFileUpload}
              class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            {#if isUploading}
              <p class="text-xs text-indigo-600 animate-pulse">Uploading...</p>
            {/if}
            {#if uploadError}
              <p class="text-xs text-red-500">{uploadError}</p>
            {/if}
            {#if formData.image}
              <div
                class="mt-2 relative w-24 h-24 border rounded overflow-hidden bg-gray-50"
              >
                <img
                  src={formData.image}
                  alt="Preview"
                  class="w-full h-full object-cover"
                />
              </div>
            {/if}
          </div>
        {/if}
      </div>

      <div>
        <label for="postId" class="block text-sm font-medium text-gray-700 mb-1"
          >Link to Post (Optional)</label
        >
        <select
          id="postId"
          bind:value={formData.postId}
          class="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm"
        >
          <option value="">No link</option>
          {#each posts as p}
            <option value={p.id}>{p.title}</option>
          {/each}
        </select>
      </div>

      <div>
        <label for="link" class="block text-sm font-medium text-gray-700 mb-1"
          >External Link (Optional)</label
        >
        <input
          id="link"
          type="text"
          placeholder="https://..."
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

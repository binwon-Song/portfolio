<script lang="ts">
  import { fade, slide } from "svelte/transition";

  // Callback props
  export let onClose: () => void;
  export let onUploaded: () => void;

  let fileInput: HTMLInputElement;
  let selectedFiles: File[] = [];
  let isDragging = false;
  let isUploading = false;
  let uploadStatus = "";

  function onInputChange(e: Event) {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      handleFiles(Array.from(input.files));
    }
    // 같은 파일을 다시 선택할 수 있도록 input 초기화
    if (fileInput) fileInput.value = "";
  }

  function handleFiles(files: File[]) {
    // 기존 목록에 추가
    selectedFiles = [...selectedFiles, ...files];
  }

  function removeFile(index: number) {
    selectedFiles = selectedFiles.filter((_, i) => i !== index);
  }

  function getFileIcon(fileName: string) {
    if (fileName.match(/\.(jpg|jpeg|png|gif|webp)$/i))
      return "bi-file-earmark-image";
    if (fileName.match(/\.pdf$/i)) return "bi-file-earmark-pdf";
    if (fileName.match(/\.(mp4|mov|avi)$/i)) return "bi-file-earmark-play";
    if (fileName.match(/\.(zip|rar|7z)$/i)) return "bi-file-earmark-zip";
    return "bi-file-earmark-text";
  }

  async function upload() {
    if (selectedFiles.length === 0) return;

    isUploading = true;
    uploadStatus = "Preparing upload...";

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        uploadStatus = `Uploading (${i + 1}/${selectedFiles.length}) ${file.name}...`;

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || `Failed to upload ${file.name}`);
        }
      }

      // 모든 파일 업로드 완료
      uploadStatus = "Done!";
      onUploaded();
      onClose();
    } catch (e: any) {
      console.error(e);
      alert(e.message || "An error occurred during upload");
    } finally {
      isUploading = false;
      uploadStatus = "";
    }
  }

  // Drag & Drop
  function onDragOver(e: DragEvent) {
    e.preventDefault();
    isDragging = true;
  }
  function onDragLeave() {
    isDragging = false;
  }
  function onDrop(e: DragEvent) {
    e.preventDefault();
    isDragging = false;
    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }
</script>

<div
  class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
  transition:fade={{ duration: 200 }}
>
  <div
    class="bg-white rounded-xl w-full max-w-2xl p-6 shadow-2xl relative flex flex-col max-h-[90vh]"
  >
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-xl font-bold text-gray-800">Upload Files</h3>
      <button
        on:click={onClose}
        class="text-gray-400 hover:text-gray-600 transition-colors"
      >
        <i class="bi bi-x-lg text-lg"></i>
      </button>
    </div>

    <div class="flex flex-col md:flex-row gap-6 flex-1 min-h-0">
      <!-- Dropzone Area -->
      <div class="md:w-1/2 flex flex-col gap-2">
        <div
          role="button"
          tabindex="0"
          class="border-2 border-dashed rounded-xl p-6 flex-1 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer min-h-[200px]
                        {isDragging
            ? 'border-indigo-500 bg-indigo-50 scale-[0.98]'
            : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'}"
          on:dragover={onDragOver}
          on:dragleave={onDragLeave}
          on:drop={onDrop}
          on:click={() => fileInput.click()}
          on:keypress={(e: KeyboardEvent) =>
            e.key === "Enter" && fileInput.click()}
        >
          <input
            bind:this={fileInput}
            type="file"
            multiple
            class="hidden"
            on:change={onInputChange}
          />

          <div
            class="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 text-indigo-600"
          >
            <i class="bi bi-cloud-arrow-up-fill text-3xl"></i>
          </div>
          <p class="text-sm font-semibold text-gray-700 text-center">
            Click or Drag files here
          </p>
          <p class="mt-1 text-xs text-gray-400 text-center">
            Supports multiple files
          </p>
        </div>
      </div>

      <!-- File List Area -->
      <div
        class="md:w-1/2 flex flex-col bg-gray-50 rounded-xl border border-gray-100 overflow-hidden"
      >
        <div
          class="p-3 border-b border-gray-200 bg-gray-100/50 flex justify-between items-center"
        >
          <span class="text-xs font-semibold text-gray-500 uppercase"
            >Selected Files ({selectedFiles.length})</span
          >
          {#if selectedFiles.length > 0}
            <button
              on:click={() => (selectedFiles = [])}
              class="text-xs text-red-500 hover:text-red-700 font-medium"
              >Clear All</button
            >
          {/if}
        </div>

        <div class="flex-1 overflow-y-auto p-2 space-y-2 min-h-[200px]">
          {#if selectedFiles.length === 0}
            <div
              class="h-full flex flex-col items-center justify-center text-gray-400 text-sm"
            >
              <i class="bi bi-files text-2xl mb-2 opacity-50"></i>
              <p>No files selected</p>
            </div>
          {:else}
            {#each selectedFiles as file, i}
              <div
                class="bg-white p-3 rounded-lg border border-gray-100 shadow-sm flex items-center gap-3 group"
                transition:slide={{ duration: 200, axis: "y" }}
              >
                <div
                  class="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-500 flex-shrink-0"
                >
                  <i class="bi {getFileIcon(file.name)}"></i>
                </div>
                <div class="flex-1 min-w-0">
                  <div
                    class="text-sm font-medium text-gray-800 truncate"
                    title={file.name}
                  >
                    {file.name}
                  </div>
                  <div class="text-xs text-gray-400">
                    {(file.size / 1024).toFixed(1)} KB
                  </div>
                </div>
                <button
                  on:click={() => removeFile(i)}
                  class="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                  disabled={isUploading}
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            {/each}
          {/if}
        </div>
      </div>
    </div>

    <!-- Footer Actions -->
    <div class="mt-6 flex justify-between items-center">
      <div class="text-sm font-medium text-indigo-600 animate-pulse">
        {uploadStatus}
      </div>
      <div class="flex gap-3">
        <button
          type="button"
          on:click={onClose}
          class="px-5 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium transition-colors"
          disabled={isUploading}
        >
          Cancel
        </button>
        <button
          type="button"
          on:click={upload}
          disabled={selectedFiles.length === 0 || isUploading}
          class="bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm font-medium flex items-center gap-2"
        >
          {#if isUploading}
            <div
              class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
            ></div>
            Uploading...
          {:else}
            Upload {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ""}
          {/if}
        </button>
      </div>
    </div>
  </div>
</div>

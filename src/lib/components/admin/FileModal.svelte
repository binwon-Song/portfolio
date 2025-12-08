<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
  <div class="md:col-span-2">
    <div
      class="border-2 border-dashed rounded-lg p-6 h-64 flex items-center justify-center bg-gray-50
                transition-colors duration-150"
      class:is-dragging={isDragging}
    >
      <div class="text-center">
        <svg
          class="mx-auto w-12 h-12 text-gray-600"
          viewBox="0 0 24 24"
          fill="currentColor"><path d="..." /></svg
        >
        <div
          class="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500"
        >
          <label
            class="relative cursor-pointer rounded-md font-semibold text-indigo-600 hover:text-indigo-500"
          >
            <span>Upload a file</span>
            <input
              bind:this={fileInput}
              type="file"
              accept="image/*"
              class="sr-only"
              on:change={onInputChange}
            />
          </label>
          <div>or drag and drop</div>
        </div>
        <p class="mt-2 text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
      </div>
    </div>
  </div>

  <div class="flex flex-col items-center">
    {#if previewUrl}
      <img
        src={previewUrl}
        alt="preview"
        class="w-48 h-40 object-contain rounded border"
      />
      <button class="mt-3 text-sm text-red-600" on:click={removeFile}
        >Remove</button
      >
    {:else}
      <div
        class="w-48 h-40 flex items-center justify-center bg-white rounded border text-gray-400 text-sm"
      >
        No preview
      </div>
    {/if}

    {#if progress > 0}
      <div class="w-full mt-4">
        <div class="h-2 bg-gray-200 rounded overflow-hidden">
          <div class="h-2 bg-indigo-600" style="width: {progress}%"></div>
        </div>
        <div class="text-xs text-gray-500 mt-1">{progress}%</div>
      </div>
    {/if}

    <div class="mt-6 w-full flex gap-2">
      <button on:click={close} class="flex-1 px-3 py-2 rounded border"
        >Close</button
      >
      <button
        on:click={upload}
        class="flex-1 bg-indigo-600 text-white px-3 py-2 rounded">Upload</button
      >
    </div>
  </div>
</div>

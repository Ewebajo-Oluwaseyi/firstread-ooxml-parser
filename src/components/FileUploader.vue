<template>
  <div class="file-uploader">
    <h2 class="head">Upload OOXML Document</h2>
    <v-card class="upload-area" :class="{ 'drag-over': isDragOver }">
      <div
        class="drop-zone"
        @dragover.prevent="onDragOver"
        @dragleave.prevent="onDragLeave"
        @drop.prevent="onFileDrop"
      >
        <v-icon :size="64">mdi-file-upload-outline</v-icon>
        <p>Drag and drop your document here or</p>
        <v-btn color="primary" @click="triggerFileInput"> Browse Files </v-btn>
        <div class="supported-formats">
          <small>Supported formats: .docx, .xml</small>
        </div>
        <input
          type="file"
          ref="fileInput"
          accept=".docx,.xml"
          style="display: none"
          @change="onFileSelected"
        />
      </div>
    </v-card>

    <div v-if="selectedFile" class="selected-file">
      <p>Selected file: {{ selectedFile.name }}</p>
      <v-chip
        class="mb-2"
        :color="fileTypeColor"
        variant="outlined"
        size="small"
      >
        {{ fileType.toUpperCase() }}
      </v-chip>
      <v-btn color="success" @click="processFile" :loading="isLoading">
        Process Document
      </v-btn>
      <v-btn color="error" variant="text" @click="removeFile" class="mt-2">
        <v-icon>mdi-delete</v-icon>
        Remove
      </v-btn>
    </div>

    <div v-if="errorMessage" class="error-message">
      <p>{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useDocumentStore } from "@/store/index";
import DocumentParserService from "@/services/DocumentParserService";

const router = useRouter();
const documentStore = useDocumentStore();

const fileInput = ref<HTMLInputElement | null>(null);
const selectedFile = ref<File | null>(null);
const isDragOver = ref(false);
const isLoading = ref(false);
const errorMessage = ref("");

const triggerFileInput = (): void => {
  fileInput.value?.click();
};

const onDragOver = (): void => {
  isDragOver.value = true;
};

const onDragLeave = (): void => {
  isDragOver.value = false;
};

const fileType = computed(() => {
  if (!selectedFile.value) return "";
  const filename = selectedFile.value.name;
  if (filename.endsWith(".docx")) return "docx";
  if (filename.endsWith(".xml")) return "xml";
  return "unknown";
});

const fileTypeColor = computed(() => {
  switch (fileType.value) {
    case "docx":
      return "primary";
    case "xml":
      return "success";
    default:
      return "error";
  }
});

const onFileDrop = (event: DragEvent): void => {
  isDragOver.value = false;
  const files = event.dataTransfer?.files;

  if (files && files.length > 0) {
    const file = files[0];
    if (isValidFileType(file.name)) {
      selectedFile.value = file;
      errorMessage.value = "";
    } else {
      errorMessage.value =
        "Please select a valid document file (.docx or .xml).";
    }
  }
};

// Add remove file functionality
const removeFile = (): void => {
  selectedFile.value = null;
  errorMessage.value = "";

  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

const onFileSelected = (event: Event): void => {
  const target = event.target as HTMLInputElement;
  const files = target.files;

  if (files && files.length > 0) {
    const file = files[0];
    if (isValidFileType(file.name)) {
      selectedFile.value = file;
      errorMessage.value = "";
    } else {
      errorMessage.value =
        "Please select a valid document file (.docx or .xml).";
    }
  }
};

const isValidFileType = (filename: string): boolean => {
  return filename.endsWith(".docx") || filename.endsWith(".xml");
};

const processFile = async (): Promise<void> => {
  if (!selectedFile.value) return;

  isLoading.value = true;
  errorMessage.value = "";

  try {
    const parsedDocument = await DocumentParserService.parseDocument(
      selectedFile.value
    );
    documentStore.setDocumentData(parsedDocument);
    router.push({ name: "document", params: { id: Date.now().toString() } });
  } catch (error) {
    errorMessage.value = (error as Error).message;
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.file-uploader {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.head {
  font-size: large;
  margin-bottom: 10px;
  font-weight: bold;
}

.upload-area {
  padding: 2rem;
  border: 2px dashed #ccc;
  border-radius: 8px;
  text-align: center;
  width: 100%;
  max-width: 400px;
  transition: border-color 0.3s ease-in-out;
}

.drag-over {
  border-color: #2196f3;
  background-color: rgba(33, 150, 243, 0.1);
}

.drop-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.selected-file {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f5f5f5;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.supported-formats {
  margin-top: 0.5rem;
  color: #757575;
}

.error-message {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #ffebee;
  color: #d32f2f;
  border-radius: 4px;
}

@media (max-width: 768px) {
  .file-uploader {
    padding: 1rem;
  }

  .upload-area {
    padding: 1.5rem;
    max-width: 100%;
  }

  .selected-file {
    padding: 0.8rem;
  }
}

@media (max-width: 480px) {
  .file-uploader {
    padding: 0.8rem;
  }

  .upload-area {
    padding: 1rem;
    width: 90%;
  }

  .drop-zone p {
    font-size: 0.9rem;
  }

  .selected-file {
    padding: 0.6rem;
  }
}
</style>

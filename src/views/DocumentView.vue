<template>
  <div class="document-page">
    <v-app-bar class="app-bar">
      <v-btn icon @click="goHome">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title class="toolbar-title">
        {{ documentTitle }}
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon @click="toggleFullscreen">
        <v-icon>{{
          isFullscreen ? "mdi-fullscreen-exit" : "mdi-fullscreen"
        }}</v-icon>
      </v-btn>
    </v-app-bar>

    <div class="viewer-container">
      <DocumentViewer :document-data="documentData" :is-loading="isLoading" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useDocumentStore } from "@/store/index";
import DocumentViewer from "@/components/DocumentViewer.vue";

const router = useRouter();
const documentStore = useDocumentStore();

const isFullscreen = ref(false);
const isLoading = ref(false);

const documentData = computed(() => documentStore.documentData);
const documentTitle = computed(
  () => documentData.value?.title || "Document Viewer"
);

const goHome = () => {
  router.push({ name: "home" });
};

const toggleFullscreen = () => {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
    isFullscreen.value = true;
  } else {
    document.exitFullscreen();
    isFullscreen.value = false;
  }
};

onMounted(() => {
  if (!documentData.value) {
    router.push({ name: "home" });
  }
});
</script>

<style scoped>
.document-page {
  display: flex;
  flex-direction: column;
  /* height: 100vh; */
  background-color: #f9f9f9;
}

.app-bar {
  display: flex;
  padding: 0.5rem 1rem;
  align-items: center;
  background-color: white;
  border-bottom: 1px solid #e0e0e0;
}

.toolbar-title {
  font-size: 1.5rem;
  font-weight: 600;
}

.viewer-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  overflow: auto;
}

@media (max-width: 1024px) {
  .toolbar-title {
    font-size: 1.3rem;
  }
  .viewer-container {
    padding: 1.5rem;
  }
}

@media (max-width: 768px) {
  .toolbar-title {
    font-size: 1.1rem;
  }
  .viewer-container {
    padding: 1rem;
  }
}

@media (max-width: 480px) {
  .toolbar-title {
    font-size: 1rem;
    text-align: center;
    width: 100%;
  }
  .viewer-container {
    padding: 0.8rem;
  }
}
</style>

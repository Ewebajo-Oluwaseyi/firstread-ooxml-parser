<template>
  <div class="document-page">
    <v-app-bar>
      <v-btn icon @click="goHome">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>{{ documentTitle }}</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon @click="toggleFullscreen">
        <v-icon>{{
          isFullscreen ? "mdi-fullscreen-exit" : "mdi-fullscreen"
        }}</v-icon>
      </v-btn>
    </v-app-bar>

    <DocumentViewer :document-data="documentData" :is-loading="isLoading" />
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

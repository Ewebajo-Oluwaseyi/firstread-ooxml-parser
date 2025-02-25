<template>
  <div class="document-viewer">
    <div class="document-content" ref="contentContainer">
      <div v-if="isLoading" class="loading-container">
        <loading-indicator />
      </div>

      <div v-else-if="documentContent" v-html="documentContent"></div>

      <div v-else class="empty-state">
        <p>No document loaded. Please upload a document first.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import NavigationDrawer from "./NavigationDrawer.vue";
import LoadingIndicator from "./LoadingIndicator.vue";
import { ParsedDocument } from "@/models/DocumentModels";

const props = defineProps<{
  documentData: ParsedDocument;
  isLoading: boolean;
}>();

const contentContainer = ref<HTMLElement | null>(null);

const documentContent = computed(() => props.documentData.content || "");
const documentStructure = computed(() => props.documentData.structure || []);
const documentTitle = computed(
  () => props.documentData.title || "Untitled Document"
);
const documentType = computed(() => props.documentData.documentType || "docx");

const scrollToSection = (sectionId: string): void => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};
</script>

<style scoped>
.document-viewer {
  /* height: calc(100vh - 64px); */
  /* overflow: hidden; */
}

.navigation-panel {
  height: 100%;
  border-right: 1px solid #e0e0e0;
  overflow-y: auto;
}

.content-panel {
  height: 100%;
  overflow-y: auto;
  padding: 2rem;
}

.document-content {
  /* max-width: 800px;
  margin: 0 auto; */
  margin-top: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #757575;
}

:deep(h1) {
  font-size: 2rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

:deep(h2) {
  font-size: 1.5rem;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

:deep(h3) {
  font-size: 1.25rem;
  margin-top: 1.25rem;
  margin-bottom: 0.5rem;
}

:deep(ol),
:deep(ul) {
  margin-left: 2rem;
}

:deep(p) {
  margin-bottom: 1rem;
  line-height: 1.6;
}
</style>

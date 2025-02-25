<template>
  <div class="home">
    <h1 class="welcome-title">Vue.js and OOXML Processing</h1>
    <p class="welcome-description">
      Implement a user-friendly interface that allows users to upload an OOXML
      file
    </p>

    <FileUploader />
  </div>
</template>

<script setup lang="ts">
import FileUploader from "@/components/FileUploader.vue";
</script>

<style scoped>
.home {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-title {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  text-align: center;
}

.welcome-description {
  font-size: 1.2rem;
  margin-bottom: 3rem;
  text-align: center;
  color: #616161;
}
</style>

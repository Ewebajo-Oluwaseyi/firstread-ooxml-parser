<template>
  <div class="home">
    <h1 class="welcome-title">Vue.js and OOXML Processing</h1>
    <p class="welcome-description">
      A user-friendly interface that allows users to upload an OOXML file
    </p>

    <FileUploader />

    <!-- Footer -->
    <footer class="footer">
      <p>Created by Ewebajo Oluwaseyi</p>
    </footer>
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
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  min-height: 100vh;
}

.footer {
  margin-top: 2rem;
  font-size: 1rem;
  font-weight: bold;
  color: #777;
  text-align: center;
}

.welcome-title {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.welcome-description {
  font-size: 1.2rem;
  margin-bottom: 3rem;
  color: #616161;
}

@media (max-width: 1024px) {
  .home {
    padding: 1.5rem;
  }
  .welcome-title {
    font-size: 2rem;
  }
  .welcome-description {
    font-size: 1rem;
  }
  .footer {
    font-size: 0.9rem;
  }
}

@media (max-width: 768px) {
  .home {
    padding: 1rem;
  }
  .welcome-title {
    font-size: 1.8rem;
  }
  .welcome-description {
    font-size: 0.9rem;
  }
  .footer {
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .home {
    padding: 0.8rem;
  }
  .welcome-title {
    font-size: 1.5rem;
  }
  .welcome-description {
    font-size: 0.85rem;
  }
  .footer {
    font-size: 0.8rem;
  }
}
</style>

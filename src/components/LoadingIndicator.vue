<template>
  <div class="spinner">
    <svg
      :height="height"
      :width="width"
      viewBox="0 0 56 56"
      :style="'color:' + color"
    >
      <g class="g">
        <circle cx="28" cy="28" r="16" class="circle" />
      </g>
    </svg>
  </div>
</template>

<script setup>
defineProps({
  color: {
    type: String,
    default: "#FFFFFF",
  },
  height: {
    type: String,
    default: "1em",
  },
  width: {
    type: String,
    default: "1em",
  },
});
</script>

<style scoped>
.spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
}

.g {
  animation: rotate 1.4s linear infinite;
  transform-origin: center;
}

.circle {
  animation: spin 1.4s ease-in-out infinite;
  fill: none;
  stroke: currentColor;
  stroke-dasharray: 100;
  stroke-dashoffset: 0;
  stroke-linecap: square;
  stroke-width: 4;
  transform-origin: center;
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(270deg);
  }
}
@keyframes spin {
  0% {
    stroke-dashoffset: 100;
  }
  50% {
    stroke-dashoffset: 20;
    transform: rotate(135deg);
  }
  100% {
    stroke-dashoffset: 100;
    transform: rotate(450deg);
  }
}
</style>

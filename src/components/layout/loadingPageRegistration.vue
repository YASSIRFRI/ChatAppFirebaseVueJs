<template>
  <div  class="loading-page">
    <div class="loading-icon">
      <!-- Add your animated loading icon here -->
      <!-- Example: -->
    <i class="bi bi-chat" style=" font-size: 5rem;"></i>

    </div>
    <div class="loading-bar-container">
      <div class="loading-bar" :style="{ width: progress + '%' }"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["progress"]
}
</script>

<style scoped>
.loading-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* Ensure it's on top of other content */
  background-color: rgba(0, 0, 0, 0.7);
}

.loading-icon {
  margin-bottom: 20px;
}

.loading-bar-container {
  width: 300px;
  height: 5px;
  background-color: #cccccc58;
  border-radius: 5px;
  overflow: hidden;
}

.loading-bar {
  height: 100%;
  background-color: white; /* Change color as needed */
  transition: width 0.2s ease; /* Add smooth transition effect */
}


</style>

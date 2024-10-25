<template>
  <div  class="loading-page">
    <div class="loading-icon">
      <!-- Add your animated loading icon here -->
      <!-- Example: -->
    <i class="bi bi-file-earmark-excel-fill" style=" font-size: 5rem;"></i>

    </div>
          <h1>404 - Page Not Found</h1>
          <h5>The requested page does not exist.</h5>
                <b-button @click="this.$router.push('/')" variant="secondary" class="ooopp w-50 mb-2">Back to Home</b-button>


    
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

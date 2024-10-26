<template>
  <b-container class="container">
    <RouterView />
  </b-container>
</template>



<script>
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export default {
  data() {
    return {
      showModal: false
    };
  },
  mounted() {
    // Attach an event listener to the beforeunload event
    //window.addEventListener("beforeunload", this.handleBeforeUnload);
  },
  beforeDestroy() {
    // Remove the event listener when the component is destroyed
    //window.removeEventListener("beforeunload", this.handleBeforeUnload);
  },
  methods: {
    handleBeforeUnload(event) {
      // Prevent the default behavior to show the browser's built-in dialog
    
    },
    handleLeave() {
      // Perform any necessary actions before leaving
      // For example, saving data or cleaning up resources
      // Close the modal
      this.showModal = false;
      // Allow the page to be unloaded
      window.removeEventListener("beforeunload", this.handleBeforeUnload);
    },
    cancelLeave() {
      // Cancel the leave action and close the modal
      this.showModal = false;
    }
  }
};
</script>

<style>
.ooo {
  transition: width 0.5s ease-in-out;
}
.animated {
  transition: width 0.5s ease-in-out;
}

#app {
  color: white;
  width: 100%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Full viewport height */
  width: 100vw;  /* Full viewport width */
  margin: 0;
  background-image: url("./assets/bg.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: rgba(0, 0, 0, 0.5); /* Transparent overlay */
  background-blend-mode: overlay; /* Combines background color with the image */
  border: 1px solid rgba(255, 255, 255, 0.125);
  max-width: none; /* Override the max-width */
}
</style>

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
  margin: 0px;
  height: 100%;
  justify-content: center;
  background-image: url("./assets/bg.jpg");
  border: 1px solid rgba(255, 255, 255, 0.125);
}

</style>

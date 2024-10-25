<template>
  <div class="container1">

    <div class="app-introduction">
    <img src="@/assets/intro.jpg" alt="Chat Icon" class="chat-icon">
    <h2>CS Chat</h2>
    <h4> Chat for Developers
      <i class="fas fa-code" style="color: purple;"></i>
    </h4>
  </div>
  </div>
  
</template>

<script>
export default {
  name: 'AppIntroduction'
};
</script>

<style scoped>


.container1{
  height: 100%; /* Ensures the full height of the viewport */
  margin: 0; /* Removes default margin */
  display: flex; /* Establishes a flex container */
  justify-content: center; /* Centers children horizontally in the flex container */
  align-items: center; /* Centers children vertically in the flex container */
  background: none;
}

.app-introduction {
  border-radius: 12px;
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
  max-width: 350px;
  color: #ffffff;
  text-align: center; /* Centers the text inside the introduction div */
}

.app-introduction h2 {
  font-size: 26px;
  margin-bottom: 15px;
}

.app-introduction p {
  font-size: 18px;
  line-height: 1.4;
}

.chat-icon {
  width: 70%;
  margin-top: 15px;
  filter: drop-shadow(2px 4px 6px black);
  margin-bottom: 30px;
}
</style>


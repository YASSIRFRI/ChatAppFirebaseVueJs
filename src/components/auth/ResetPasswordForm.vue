<template>
  <div class="login-container">

    <b-form class="login-card" @submit.prevent="login">
        <h2>Reset Password</h2>
      <b-form-group label="Email" label-for="email-input" class="w-100">
        
        <b-form-input id="email-input" v-model="email" type="email" required placeholder="Enter your email"></b-form-input>
      </b-form-group>
     
      <b-button type="submit" variant="success" class="ooopp w-100 mb-2">Send</b-button>
        <b-button @click="goToLogin" variant="info" class="ooooo w-100 mb-2">Back to Login</b-button>

    </b-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: ''
    };
  },
  methods: {
    async login() {
      try {
        await auth.signInWithEmailAndPassword(this.email, this.password);
        this.$router.push('/');
      } catch (error) {
        alert(error.message);
      }
    },
    goToSignUp() {
      this.$router.push('/signup');
    },
    goToResetPassword() {
      this.$router.push('/reset-password');
    },goToLogin() {
        this.$router.push('/');
      }
  }
};
</script>

<style scoped>
.op {

  background-color: rgba(149, 10, 71);
  border-color: transparent;

}
.op:hover{

  background-color: rgb(124, 13, 9);

}
.ooooo{
  
  background-color: rgb(251, 149, 9);
  border-color: transparent;
}
.ooopp:hover{
  background-color: rgb(23, 49, 13);


}

.ooooo:hover{
  background-color: rgb(99, 57, 9);

}

.ooopp{
  background-color: rgb(99, 124, 9);

}


.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%

}

.login-card {
   display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column; 
  gap : 10px;
  width: 100%;
  max-width: 360px; /* Max width for the form */
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
}
input{
  
  
  border-radius: 9px;
  backdrop-filter: blur(19px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.125);
}
.btn-block {
  width: 100%;
  margin-bottom: 10px; /* Margin between buttons */
  background-color: rgba(151, 151, 204, 0.342);
}

/* Additional styles for form elements */
b-form-input {
  border-radius: 4px;
}

/* Styling for buttons for better UI consistency */
b-button {
  border-radius: 4px;
}
</style>

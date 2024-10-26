<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <div class="auth-header">
        <i class="fas fa-user-lock fa-3x"></i>
        <h2>Welcome Back</h2>
        <p>Please login to your account</p>
      </div>
      <div class="social-login">
        <b-button variant="outline-danger" class="social-btn">
          <i class="fab fa-google"></i> Login with Google
        </b-button>
        <b-button variant="outline-primary" class="social-btn">
          <i class="fab fa-facebook-f"></i> Login with Facebook
        </b-button>
      </div>

      <div class="divider">
        <span>OR</span>
      </div>
      <b-form @submit.prevent="login" class="auth-form">
        <b-form-group label="Email Address" label-for="email" label-cols="12" label-align-sm="left">
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text"><i class="fas fa-envelope"></i></span>
            </div>
            <b-form-input
              id="email"
              v-model="email"
              type="email"
              required
              placeholder="Enter your email"
              class="form-input"
            ></b-form-input>
          </div>
        </b-form-group>

        <b-form-group label="Password" label-for="password" label-cols="12" label-align-sm="left">
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text"><i class="fas fa-lock"></i></span>
            </div>
            <b-form-input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
              placeholder="Enter your password"
              class="form-input"
            ></b-form-input>
            <div class="input-group-append">
              <span class="input-group-text" @click="togglePasswordVisibility" style="cursor: pointer;">
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </span>
            </div>
          </div>
        </b-form-group>

        <b-form-group class="d-flex justify-content-between align-items-center">
          <b-form-checkbox v-model="rememberMe">Remember Me</b-form-checkbox>
          <b-link @click="goToResetPassword" class="forgot-password">Forgot Password?</b-link>
        </b-form-group>

        <b-button type="submit" variant="primary" class="btn-auth w-100 mb-3">
          <i class="fas fa-sign-in-alt mr-2"></i> Login
        </b-button>
        <b-button @click="goToSignUp" variant="outline-primary" class="btn-auth w-100 mb-2">
          <i class="fas fa-user-plus mr-2"></i> Sign Up
        </b-button>
      </b-form>

      <div class="terms">
        <p>By logging in, you agree to our <b-link href="#">Terms of Service</b-link> and <b-link href="#">Privacy Policy</b-link>.</p>
      </div>
    </div>

    <loadingPage v-if="loading" :progress="progr" />
  </div>
</template>
<script>
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import { auth, firestore } from '@/firebase/Config';
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import {
  doc,
  updateDoc,
} from 'firebase/firestore';
import loadingPage from '@/components/layout/loadingPage.vue';

export default {
  components: { loadingPage },
  data() {
    return {
      email: '',
      password: '',
      rememberMe: false,
      showPassword: false,
      loading: false,
      progr: 0,
    };
  },
  methods: {
    async login() {
      try {
        this.loading = true;
        this.progr = 30;

        await signInWithEmailAndPassword(auth, this.email, this.password);

        const userDocRef = doc(firestore, 'users', auth.currentUser.uid);

        await updateDoc(userDocRef, {
          status: true,
          lastLogin: new Date(),
        });

        this.progr = 100;

        if (this.rememberMe) {
          localStorage.setItem('userEmail', this.email);
        } else {
          localStorage.removeItem('userEmail');
        }

        this.$router.push('/');
        Toastify({
          text: 'Login Successful!',
          duration: 3000,
          close: true,
          gravity: 'top',
          position: 'right',
          backgroundColor: '#28a745',
        }).showToast();
      } catch (error) {
        this.loading = false;
        Toastify({
          text: error.message,
          duration: 3000,
          close: true,
          gravity: 'top',
          position: 'right',
          backgroundColor: '#dc3545',
        }).showToast();
      }
    },
    goToSignUp() {
      this.$router.push('/signup');
    },
    goToResetPassword() {
      this.$router.push('/reset-password');
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
  },
  mounted() {
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
      this.email = savedEmail;
      this.rememberMe = true;
    }
  },
};
</script>
<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

.auth-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.auth-card {
  background-color: #ffffff;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 420px;
  position: relative;
  overflow: hidden;
}

.auth-header {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333333;
}

.auth-header i {
  margin-bottom: 0.5rem;
  color: #007bff;
}

.auth-header h2 {
  font-weight: 700;
  margin-bottom: 0.3rem;
}

.auth-header p {
  font-size: 0.9rem;
  color: #6c757d;
}

.social-login {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.social-btn i {
  margin-right: 0.5rem;
}

.social-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 1.5rem 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #dee2e6;
}

.divider:not(:empty)::before {
  margin-right: 0.5rem;
}

.divider:not(:empty)::after {
  margin-left: 0.5rem;
}

.auth-form .input-group {
  position: relative;
}

.form-input {
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-input:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0,123,255,.25);
}

.btn-auth {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  padding: 0.75rem;
  border-radius: 8px;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.btn-auth i {
  margin-right: 0.5rem;
}

.btn-auth:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.btn-auth:active {
  transform: translateY(0);
  box-shadow: none;
}

.forgot-password {
  color: #007bff;
  transition: color 0.3s ease;
}

.forgot-password:hover {
  color: #0056b3;
  text-decoration: underline;
}

.terms {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.85rem;
  color: #6c757d;
}

.terms a {
  color: #007bff;
  text-decoration: none;
  transition: color 0.3s ease;
}

.terms a:hover {
  color: #0056b3;
  text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 576px) {
  .auth-card {
    padding: 2rem 1.5rem;
  }
}
</style>

<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <div class="auth-header">
        <i class="fas fa-user-plus fa-3x"></i>
        <h2>Join Us</h2>
        <p>Create a new account to get started</p>
      </div>

      <div class="divider">
        <span>OR</span>
      </div>

      <b-form @submit.prevent="register" class="auth-form">
        <div class="profile-picture-upload">
          <label for="profile-picture-input" class="profile-picture-label">
            <img :src="profilePictureUrl || defaultProfilePicture" alt="Profile Picture" class="profile-picture" />
            <span>Upload an image</span>
          </label>
          <input id="profile-picture-input" type="file" @change="onFileChange" accept="image/*" class="form-control-file" style="display:none;">
        </div>

        <b-form-group label="Username" label-for="username-input" label-cols="12" label-align-sm="left">
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text"><i class="fas fa-user"></i></span>
            </div>
            <b-form-input
              id="username-input"
              v-model="username"
              type="text"
              required
              placeholder="Choose a username"
              class="form-input"
            ></b-form-input>
          </div>
        </b-form-group>

        <b-form-group label="Email" label-for="email-input" label-cols="12" label-align-sm="left">
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text"><i class="fas fa-envelope"></i></span>
            </div>
            <b-form-input
              id="email-input"
              v-model="email"
              type="email"
              required
              placeholder="Enter your email"
              class="form-input"
            ></b-form-input>
          </div>
        </b-form-group>
        <b-form-group label="Password" label-for="password-input" label-cols="12" label-align-sm="left">
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text"><i class="fas fa-lock"></i></span>
            </div>
            <b-form-input
              id="password-input"
              v-model="password"
              type="password"
              required
              placeholder="Create a password"
              class="form-input"
            ></b-form-input>
          </div>
        </b-form-group>

        <b-form-group label="Confirm Password" label-for="confirm-password-input" label-cols="12" label-align-sm="left">
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text"><i class="fas fa-lock"></i></span>
            </div>
            <b-form-input
              id="confirm-password-input"
              v-model="confirmPassword"
              type="password"
              required
              placeholder="Confirm your password"
              class="form-input"
            ></b-form-input>
          </div>
        </b-form-group>

        <b-button type="submit" variant="primary" class="btn-auth w-100 mb-3">
          <i class="fas fa-user-plus mr-2"></i> Register
        </b-button>
        <b-button @click="goToLogin" variant="outline-secondary" class="btn-auth w-100 mb-2">
          <i class="fas fa-arrow-left mr-2"></i> Back to Login
        </b-button>
      </b-form>

      <div class="terms">
        <p>By registering, you agree to our <b-link href="#">Terms of Service</b-link> and <b-link href="#">Privacy Policy</b-link>.</p>
      </div>
    </div>

    <loadingPage v-if="loading" :progress="progr" />
  </div>
</template>

<script>
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import { auth, firestore, storage } from '@/firebase/Config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, collection, query, getDocs, where, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import loadingPage from '@/components/layout/loadingPage.vue';

export default {
  components: { loadingPage },
  data() {
    return {
      progr: 0,
      loading: false,
      username: '',
      email: '',
      password: '',
      description: '',
      confirmPassword: '',
      profilePicture: null,
      profilePictureUrl: '',
      defaultProfilePicture: require('../../assets/default_user.png')
    };
  },
  methods: {
    async register() {
    try {
      this.loading = true;
      this.progr = 30;

      // Check password match
      if (this.password !== this.confirmPassword) {
        Toastify({
          text: 'Passwords do not match!',
          duration: 3000,
          close: true,
          gravity: 'top',
          position: 'right',
          backgroundColor: '#dc3545',
        }).showToast();
        this.loading = false;
        return;
      }

      // Create a new user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
      const user = userCredential.user;
      this.progr = 60;

      // Set up profile picture upload
      let profileImageUrl = '';
      if (this.profilePicture) {
        const storageRef = ref(storage, `profileimages/${user.uid}/${this.profilePicture.name}`);
        await uploadBytes(storageRef, this.profilePicture);
        profileImageUrl = await getDownloadURL(storageRef);
      } else {
        profileImageUrl = this.defaultProfilePicture; // Use default profile picture
      }

      // Add user details to Firestore
      const userDocRef = doc(firestore, 'users', user.uid);
      await setDoc(userDocRef, {
        email: this.email,
        username: this.username.trim(),
        description: this.description.trim(),
        profileImageUrl,
        status: true,
        createdat: Timestamp.now(),
        lastLogin: new Date(),
      });
      this.progr = 100;

      // Redirect and show success message
      this.$router.push('/');
      Toastify({
        text: 'Registration Successful!',
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
    } finally {
      this.loading = false;
    }
  },

    goToLogin() {
      this.$router.push('/');
    },
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.profilePicture = file;
        this.profilePictureUrl = URL.createObjectURL(file);
      }
    },
    async fileToBlob(filePath) {
      const response = await fetch(filePath);
      const blob = await response.blob();
      return blob;
    }
  }
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

.profile-picture-upload {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
}

.profile-picture {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ccc;
}

.divider {
  text-align: center;
  margin: 1.5rem 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #dee2e6;
}

.auth-form .input-group-prepend .input-group-text {
  background-color: #e9ecef;
}

.form-input {
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
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

.terms {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.85rem;
  color: #6c757d;
}

.terms a {
  color: #007bff;
}
</style>

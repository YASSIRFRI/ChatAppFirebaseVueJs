<template>
    <div class="login-container">



        
      <b-form class="login-card" @submit.prevent="register">
        
        
    
            <b-form-group class="w-100">
              <label for="profile-picture-input" class="profile-picture-label">
                <img :src="profilePictureUrl || defaultProfilePicture" alt="Profile Picture" class="profile-picture" />
                <span>Upload an image</span>
              </label>
              <input id="profile-picture-input" type="file" @change="onFileChange" accept="image/*" class="form-control-file" style="display:none;">
            </b-form-group>

           

 

        <b-form-group label="Username" label-for="username-input" class="w-100">
          <b-form-input id="username-input" v-model="username" type="text" required placeholder="Choose a username"></b-form-input>
        </b-form-group>
        <b-form-group label="Email" label-for="email-input" class="w-100">
          <b-form-input id="email-input" v-model="email" type="email" class="w-100" required placeholder="Enter your email" ></b-form-input>
        </b-form-group>
        <b-form-group label="Description" label-for="desc-input" class="w-100">
              <textarea style="border-radius:7px" id="desc-input" v-model="description" type="email" class="w-100" required placeholder="Description" ></textarea>
            </b-form-group>
        <b-form-group label="Password" label-for="password-input" class="w-100">
          <b-form-input id="password-input" v-model="password" type="password" required placeholder="Create a password"></b-form-input>
        </b-form-group>
        <b-form-group label="Confirm Password" label-for="confirm-password-input" class="w-100">
          <b-form-input id="confirm-password-input" v-model="confirmPassword" type="password" required placeholder="Confirm your password"></b-form-input>
        </b-form-group>
        
        <b-button type="submit" variant="success" class="ooopp w-100 mb-2">Register</b-button>
        
        <b-button @click="goToLogin" variant="info" class="ooooo w-100 mb-2">Back to Login</b-button>
      </b-form>



    </div>

    <loadingPage v-if="loading" :progress="progr"/>




  </template>
  
<script>
  import Toastify from 'toastify-js';
  import 'toastify-js/src/toastify.css';
  import { auth, firestore, storage } from '@/firebase/Config';
  import { createUserWithEmailAndPassword } from 'firebase/auth';
  import { doc, setDoc ,collection,query,getDocs,getDoc,where,Timestamp} from 'firebase/firestore';
  import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
  import loadingPage from '@/components/layout/loadingPage.vue';



  export default {
    components:{loadingPage},
    data() {
      return {
        progr:0,
        loading:false,
        username: '',
        email: '',
        password: '',
        description:'',
        confirmPassword: '',
        profilePicture: null,
      profilePictureUrl: '',
      defaultProfilePicture: require('../../assets/default_user.png') // Path to your default profile picture
    
      };
    },
    methods: {
      async register() {
        if (this.password !== this.confirmPassword) {
          Toastify({
        text: "Passwords do not match!",
        duration: 3000,
        close: true,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        backgroundColor: "red",
      }).showToast();
          return;
        }

        const minLength = 3;
        const maxLength = 50;
        const regex = /^[a-zA-Z0-9_]+$/;

        if (this.username.length < minLength) {

          const usernameError = `Username must be at least ${minLength} characters long.`;
          Toastify({
          text:usernameError,
          duration: 3000,
          close: true,
          gravity: "bottom", // `top` or `bottom`
          position: "right", // `left`, `center` or `right`
          backgroundColor: "red",
        }).showToast();
        return;

        } else if (this.username.length > maxLength) {

          const usernameError = `Username must be no more than ${maxLength} characters long.`;
          Toastify({
          text:usernameError,
          duration: 3000,
          close: true,
          gravity: "bottom", // `top` or `bottom`
          position: "right", // `left`, `center` or `right`
          backgroundColor: "red",
        }).showToast();
        return;

        } else if (!regex.test(this.username)) {

          const usernameError = 'Username can only contain alphanumeric characters and underscores.';
          Toastify({
          text:usernameError,
          duration: 3000,
          close: true,
          gravity: "bottom", // `top` or `bottom`
          position: "right", // `left`, `center` or `right`
          backgroundColor: "red",
        }).showToast();
        return;

        }

  










        try {
          this.loading = true;
          const q = query(collection(firestore,'users'),where('username','==',this.username.trim()));
          const querySnapshot = await getDocs(q);
          const verifiction = []
          querySnapshot.forEach((doc)=>{
            verifiction.push(doc.id)
          });
          this.progr = 30;

          if (verifiction.length !== 0){
            Toastify({
            text: "this Username is Already used",
            duration: 3000,
            close: true,
            gravity: "bottom", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            backgroundColor: "red",
          }).showToast();

          this.loading = false;

            return;
          }


        const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
        const user = userCredential.user;

        this.progr = 60;



        let profileImageUrl = '';


        if (this.profilePicture) {
          const storageRef = ref(storage, `profileimages/${user.uid}/${this.profilePicture.name}`);
          await uploadBytes(storageRef, this.profilePicture);
          profileImageUrl = await getDownloadURL(storageRef);
        }
        else{
            const defaultProfilePictureBlob = await this.fileToBlob(this.defaultProfilePicture);

          const storageRef = ref(storage, `profileimages/${user.uid}/default_profile.png`);
          await uploadBytes(storageRef, defaultProfilePictureBlob);
          profileImageUrl = await getDownloadURL(storageRef);
          
        }

        this.progr = 80;




        await setDoc(doc(firestore, 'users', user.uid), {
          email: this.email,
          username: this.username.trim(),
          description:this.description.trim(),
          profileImageUrl,
          chats:[],
          invitations:[],
          sentinvitations:[],
          friends:[],
          status:true,
          createdat:Timestamp.now()
        });


        this.progr = 100;







        this.$router.push('/'); // Redirect to homepage or dashboard after registration
        Toastify({
        text: "Successful registration",
        duration: 3000,
        close: true,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        backgroundColor: "green",
      }).showToast();








        } catch (error) {
          this.loading = false;
          Toastify({
        text: error.message,
        duration: 3000,
        close: true,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        backgroundColor: "red",
      }).showToast();
          
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
    async  fileToBlob(filePath){
  const response = await fetch(filePath);
  const blob = await response.blob();
  return blob;
}
    },
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
    width: 100%;
    height:100%
  
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
  input {
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
  .profile-picture-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.profile-picture {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 10px;
  border: 2px solid #ccc;
}
  </style>
  
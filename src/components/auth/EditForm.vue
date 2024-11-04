<template>
  <div v-if="!loading" class="auth-wrapper">
    <div class="auth-card">
      <div class="auth-header">
        <i class="fas fa-user-edit fa-3x"></i>
        <h2>Edit Profile</h2>
        <p>Update your account details below</p>
      </div>

      <b-form @submit.prevent="edit" class="auth-form">
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
              @input="changed=true"
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
              disabled
              required
              placeholder="Enter your email"
              class="form-input"
            ></b-form-input>
          </div>
        </b-form-group>

        <b-form-group label="Description" label-for="desc-input" label-cols="12" label-align-sm="left">
          <textarea
            id="desc-input"
            v-model="description"
            required
            placeholder="Description"
            class="form-control form-input"
            style="border-radius: 7px;"
            @input="textareacchange=true"
          ></textarea>
        </b-form-group>

        <b-button type="submit" variant="primary" class="btn-auth w-100 mb-3">
          <i class="fas fa-save mr-2"></i> Save Changes
        </b-button>
        <b-button :disabled="disabled_but" @click="resetpassword" variant="outline-danger" class="btn-auth w-100 mb-2">
          <i class="fas fa-lock mr-2"></i> Change Password
        </b-button>
      </b-form>
    </div>

    <loadingPage v-if="loadingg" :progress="progr" />
  </div>
</template>
  
  <script>
  import Toastify from 'toastify-js';
  import 'toastify-js/src/toastify.css';
  import { auth, firestore, storage } from '@/firebase/Config';
  import { createUserWithEmailAndPassword ,sendPasswordResetEmail } from 'firebase/auth';
  import { doc, setDoc ,collection,query,getDocs,getDoc,where} from 'firebase/firestore';
  import { ref, uploadBytes, getDownloadURL ,deleteObject} from 'firebase/storage';
  import loadingPage from '@/components/layout/loadingPage.vue';


  export default {
    components:{loadingPage},
    data() {
      return {
        initial:'',
        textareacchange:false,
        textareainitial:'',
        changed:false,
        loadingg:false,
        progr:0,
        disabled_but:false,
        loading:true,
        username: '',
        description:'',
        email: '',
        profilePicture: null,
        profilePictureUrl: '',
        defaultProfilePicture: require('../../assets/default_user.png') // Path to your default profile picture
    
      };
    },
    async created(){
      try{
        const userDocRef = doc(firestore, 'users', auth.currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const da =  userDoc.data();
          this.username = da.username;
          this.initial = da.username;
          this.defaultProfilePicture = da.profileImageUrl;
          this.email = da.email;
          this.description = da.description;
          this.textareainitial = da.description;
          this.loading = false;
          
        } else {
            this.$router.push('/');

           Toastify({
            text: "Something went Wrong",
            duration: 3000,
            close: true,
            gravity: "bottom", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            backgroundColor: "red",
          }).showToast();
          
        } 







      }catch (error){
         Toastify({
            text: error.message,
            duration: 3000,
            close: true,
            gravity: "bottom", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            backgroundColor: "red",
          }).showToast();
          this.$router.push('/');
      }
      


    },
    methods: {
      async edit() {

        if ((!this.textareacchange || this.textareainitial===this.description.trim()) && (!this.changed || this.initial===this.username.trim()) && !this.profilePicture){
          return
        }
     
        this.loadingg = true;



    
        try {

          if (this.changed && this.initial !== this.username.trim()){
          this.loadingg = true;
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

          this.loadingg = false;

            return;
          }

      }
       

        this.progr = 60;



        let profileImageUrl = '';


        if (this.profilePicture) {

          const oldImageRef = ref(storage, this.defaultProfilePicture);
          await deleteObject(oldImageRef);



          const storageRef = ref(storage, `profileimages/${auth.currentUser.uid}/${this.profilePicture.name}`);
          await uploadBytes(storageRef, this.profilePicture);
          profileImageUrl = await getDownloadURL(storageRef);
          this.progr = 80;

          await setDoc(doc(firestore, 'users', auth.currentUser.uid), {
          email: this.email,
          username: this.username,
          description:this.description,
          profileImageUrl
        },{ merge: true });
        }
        else{
          await setDoc(doc(firestore, 'users', auth.currentUser.uid), {
          email: this.email,
          username: this.username.trim(),
          description:this.description.trim(),
        },{ merge: true });
        }
        


        this.progr = 100;




        this.$router.push('/'); // Redirect to homepage or dashboard after registration
        Toastify({
        text: "Profile edited Successfully",
        duration: 3000,
        close: true,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        backgroundColor: "green",
      }).showToast();








        } catch (error) {
          this.loadingg = false;
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
      async resetpassword(){
      try {
        this.disabled_but = true;
        await sendPasswordResetEmail(auth, this.email);

         Toastify({
            text: "An email was sent to your mailbox to reset your password",
            duration: 3000,
            close: true,
            gravity: "bottom", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            backgroundColor: "green",
          }).showToast();
        this.disabled_but = false;



      } catch (error) {
         Toastify({
            text: 'Failed to send password reset email. Please check the email address and try again.',
            duration: 3000,
            close: true,
            gravity: "bottom", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            backgroundColor: "red",
          }).showToast();
        this.disabled_but = false;

      }

    },
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

.auth-form .input-group-prepend .input-group-text {
  background-color: #e9ecef;
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
</style>
  
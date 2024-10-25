<template>
  <div>

    <div class="userinfo d-flex align-items-center justify-content-between pt-3 pb-3">
      
      <div class="user d-flex align-items-center gap-2 flex-grow-1" style="overflow:hidden">
        

        <div class="">
        <b-navbar toggleable="0%" type="white" style="">
          <b-navbar-toggle target="nav-collapse">
            <template #default="{ expanded }">
                <i v-if="!expanded"  class="bi bi-list" style="color:white; font-size: 1.8rem;"></i>

            </template>
          </b-navbar-toggle>

        </b-navbar>
        </div>
          
        <div  class="avatar-container">
          <b-avatar  :src="profileimagelink" size="md"></b-avatar>
          <span v-if="numberofinvitations !== 0" class="number-indicator" @click="this.$router.push('/invitations')">{{numberofinvitations}}</span>
        </div>
        <h5  class="m-0 user-name">{{username}}</h5>
        


      </div>
      
      
      
      

    

    </div>

      <b-collapse id="nav-collapse" is-nav class="items">
        <b-navbar-nav  class="navbar">
          <b-nav-item  class="items"  to="/">Home</b-nav-item>
          <b-nav-item class="items"  to="/profile">Profile</b-nav-item>
          <b-nav-item class="items"  to="/invitations">Invitations</b-nav-item>

          <b-nav-item class="logout items" style="width:100%;text-align:center;border-radius:10px" @click.prevent="showconfirmation=true">Logout</b-nav-item>
        </b-navbar-nav>
      </b-collapse>



  </div>

  
    <!-- Sliding List Modal -->
    <b-modal
      id="logout-confirmation"
      size="lg"
      hide-footer
      hide-header
      v-model="showconfirmation"
      @hidden="showconfirmation = false"
      centered

    >
     <template #modal-title>
        Logout Confirmation
      </template>

      <logoutconfirmation @logout="logout" @close="showconfirmation=false" />
      
      
    </b-modal>

</template>

<script>
import { BAvatar, BDropdown, BDropdownItem } from 'bootstrap-vue-3';
import { signOut } from 'firebase/auth';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';


import { auth, firestore, storage } from '@/firebase/Config';
import { createUserWithEmailAndPassword ,sendPasswordResetEmail } from 'firebase/auth';
import { doc, updateDoc,setDoc ,collection,query,orderBy,getDocs,getDoc,where,limit,onSnapshot,getCountFromServer,arrayRemove,arrayUnion,serverTimestamp ,Timestamp,addDoc} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL ,deleteObject} from 'firebase/storage';
import logoutconfirmation from '@/components/layout/logoutconfirmation.vue';



export default {
  props:['username','profileimagelink'],
  components: {
    BAvatar,
    BDropdown,
    BDropdownItem,
    logoutconfirmation
  },methods:{
    async logout(){

       const UserDocRef = doc(firestore, "users", auth.currentUser.uid);

        await updateDoc(UserDocRef, {
            status: false
        });






      await signOut(auth);






      this.$router.push('/login')
       Toastify({
            text: "Logout Successfully",
            duration: 2000,
            close: true,
            gravity: "bottom", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            backgroundColor: "red",
          }).showToast();
    },
    async fetch(){

      const userDocRef = doc(firestore, 'users', auth.currentUser.uid);

      const o = await onSnapshot(userDocRef,(doc)=>{
         const temp = {...doc.data()};
          this.numberofinvitations = temp.invitations.length;


      })
      
      this.purge.push(o)

    }
  },
  created(){
    this.fetch()
  },
  data(){
    return ({
      numberofinvitations:0,
      purge:[],
      showconfirmation:false
    })
  },
  async beforeUnmount(){
   
    this.purge.forEach(func => func());

  },
};
</script>

<style scoped>



.avatar-container {
  position: relative;
  display: inline-block;
}

.number-indicator {
  cursor:pointer;
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: red;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}
.userinfo {
  border-bottom: 1px solid #dee2e6;
}

.user-name {
  white-space: nowrap; /* Prevent text from wrapping */
  overflow: hidden; /* Hide overflow */
  text-overflow: ellipsis; /* Show ellipsis for overflow text */
}

.icon-style {
  font-size: 1rem; 
  cursor: pointer;
}

/* Adjust padding and gap for smaller screens */
@media (max-width: 576px) {
  .userinfo {
    padding: 0.5rem;
  }

  .user {
    gap: 0.5rem;
  }

  .icons {
    gap: 0.5rem;
  }
}


.items{
  color: antiquewhite;
  --bs-nav-link-color: antiquewhite;
  border-color: #dee2e6;
}
.logout{
  background-color: rgb(188, 23, 23);
  transition: all ease-in 0.2s;

}

.logout:hover{
  background-color: rgb(122, 14, 14);

}

.navbar{
  margin-top: 10px;
}
</style>

<template>
  <div class="chat">

   
    <div class="search">
    <div class="searchbar">
      <b-form-input
      style="w-100"
        v-model="searchQuery"
        type="search"
        placeholder="Search"
        class="search-input"
        @input="performSearch"
      ></b-form-input>


    </div>
        <i v-if="!expanded"  class="bi bi-search" style="color:white; font-size: 1.8rem;"></i>

  </div>

   <div class="iiiiiiiii">


    <div :key="index" v-for="invitation,index in filteredinvitaions" class="item">
        <img v-if="invitation.type === 'discussion'" :src="invitation.friendpic" alt="" />
        <img v-if="invitation.type === 'group'" :src="invitation.groupicon" alt="" />

        <div class="texts" style="overflow:hidden">
           
            <span v-if="invitation.type === 'discussion'" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            {{ invitation.friendusername }}
            </span>
            <p v-if="invitation.type === 'discussion'" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Friend Invitation</p>


            <span v-if="invitation.type === 'group'" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            {{ invitation.groupname }}
            </span>
            <p v-if="invitation.type === 'group'" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Group Invitation</p>

        </div>




        <div style="flex:1;display:flex;justify-content:end;align-items:space-between;gap:50px">
  
            <b-button @click="acceptinvitation(invitation)"  variant="success"  >
                <i class="bi bi-check-lg" style="border-radius:;color:white; font-size: 2rem;"></i>
            </b-button>
             <b-button @click="refuseinvitation(invitation)"  variant="danger"  >
                <i   class="bi bi-x-lg" style="color:white; font-size: 1.8rem;"></i>
            </b-button>
  
  
  </div>


    </div>



    <div class="ooll" v-if="invitations.length === 0">
      <h3 style=" margin: 10px;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 1);">No Invitations Received</h3>

    </div>

     
     

    

    





    
  </div>

 
  </div>

 

   
  

   

  
    <!-- Sliding Detail Modal -->
    <b-modal
      id="detail-modal"
      size="lg"
      hide-footer
      v-model="showDetail"
      @hidden="showDetail = false"
      centered
      class="slide-in"


    >
      <template #modal-title>
        Detail
      </template>
      <detail />
    </b-modal>

    
</template>

<script>
import detail from "@/components/detail/detail.vue"
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import { auth, firestore, storage } from '@/firebase/Config';
import { createUserWithEmailAndPassword ,sendPasswordResetEmail } from 'firebase/auth';
import { doc, updateDoc,setDoc ,collection,query,orderBy,getDocs,getDoc,where,limit,onSnapshot,getCountFromServer,arrayRemove,arrayUnion, Timestamp,addDoc} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL ,deleteObject} from 'firebase/storage';

export default {
  props:['invitations'],
  components:{detail},
  data() {
    return {
      text: "",
      searchQuery:'',
      showDetail: false,
      empty:false

    };
  },
  computed: {
    filteredinvitaions() {
      if (!this.searchQuery) {
        return this.invitations;
      }
      return this.invitations.filter((invitation) => {
        const query = this.searchQuery.toLowerCase();
        if (invitation.type === 'discussion') {
          return invitation.friendusername.toLowerCase().includes(query);
        } else if (invitation.type === 'group') {
          return invitation.groupname.toLowerCase().includes(query);
        }
        return false;
      });
    },
  },methods:{
    async acceptinvitation(invitation){
      if(invitation.type === 'group'){
            const ChatDocRef = doc(firestore, "chats", invitation.id);
            const UserDocRef = doc(firestore, "users", auth.currentUser.uid);

            try{
              await updateDoc(ChatDocRef, {
              sentinvitations: arrayRemove(auth.currentUser.uid)
            });

            await updateDoc(UserDocRef, {
              invitations: arrayRemove({id:invitation.id,type:invitation.type})
            });

            await updateDoc(UserDocRef, {
              chats: arrayUnion(invitation.id)
            });

            await updateDoc(ChatDocRef, {
              senders: arrayUnion(auth.currentUser.uid)
            });


            }catch(error){
                Toastify({
              text: "Something went Wrong",
              duration: 3000,
              close: true,
              gravity: "bottom", // `top` or `bottom`
              position: "right", // `left`, `center` or `right`
              backgroundColor: "red",
            }).showToast();


            }
        //add chatid to user chats
        // remove invitation from chat sent invitations

      }
      else{
          //remove invitation from user invitations
          // create chat and add its id to both user
          // remove invitation from friend sent invitations
          const friendDocRef = doc(firestore, "users", invitation.id);
          const UserDocRef = doc(firestore, "users", auth.currentUser.uid);

            try{
              await updateDoc(friendDocRef, {
              sentinvitations: arrayRemove(auth.currentUser.uid)
            });

            await updateDoc(UserDocRef, {
              invitations: arrayRemove({id:invitation.id,type:invitation.type})
            });

            const chatDocRef = await addDoc(collection(firestore, "chats"),{senders:[invitation.id,auth.currentUser.uid],type:'discussion',createdat:Timestamp.now(),currentId:0});

            await updateDoc(UserDocRef, {
              chats: arrayUnion(chatDocRef.id)
            });

            await updateDoc(friendDocRef, {
              chats: arrayUnion(chatDocRef.id)
            });

            await updateDoc(UserDocRef, {
              friends: arrayUnion(invitation.id)
            });

            await updateDoc(friendDocRef, {
              friends: arrayUnion(auth.currentUser.uid)
            });

           







            }catch(error){
                Toastify({
              text: "Something went Wrong",
              duration: 3000,
              close: true,
              gravity: "bottom", // `top` or `bottom`
              position: "right", // `left`, `center` or `right`
              backgroundColor: "red",
            }).showToast();


            }
















      }



    },
    async refuseinvitation(invitation){
       if(invitation.type === 'group'){
        //remove invitation from user invitations
        // remove invitation from chat sent invitations
          const ChatDocRef = doc(firestore, "chats", invitation.id);
          const UserDocRef = doc(firestore, "users", auth.currentUser.uid);

            try{
              await updateDoc(ChatDocRef, {
              sentinvitations: arrayRemove(auth.currentUser.uid)
            });

            await updateDoc(UserDocRef, {
              invitations: arrayRemove({id:invitation.id,type:invitation.type})
            });

            


            }catch(error){
                Toastify({
              text: "Something went Wrong",
              duration: 3000,
              close: true,
              gravity: "bottom", // `top` or `bottom`
              position: "right", // `left`, `center` or `right`
              backgroundColor: "red",
            }).showToast();


            }

      }
      else{
          //remove invitation from user invitations
          // remove invitation from friend sent invitations
          const friendDocRef = doc(firestore, "users", invitation.id);
          const UserDocRef = doc(firestore, "users", auth.currentUser.uid);

          try{
              await updateDoc(friendDocRef, {
              sentinvitations: arrayRemove(auth.currentUser.uid)
            });

            await updateDoc(UserDocRef, {
              invitations: arrayRemove({id:invitation.id,type:invitation.type})
            });


            }catch(error){
                Toastify({
              text: "Something went Wrong",
              duration: 3000,
              close: true,
              gravity: "bottom", 
              position: "right",
              backgroundColor: "red",
            }).showToast();


            }
          

      }


    }
  }
  
};
</script>

<style scoped>

.iiiiiiiii{
  background-color: hidden;

  flex: 1;
  overflow-y: scroll;
  margin-bottom: 5px;

}


.chat {
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;
  border-left: 1px solid #dddddd35;
  border-right: 1px solid #dddddd35;
}

.ooll{
  gap: 20px;

  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}


.search {
  gap: 20px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 10px;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.searchbar {
  display: flex;
  align-items: center;
  width: 100%;
}

.search-icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}

.search-input {
  flex-grow: 1;
  padding: 10px;
  border: 2px solid #007BFF;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
}

.search-input:focus {
  border-color: #0056b3;
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.5);
}

.add-icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
  cursor: pointer;
}



::-webkit-scrollbar {
  width: 5px; /* Width of the scrollbar */
  

}

::-webkit-scrollbar-track {
  background: transparent; /* Color of the track */
   
}

::-webkit-scrollbar-thumb {
  background-color: transparent; /* Color of the thumb */
  border-radius: 5px; /* Roundness of the thumb */
transition: background-color 0.1s ease; /* Smooth transition */

   
}

.iiiiiiiii:hover::-webkit-scrollbar-thumb {
  background-color: #888; /* Adjust as needed */

}



.search .searchbar{
    background-color: rgba(17, 25, 40, 0.5);
    gap: 20px;
    border-radius: 10px;

}

.search .searchbar input{
    background-color: transparent;
    border: none;
    outline: none;
    color: white;
    flex: 1;
}

.searchbar img{
   width: 20px;
   height: 20px;
}



.item{
    display: flex;
    align-items: center;
    gap: 20px;
    padding: 20px;
    border-bottom: 1px solid #dddddd35;

}

.item img{
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;

}

.texts{
    display: flex;
    flex-direction: column;
    gap: 10px;
    
}

.texts span{
    font-size: 500; 
}

.texts p{
    font-size: 14px;
    font-weight: 300; 
}


</style>

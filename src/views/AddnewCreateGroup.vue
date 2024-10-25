<template>
  <div class="chat">
        <div class="search">
                 <b-button  variant="primary" >
                        <div style="display:flex;gap:20px">
                            <i @click="this.$router.go(-1)" class="bi bi-chevron-left" style="border-radius:;color:white; font-size: 2rem;"></i>
                        </div>
                  </b-button>
            <div class="searchbar">
            <b-form-input
            style="w-100"
                v-model="searchQuery"
                type="search"
                placeholder="Search for a Username"
                class="search-input"
                @input="searchUsers"
            ></b-form-input>
            </div>
                <i  class="bi bi-search" style="color:white; font-size: 1.8rem;"></i>
                <div style="flex:1;display:flex;justify-content:end;gap:20px">
                    <div style="cursor:pointer"   @click="groupformactive=true" >
                        <div style="display:flex;gap:20px;font-weight:bolder">
                            <!--<div style="display:flex;align-items:center;">create group</div>-->
                        <img src="../assets/add-group.png" alt="Profile Picture" class="profile-picturee ppppopppo"/>

                        </div>
                    </div>
        </div>
        </div>
        <div class="iiiiiiiii">
            <div :key="index" v-for="friend,index in searchResults" class="item">
                      <img :src="friend.profileImageUrl" alt="">
                      <div class="texts" style="overflow:hidden">
                          <span style="  white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{friend.username}}</span>
                      </div>
                      <div style="flex:1;display:flex;justify-content:end;align-items:space-between;gap:50px">
                                  <div v-if="user.friends.includes(friend.id)" class="p">
                                      Friend
                                  </div>
                                  <div v-else-if="user.id===friend.id" class="xxp">
                                      You
                                  </div>
                                  <div v-else-if="user.sentinvitations.includes(friend.id)" class="xxp">
                                      Pending
                                  </div>
                                  <div v-else-if="user.invitations.some(invitation => invitation.id === friend.id)" class="xxp">
                                      Invitation Received
                                  </div>
                                   <b-button @click="sendinvitation(friend.id)" v-else  variant="success"  > 
                                      <i class="bi bi-person-plus-fill" style="border-radius:;color:white; font-size: 2rem;"></i>
                                  </b-button>
                      </div>
            </div>
          <div class="ooll" v-if="searchResults.length === 0">
          <h3 style=" margin: 10px;
      padding: 10px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 1);">Empty List</h3>

          </div>

                  
        </div>

 

  </div>


   <!-- Sliding List Modal -->
    <b-modal
      id="list-modal"
      size="lg"
      hide-footer
      v-model="groupformactive"
      @hidden="groupformactive = false"
      centered
      title="Create a New Group"
      class="slide-in"
    >
      <template #modal-title>
        List
      </template>

                <h2 class="mb-4 text-black font-weight-bold">Group Icon</h2>
                <b-form-group class="w-100">
              <label for="profile-picture-input" class="profile-picture-label">
                <img :src="profilePictureUrl || defaultProfilePicture" alt="Profile Picture" class="profile-picture ppppopppo"/>
                <span>Upload an image</span>
              </label>
              <input id="profile-picture-input" type="file" @change="onFileChange" accept="image/*" class="form-control-file " style="display:none;">
            </b-form-group>




                <h2 class="mb-4 text-black font-weight-bold">Group Name</h2>

                   <b-form-input
            style="w-100;text-align:center"
                v-model="groupname"
                type="search"
                placeholder="Group Name"
                class="search-input"
                @input="performSearch"
                    ></b-form-input>




                    <h2 class="mb-4 text-black font-weight-bold">Add Group Member</h2>

                    <div class="input-group mb-3">
                    <b-form-tags
                    ref="ooo"
                        input-id="tags-remove-on-delete"
                        :input-attrs="{ 'aria-describedby': 'tags-remove-on-delete-help' }"
                        v-model="groupMember"
                        :tag-validator="Validate"
                        separator=" "
                        placeholder="Enter new username separated by space"
                        remove-on-delete
                        no-add-on-enter
                        class="search-input "
                        @keyup="handleTagState"
                    ></b-form-tags>
                    </div>
                    <b-form-text id="tags-remove-on-delete-help" class="mx-auto">
                    Press <kbd>Backspace</kbd> to remove the last username entered
                    </b-form-text>




                                      
                    <div class="poownewef">


                      <div :key="index" v-for="friend,index in filteredfriends" class="item">



                          <img :src="friend.profileImageUrl" alt="">
                          <div class="texts" style="overflow:hidden">
                              <span style="  white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{friend.username}}</span>
                          </div>


                  <div style="flex:1;display:flex;justify-content:end;align-items:space-between;gap:50px">
                    
                              <b-button @click="groupMember.push(friend.username);handleTagState({target:{value:''}});searchtag='';" variant="success"  >
                                
                                  <i class="bi bi-plus" style="border-radius:;color:white; font-size: 2rem;"></i>

                              </b-button>
      

                  </div>


                      </div>
 





                    </div>

                    
                    <b-button @click="creategroup"  variant="success"  style="width:100%">
                                  <h2>Create +</h2>
                    </b-button>






            <loadingPage v-if="loading" :progress="progr"/>




    </b-modal>





</template>

<script>
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

import { auth, firestore, storage } from '@/firebase/Config';
import { createUserWithEmailAndPassword ,sendPasswordResetEmail } from 'firebase/auth';
import { doc, updateDoc,setDoc ,collection,query,orderBy,getDocs,getDoc,where,limit,onSnapshot,getCountFromServer,arrayRemove,arrayUnion, Timestamp,addDoc} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL ,deleteObject} from 'firebase/storage';

import loadingPage from '@/components/layout/loadingPage.vue';




export default {
  components:{loadingPage},
  async created(){

    await this.fetch()


  },
  
  data() {
    return {
      filteredfriends:[],
      searchtag:'',
      searchQuery:'',
      searchResults:[],
      text: "",
      showDetail: false,
      empty:false,
      groupformactive:false,
      groupMember:[],
      groupname:"",
        profilePicture: null,
      profilePictureUrl: '',
      defaultProfilePicture: require('../assets/default_group.jpg'), // Path to your default profile picture
      user: {username:'error',profileImageUrl:null,chats:[]},
      all:[],
      loading:false,
      progr:0

    

    };
  },methods:{
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.profilePicture = file;
        this.profilePictureUrl = URL.createObjectURL(file);
      }
    },
    searchUsers() {
      if (this.searchQuery.trim() === '') {
        this.searchResults = [];
        return;
      }
      
      const searchTerm = this.searchQuery.trim();

      try {
        this.searchResults = [];
        
        this.all.forEach((doc) => {
        const userData = doc;
        const username = userData.username.toLowerCase();
       

        if (username.includes(searchTerm.toLowerCase())) {

          this.searchResults.push({ id: doc.id, ...userData });
        }
      });






      } catch (error) {
        Toastify({
                    text: "Error searching users",
                    duration: 3000,
                    close: true,
                    gravity: "bottom", // `top` or `bottom`
                    position: "right", // `left`, `center` or `right`
                    backgroundColor: "red",
                  }).showToast();
      }
    },
     async fetch(){
        const userDocRef = doc(firestore, 'users', auth.currentUser.uid);
        const usersDocRef =  collection(firestore, 'users');
        const querySnapshot = await getDocs(usersDocRef);
        this.all = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));


        onSnapshot(userDocRef, (snapshot) => {

          if (snapshot.exists()) {
          const temp = snapshot.data(); 
          this.user = {...temp,id:auth.currentUser.uid}
           this.filteredfriends = this.all.filter(usert =>this.user.friends.includes(usert.id))

        } else {
           Toastify({
            text: "Something went Wrong",
            duration: 3000,
            close: true,
            gravity: "bottom", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            backgroundColor: "red",
          }).showToast();
          
        }


         })
        

    },
    async sendinvitation(friendid){
      const friendDocRef = doc(firestore, "users", friendid);
      const UserDocRef = doc(firestore, "users", auth.currentUser.uid);

         try{
            await updateDoc(friendDocRef, {
              invitations: arrayUnion({id:auth.currentUser.uid,type:'discussion'})
            });

            await updateDoc(UserDocRef, {
              sentinvitations: arrayUnion(friendid)
            });

            Toastify({
              text: "Invitation Sent Sucessfully",
              duration: 3000,
              close: true,
              gravity: "bottom", // `top` or `bottom`
              position: "right", // `left`, `center` or `right`
              backgroundColor: "green",
            }).showToast();

           
           







            }catch(error){
                Toastify({
              text: "something went wrong",
              duration: 3000,
              close: true,
              gravity: "bottom", // `top` or `bottom`
              position: "right", // `left`, `center` or `right`
              backgroundColor: "red",
            }).showToast();


            }





    },
    async creategroup(){

      if(this.groupMember.length === 0){
        Toastify({
        text: "Choose at least one friend to add to the group",
        duration: 3000,
        close: true,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        backgroundColor: "red",
      }).showToast();
        return;
      }
      if(this.groupname.trim() === ''){
        Toastify({
        text: "Choose a name for the group",
        duration: 3000,
        close: true,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        backgroundColor: "red",
      }).showToast();
        return;
      }
     
      
        
      try {

        this.loading = true
          
        this.progr = 30;

        const members = this.all.filter(user=>[...this.groupMember].includes(user.username));

        const chatDocRef = await addDoc(collection(firestore, "chats"),{senders:[auth.currentUser.uid],type:'group',createdat:Timestamp.now(),groupname:this.groupname,sentinvitations:[],groupicon:'',currentId:0,admin:auth.currentUser.uid});

        this.progr = 50


        const mmemberDocRef = doc(firestore, "users", auth.currentUser.uid);
        await updateDoc(mmemberDocRef, {
                chats: arrayUnion(chatDocRef.id)
       });






        this.progr = 70;



        let profileImageUrl = '';


        if (this.profilePicture) {
          const storageRef = ref(storage, `group/${chatDocRef.id}/${this.profilePicture.name}`);
          await uploadBytes(storageRef, this.profilePicture);
          profileImageUrl = await getDownloadURL(storageRef);
        }
        else{
          const defaultProfilePictureBlob = await this.fileToBlob(this.defaultProfilePicture);

          const storageRef = ref(storage, `group/${chatDocRef.id}/default_group.png`);
          await uploadBytes(storageRef, defaultProfilePictureBlob);
          profileImageUrl = await getDownloadURL(storageRef);
          
        }

        this.progr = 60;




        await setDoc(doc(firestore, "chats",chatDocRef.id), {
          groupicon:profileImageUrl
          
        },{ merge: true });


        

        members.forEach(async (member)=>{
          
            const memberDocRef = doc(firestore, "users", member.id);
            const ChatDocRef = doc(firestore, "chats",chatDocRef.id);

            await updateDoc(memberDocRef, {
                invitations: arrayUnion({id:chatDocRef.id,type:'group'})
              });

            await updateDoc(ChatDocRef, {
              sentinvitations: arrayUnion(member.id)
            });



        })


      


        this.progr = 100;




      this.loading = false
      this.groupformactive = false;

        Toastify({
        text: "group Created",
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



    }
    , handleTagState(event) {

      const temp = event.target.value
      this.searchtag = temp;
     
      if (!temp) {
        console.log([...this.groupMember])
        this.filteredfriends = this.all.filter((usert) =>{
   
          return (this.user.friends.includes(usert.id) && ![...this.groupMember].includes(usert.username))
          
          
          })
      }
      else{
         this.filteredfriends = this.all.filter((user) => {
          const username = user.username.toLowerCase();
          return username.includes(temp.toLowerCase()) && this.user.friends.includes(user.id) &&  ![...this.groupMember].includes(user.username) ;  
      });

      }

    
      
    }
    ,
    Validate(tag){
      const tem = this.all.filter(user=>user.username === tag);
      return (tem.length===1 && this.user.friends.includes(tem[0].id) && ![...this.groupMember].includes(tem[0].username))

    }, 
    async  fileToBlob(filePath){
  const response = await fetch(filePath);
  const blob = await response.blob();
  return blob;
}
  }
};
</script>

<style scoped>
.poownewef{
  max-height: 200px;
  overflow-y: scroll;
}

.poownewef:hover::-webkit-scrollbar-thumb {
  background-color: #888; /* Adjust as needed */

}




 .profile-picture-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
.profile-picturee{
    width: 50px;
  height: 50px;
  object-fit: cover;

}

.iiiiiiiii{
  background-color: hidden;

  flex: 1;
  overflow-y: scroll;
  margin-bottom: 5px;

}

.xxp{
     display: flex;
    align-items: center;
    justify-items: center;
    font-size: 25px;
      gap: 20px;
    background-color:red ;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 1);
    background-color: rgba(74, 92, 127, 0.75);
  backdrop-filter: blur(19px) saturate(180%);

}

.p {
    display: flex;
    align-items: center;
    justify-items: center;
    font-size: 25px;
      gap: 20px;
    background-color:red ;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 1);
    background-color: rgba(15, 53, 129, 0.75);
  backdrop-filter: blur(19px) saturate(180%);

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

.search-input::placeholder {
  color: #999999;
  opacity: 1;
  text-align: center;
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

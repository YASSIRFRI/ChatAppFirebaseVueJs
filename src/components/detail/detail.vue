<template>
    <div v-if="chatdata && chatdata.id" class="container-fluid detail">
      <div class="user text-center mb-3">
        <img :src="chatdata.type === 'discussion' ? chatdata.friend.profileImageUrl : chatdata.groupicon" alt="" class="user-img mb-2" />
        <h2>{{ chatdata.type === 'discussion' ? chatdata.friend.username : chatdata.groupname }}</h2>
        <p v-if="chatdata.type === 'discussion'">{{ chatdata.friend.description }}</p>
      </div>
  
      <div class="info">
  

  
        <!-- Add Member -->
        <b-card no-body v-if="chatdata.admin === uuusers" class="mb-3">
          <b-card-header>
            <div class="d-flex justify-content-between align-items-center">
              <h5 class="mb-0">Add Member</h5>
              <b-button v-b-toggle.detail-add-member variant="link" class="p-0">
                <i class="bi" :class="expanded ? 'bi-chevron-bar-up' : 'bi-chevron-bar-down'"></i>
              </b-button>
            </div>
          </b-card-header>
          <b-collapse id="detail-add-member" is-nav>
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
              class="search-input mb-2"
              @keyup="handleTagState"
            ></b-form-tags>
            <small id="tags-remove-on-delete-help" class="form-text text-muted">
              Press <kbd>Backspace</kbd> to remove the last username entered
            </small>
            <div class="d-flex justify-content-center mt-3">
              <b-button @click="invite" variant="success" class="w-100">Invite +</b-button>
            </div>
          </b-collapse>
        </b-card>
  
        <!-- Shared Photos -->
        <b-card no-body class="mb-3">
          <b-card-header>
            <div class="d-flex justify-content-between align-items-center">
              <h5 class="mb-0">Shared Photos</h5>
              <b-button v-b-toggle.detail-photos variant="link" class="p-0">
                <i class="bi" :class="expanded ? 'bi-chevron-bar-up' : 'bi-chevron-bar-down'"></i>
              </b-button>
            </div>
          </b-card-header>
          <b-collapse id="detail-photos" is-nav>
            <div class="photos">
              <div v-for="(image, index) in filteredimages" :key="index" class="d-flex align-items-center mb-2">
                <img :src="image.content" alt="" class="shared-photo mr-3">
                <span>{{ image.filename }}</span>
                <b-button @click="downloadFile(image.content)" variant="link" class="ml-auto">
                  <i class="bi bi-download"></i>
                </b-button>
              </div>
            </div>
          </b-collapse>
        </b-card>
  
        <!-- Remove User or Quit Group -->
        <b-button v-if="chatdata.type !== 'group'" @click="removefriend" variant="danger" class="w-100 mt-3">
          Remove User
        </b-button>
        <b-button v-if="chatdata.type === 'group'" @click="quitGroup" variant="danger" class="w-100 mt-3">
          Quit Group
        </b-button>
      </div>
    </div>
  
    <loadingPage v-if="loading" :progress="progr" />
  </template>
  

<script>

import { auth, firestore, storage } from '@/firebase/Config';
import { createUserWithEmailAndPassword ,sendPasswordResetEmail } from 'firebase/auth';
import { doc, updateDoc,setDoc ,collection,query,orderBy,getDocs,getDoc,where,limit,onSnapshot,getCountFromServer,arrayRemove,arrayUnion, Timestamp,addDoc,deleteDoc} from 'firebase/firestore';
import { ref, uploadBytes,listAll ,getDownloadURL ,deleteObject} from 'firebase/storage';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import loadingPage from '@/components/layout/loadingPage.vue';



export default {
    props:['data','mess'],
    components:{loadingPage},
    data(){
        return ({
            all:[],
            purge:[],

            user:{},
            filteredfriends:[],
            chatdata:{id:null},
            messages:[],
            loading:false,
            groupMember:[],
            progr:0,
            members:[],
            uuusers:auth.currentUser.uid
        })
    },
    methods:{
        async fetch(){
            if(this.data){
                    if(this.data.id !== null){
                this.chatdata = {...this.data}
                this.messages = this.mess
                this.fetchusers()
                const usersDocRef =  collection(firestore, 'users');
                const querySnapshot = await getDocs(usersDocRef);
                this.all = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                const userDocRef = doc(firestore, 'users', auth.currentUser.uid);

                


          const ChatDocRef = doc(firestore, "chats", this.data.id);

          const purgehere = await onSnapshot(ChatDocRef, async (docSnapshot) => {

          if (docSnapshot.exists()) {
            const chatData = docSnapshot.data();
            chatData.id = docSnapshot.id;


          if (chatData.type === 'discussion'){
                  
              let friend;
              let friendid;
              if (chatData.senders[0] === auth.currentUser.uid){
                  friendid = chatData.senders[1];
              }
              else{
                  friendid = chatData.senders[0];
              }


              const userDocRef = doc(firestore, 'users',friendid);
              const userDoc = await getDoc(userDocRef);

              if (userDoc.exists()) {
                friend = {...userDoc.data(),id:userDoc.id};         
              } else {
                Toastify({
                  text: "Something went Wrong 2 ",
                  duration: 3000,
                  close: true,
                  gravity: "bottom", // `top` or `bottom`
                  position: "right", // `left`, `center` or `right`
                  backgroundColor: "red",
                }).showToast();
            
              }
              
            chatData.friend = friend;
            this.chatdata = chatData;




                            



          }else{
            this.chatdata = chatData;
            this.fetchusers()

          }





          }else{
        
          this.$router.push('/')
          
          
          }
        
          })
            
            










                const o = await onSnapshot(userDocRef, (snapshot) => {

          if (snapshot.exists()) {
          const temp = snapshot.data(); 
          this.user = {...temp,id:auth.currentUser.uid}
           this.filteredfriends = this.all.filter(usert =>this.user.friends.includes(usert.id) && !this.chatdata.senders.includes(usert.id) )

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
        
                this.purge.push(o)
                this.purge.push(purgehere)

                }
            }

        },
        async beforeUnmount(){
    

    this.purge.forEach(func => func());

  },
        async removefriend(){
            try{
                    this.loading = true
                    this.progr = 5
                    const ChatDocRef = doc(firestore, "chats", this.chatdata.id);
                    const messagesCollectionRef = collection(ChatDocRef, 'message');

                    const UserDocRef = doc(firestore, "users", auth.currentUser.uid);
                    const friendDocRef = doc(firestore, "users", this.chatdata.friend.id);

                  



                    await updateDoc(friendDocRef, {
                        friends: arrayRemove(auth.currentUser.uid)
                    });

                     await updateDoc(UserDocRef, {
                        friends: arrayRemove(this.chatdata.friend.id)
                    });

                    await updateDoc(friendDocRef, {
                        chats: arrayRemove(this.chatdata.id)
                    });

                     await updateDoc(UserDocRef, {
                        chats: arrayRemove(this.chatdata.id)
                    });


                    this.progr = 50;



                      if([...this.filteredfiles,...this.filteredimages].length !== 0){


                            const dirRef = ref(storage, `chats/${this.chatdata.id}/`);

                            const listResults = await listAll(dirRef);

                            // Delete all files in the directory
                            const deletePromises = listResults.items.map((itemRef) => deleteObject(itemRef));
                            await Promise.all(deletePromises);
                    
                    
                    }


                    
                    this.progr = 80;
     





                    const subcollectionSnapshot = await getDocs(messagesCollectionRef);

                    const deletePromises = subcollectionSnapshot.docs.map((docSnapshot) => deleteDoc(docSnapshot.ref));
                    await Promise.all(deletePromises);


                    await deleteDoc(ChatDocRef);

                    this.progr = 90;


                    this.$router.push('/')
                    Toastify({
                    text: "Friend Removed from your list",
                    duration: 3000,
                    close: true,
                    gravity: "bottom", // `top` or `bottom`
                    position: "right", // `left`, `center` or `right`
                    backgroundColor: "orange",
                    }).showToast();









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
        ,downloadFile(url) {
       window.open(url, '_blank');
      
    },
    async quitGroup(){
          try{

                    if(this.chatdata.senders.length ===1){
                        this.loading = true
                        this.progr = 20



                        const UserDocRef = doc(firestore, "users", auth.currentUser.uid);

                        await updateDoc(UserDocRef, {
                        chats: arrayRemove(this.chatdata.id)
                        });

                        this.progr = 50;
                        
                      if([...this.filteredfiles,...this.filteredimages].length !== 0){


                            const dirRef = ref(storage, `chats/${this.chatdata.id}/`);

                            const listResults = await listAll(dirRef);

                            // Delete all files in the directory
                            const deletePromises = listResults.items.map((itemRef) => deleteObject(itemRef));
                            await Promise.all(deletePromises);
                    
                    
                    }

                             const ddirRef = ref(storage, `group/${this.chatdata.id}/`);

                            const llistResults = await listAll(ddirRef);

                            // Delete all files in the directory
                            const ddeletePromises = llistResults.items.map((itemRef) => deleteObject(itemRef));
                            await Promise.all(ddeletePromises);
                    
                    
                    
                    



                    
                    this.progr = 80;
     

                    const ChatDocRef = doc(firestore, "chats", this.chatdata.id);
                    const messagesCollectionRef = collection(ChatDocRef, 'message');



                    const subcollectionSnapshot = await getDocs(messagesCollectionRef);

                    const deletePromises = subcollectionSnapshot.docs.map((docSnapshot) => deleteDoc(docSnapshot.ref));
                    await Promise.all(deletePromises);


                    await deleteDoc(ChatDocRef);

                    this.progr = 90;


                    this.$router.push('/')
                    Toastify({
                    text: "Friend Removed from your list",
                    duration: 3000,
                    close: true,
                    gravity: "bottom", // `top` or `bottom`
                    position: "right", // `left`, `center` or `right`
                    backgroundColor: "orange",
                    }).showToast();








                    }
                    else{
                    this.loading = true
                    this.progr = 5
                    const cChatDocRef = doc(firestore, "chats", this.chatdata.id);
                    const mmessagesCollectionRef = collection(cChatDocRef, 'message');
                    const UserDocRef = doc(firestore, "users", auth.currentUser.uid);
                    const ChatDocRef = doc(firestore, "chats", this.chatdata.id);


                    const temp = await getDoc(UserDocRef);
                    const i = temp.data().username



                    const counterDocRef = doc(firestore, 'chats', this.chatdata.id);
                    const q =  await getDoc(counterDocRef);
                    updateDoc(counterDocRef,{
                        currentId:q.data().currentId+1
                    })

                    




                    await addDoc(mmessagesCollectionRef,{
                    author:auth.currentUser.uid,
                    type:'text',
                    senttime:Timestamp.now(),
                    filename:'',
                    content:`${i} has left the Group`,
                    unread:true,
                    readby:[],
                    ID: q.data().currentId
                    });



                    
                    await updateDoc(ChatDocRef, {
                        senders: arrayRemove(auth.currentUser.uid)
                    });

                    await updateDoc(UserDocRef, {
                        chats: arrayRemove(this.chatdata.id)
                    });
                     this.progr = 90;


                    this.$router.push('/')
                    Toastify({
                    text: "Friend Removed from your list",
                    duration: 3000,
                    close: true,
                    gravity: "bottom", // `top` or `bottom`
                    position: "right", // `left`, `center` or `right`
                    backgroundColor: "orange",
                    }).showToast();



                    }
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


    },
    async fetchusers(){
        const mem = [];
        const asyncTasks = this.chatdata.senders.map(async (memberid)=>{

            const userDocRef = doc(firestore, 'users', memberid);
            const temp = await getDoc(userDocRef);
            mem.push({...temp.data(),id:temp.id})
        })
        await Promise.all(asyncTasks);
        this.members = mem
    },
    Validate(tag){
      const tem = this.all.filter(user=>user.username === tag);
      return (tem.length===1 && this.user.friends.includes(tem[0].id) && ![...this.groupMember].includes(tem[0].username) && (!this.chatdata.senders.includes(tem[0].id)))

    }, 
    handleTagState(event) {
      const temp = event.target.value
      this.searchtag = temp;
      if (!temp) {
        console.log([...this.groupMember])
        this.filteredfriends = this.all.filter((usert) =>{
   
          return (this.user.friends.includes(usert.id) && ![...this.groupMember].includes(usert.username)&& !this.chatdata.senders.includes(usert.id))
          })
      }
      else{
         this.filteredfriends = this.all.filter((user) => {
          const username = user.username.toLowerCase();
          return username.includes(temp.toLowerCase()) && this.user.friends.includes(user.id) &&  ![...this.groupMember].includes(user.username) && !this.chatdata.senders.includes(user.id) ;  
      });

      }

    
      
    },
    async invite(){
        const members = this.all.filter(user=>[...this.groupMember].includes(user.username));

        const work = members.map(async (member)=>{
          
            const memberDocRef = doc(firestore, "users", member.id);
            const ChatDocRef = doc(firestore, "chats",this.chatdata.id);

            await updateDoc(memberDocRef, {
                invitations: arrayUnion({id:this.chatdata.id,type:'group'})
              });

            await updateDoc(ChatDocRef, {
              sentinvitations: arrayUnion(member.id)
            });



        })
        

        await Promise.all(work);


        Toastify({
            text: "invitations Sent",
            duration: 3000,
            close: true,
            gravity: "bottom", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            backgroundColor: "green",
          }).showToast();
        
        window.location.reload();

    },
    async removeuser(idd){
        try{

                    
                    this.loading = true
                    this.progr = 5
                    const cChatDocRef = doc(firestore, "chats", this.chatdata.id);
                    const mmessagesCollectionRef = collection(cChatDocRef, 'message');
                    const UserDocRef = doc(firestore, "users", idd);
                    const ChatDocRef = doc(firestore, "chats", this.chatdata.id);


                    const temp = await getDoc(UserDocRef);
                    const i = temp.data().username



                    const counterDocRef = doc(firestore, 'chats', this.chatdata.id);
                    const q =  await getDoc(counterDocRef);
                    updateDoc(counterDocRef,{
                        currentId:q.data().currentId+1
                    })

                    




                    await addDoc(mmessagesCollectionRef,{
                    author:auth.currentUser.uid,
                    type:'text',
                    senttime:Timestamp.now(),
                    filename:'',
                    content:`${i} has been removed from this group`,
                    unread:true,
                    readby:[],
                    ID: q.data().currentId
                    });



                    
                    await updateDoc(ChatDocRef, {
                        senders: arrayRemove(idd)
                    });

                    await updateDoc(UserDocRef, {
                        chats: arrayRemove(this.chatdata.id)
                    });
                     this.progr = 90;
                     this.loading = false



                    Toastify({
                    text: "user Removed from your group",
                    duration: 3000,
                    close: true,
                    gravity: "bottom", // `top` or `bottom`
                    position: "right", // `left`, `center` or `right`
                    backgroundColor: "orange",
                    }).showToast();
                    
                    window.location.reload();




                    


                  








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
    
  watch: {
    'data': {
      handler: 'fetch',
      immediate: true
    },
    'mess':{
        handler:'fetch',
        immediate:true
    }
  },computed:{
    filteredfiles() {
      // Check if data.id is not null and filter messages based on type
      if (this.data.id !== null) {
        // Example filter: Only include messages with type 'image' or 'file'
        return this.messages.filter(message => message.type === 'file');
      }
      return [];
    },
    filteredimages() {
      // Check if data.id is not null and filter messages based on type
      if (this.data.id !== null) {
        // Example filter: Only include messages with type 'image' or 'file'
        return this.messages.filter(message => message.type === 'image' );
      }
      return [];
    },


  }


}
</script>

<style scoped>
.detail {
  padding: 20px;
}

.user {
  padding: 20px;
  border-bottom: 1px solid #ddd;
}

.user-img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
}

.photos {
  max-height: 150px;
  overflow-y: auto;
}

.shared-photo {
  width: 40px;
  height: 40px;
  border-radius: 5px;
  object-fit: cover;
}

.block-button {
  border-radius: 10px;
  transition: background-color 0.2s ease-in;
}

.block-button:hover {
  background-color: rgb(122, 14, 14);
}
</style>

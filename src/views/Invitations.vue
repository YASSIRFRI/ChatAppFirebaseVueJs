<template>

    <b-row class="d-xl-none mb-3">
      
     
       
      <b-row style="display:flex;flex-direction:column">
        

            <b-col v-b-tooltip.hover title="show contacts list" style="cursor:pointer;margin-right:15px;margin-left:20px;margin-top:20px">
                    <i @click="showList = true"  class="bi bi-chat-fill" style=" font-size: 1.8rem;"></i>
            </b-col>


      
        </b-row>
      
      
    </b-row>





    <b-row style="height: 90vh;width:100%">
      <b-col cols="3" class="animated-flex d-none d-xl-block"> 
        <list :chats="chats" :profileimagelink="user.profileImageUrl" :username="user.username" />
      </b-col>
      <b-col cols="12" xl="9" class="ooo">    
        <invitations :invitations="invitations" />
      </b-col>
     
    </b-row>

    <!-- Sliding List Modal -->
    <b-modal
      id="list-modal"
      size="lg"
      hide-footer
      v-model="showList"
      @hidden="resetModal"
      centered
      class="slide-in"
    >
      <template #modal-title>
        List
      </template>
      <listmodal :chats="chats" :profileimagelink="user.profileImageUrl" :username="user.username" />
    </b-modal>

    
 
  
</template>

<script>
import chat from "../components/chat/chat.vue";
import list from "../components/list/list.vue";
import listmodal from "../components/modals/listmodal.vue"
import invitations from "@/components/invitations/invitations.vue"
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';
import { auth, firestore, storage } from '@/firebase/Config';
import { createUserWithEmailAndPassword ,sendPasswordResetEmail } from 'firebase/auth';
import { doc, setDoc ,collection,query,orderBy,getDocs,getDoc,where,limit,onSnapshot,getCountFromServer} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL ,deleteObject} from 'firebase/storage';
import loadingPage from '@/components/layout/loadingPage.vue';


export default {
  components: { chat, list,listmodal,invitations },
  async created(){

    await this.fetch()


  },
  data() {
    return {
      user:{username:'error',profileImageUrl:null,chats:[],invitations:[]},
      chats:[],
      invitations:[],
       listeners:{},
      purge:[],
      loading:true,
      showList: false,
      showDetail: false
    };
  },
  computed: {
    isMediumAndUp() {
      return window.innerWidth >= 768;
    }
  },
  mounted() {
    window.addEventListener("resize", this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
  },
  async beforeUnmount(){
    Object.values(this.listeners).forEach(func => {
  
      func();
  
    });

    this.purge.forEach(func => func());

  },
  methods: {
    handleResize() {
      if (this.isMediumAndUp) {
        this.showList = false;
        this.showDetail = false;
      }
    },
    resetModal() {
      if (this.isMediumAndUp) {
        this.showList = false;
        this.showDetail = false;
      }
    },
      async fetch(){
       const userDocRef = doc(firestore, 'users', auth.currentUser.uid);

        const o = await onSnapshot(userDocRef, (snapshot) => {

          if (snapshot.exists()) {
          const temp = snapshot.data(); 
          this.user.username = temp.username;
          this.user.profileImageUrl = temp.profileImageUrl;
          this.user.chats = temp.chats;
          this.fetchdata(temp)

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
    },
    async fetchdata(user){
      this.invitations = []

      if(user.invitations.length !== 0){

        user.invitations.forEach(async (invitation)=>{
          if (invitation.type === 'group'){
              const invit = {
                ...invitation
              };

              const chatDocRef = doc(firestore, 'chats', invitation.id);
              const chatreceived = await getDoc(chatDocRef);
              const temp = chatreceived.data()
              invit.groupicon  = temp.groupicon;
              invit.groupname = temp.groupname;

              this.invitations.push(invit)


          }
          else{
              const invit = {
                ...invitation
              };
              const userDocRef = doc(firestore, 'users',invitation.id);
              const userDoc = await getDoc(userDocRef);
              const temp = userDoc.data()

              invit.friendpic  = temp.profileImageUrl;
              invit.friendusername = temp.username;

              this.invitations.push(invit)


          }




        })



      }




      
      if (user.chats.length !== 0){

          const chatsQuery = query(collection(firestore, 'chats'), where('__name__', 'in', user.chats));

          const o = await onSnapshot(chatsQuery, (snapshot) => {


            snapshot.docChanges().forEach(async (change) => {
               
                if(change.type === 'added'){
                const DOC = change.doc
                const chat = {
                  id: DOC.id,
                  ...DOC.data()
                }

                let friend;
                let friendid;
                if (chat.senders[0] === auth.currentUser.uid){
                   friendid = chat.senders[1];
                }
                else{
                   friendid = chat.senders[0];
                }
                const chatDocRef = doc(firestore, 'chats', chat.id);
                const messagesCollectionRef = collection(chatDocRef, 'message');
                const messagesQuery = query(messagesCollectionRef, orderBy('ID', 'desc'));

                const p = onSnapshot(messagesQuery, async (snapshot) => {
            

                              const querySnapshot = snapshot;
                              let content;
                              let time;
                              let unreadmessages;

                             



                  

                              if (chat.type === 'discussion'){
                                const unreadMessagesQuery = query(messagesCollectionRef, where('unread', '==', true),where('author','!=',auth.currentUser.uid));
                                const temp = await getCountFromServer(unreadMessagesQuery);
                                unreadmessages = temp.data().count;

                                        const userDocRef = doc(firestore, 'users',friendid);

                                        if(!(friendid in this.listeners)){

                                          const lis =  await onSnapshot(userDocRef,(doc)=>{
                                              this.updatestatus({...doc.data(),id:doc.id});
                                          })

                                          this.listeners[friendid] = lis;

                                        }

                                        const userDoc = await getDoc(userDocRef);



                                            if (userDoc.exists()) {
                                              friend = {...userDoc.data(),id:userDoc.id};          
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

                                      if (!querySnapshot.empty) {
                                      // There is at least one message in the subcollection
                                      const lastMessageDoc = querySnapshot.docs[0];
                                      const lastMessageData = lastMessageDoc.data();
                                      if (lastMessageData.type === 'text'){
                                        content = lastMessageData.content;
                                        time = lastMessageData.senttime;
                                      }
                                      else if(lastMessageData.type === 'image'){
                                        content = 'Image Sent';
                                        time = lastMessageData.senttime;

                                      }
                                      else{
                                        content = 'document Sent';
                                        time = lastMessageData.senttime;

                                      }
                                      
                                    } else {
                                        content = 'Invitation Accepted';
                                        time = chat.createdat;
                                    }


                                      this.updater({...chat,friendusername:friend.username,friendpic:friend.profileImageUrl,content,time,unreadmessages,status:friend.status,friendid:friend.id})
                                        

                              }
                              else{
                                  const unreadMessagesQuery = query(messagesCollectionRef, where('readby', 'array-contains', auth.currentUser.uid),where('author','!=',auth.currentUser.uid));
                                  const allMessagesQuery = query(messagesCollectionRef,where('author','!=',auth.currentUser.uid));

                                  const temp = await getCountFromServer(unreadMessagesQuery);
                                  const temp2 = await getCountFromServer(allMessagesQuery);
                                  unreadmessages = temp2.data().count -  temp.data().count;
                                  console.log(unreadmessages)

                        
                               

                                if (!querySnapshot.empty) {
                                // There is at least one message in the subcollection
                                const lastMessageDoc = querySnapshot.docs[0];
                                const lastMessageData = lastMessageDoc.data();
                                if (lastMessageData.type === 'text'){
                                  content = lastMessageData.content;
                                  time = lastMessageData.senttime;
                                }
                                else if(lastMessageData.type === 'image'){
                                  content = 'Image Sent';
                                  time = lastMessageData.senttime;

                                }
                                else{
                                  content = 'document Sent';
                                  time = lastMessageData.senttime;

                                }
                                
                                } else {
                                  content = 'Invitation Accepted';
                                  time = chat.createdat;
                                }





                                this.updater({...chat,time,content,unreadmessages})
                              }




                })
                this.purge.push(p)}


            });


           })
          this.purge.push(o)
          this.loading = false;

        }
        else{
          this.loading = false;
        }


    }
    ,
    updater(data){
      const index = this.chats.findIndex(obj => obj.id === data.id);

      if(index === -1){
        this.chats.push(data)
      }
      else{
        this.chats[index] = data;
      }
      this.chats = [...this.chats].sort((a, b) => b.time.seconds - a.time.seconds);

        console.log(this.chats)

    },
    updatestatus(data){
      const index = this.chats.findIndex(obj =>obj.type==='discussion' && obj.friendid === data.id);

      if(index !== -1){
        this.chats[index].status = data.status;

      }
      

    }
  }

}
</script>

<style>

</style>
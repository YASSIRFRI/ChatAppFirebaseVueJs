<template>

  <div class="chat">
    
    <div class="top">
      <div class="user">
        <div class="profile-container">
           <img v-if="chatdata.type==='discussion'" :src="chatdata.friend.profileImageUrl" alt="">
        <img v-if="chatdata.type==='group'" :src="chatdata.groupicon" alt="">
        <div v-if="chatdata.type==='discussion'"  :class="{'online-indicator':friendstatus,'offline-indicator':!friendstatus}"></div> <!-- Online status indicator -->
        
      </div>
       

        <div class="texts">
          <span v-if="chatdata.type==='discussion'">{{chatdata.friend.username}}</span>
          <span  v-if="chatdata.type==='group'" >{{chatdata.groupname}}</span>
          <p v-if="chatdata.type==='discussion' && friendstatus">Online</p>
          <p v-if="chatdata.type==='discussion' && !friendstatus">Offline</p>


        </div>

      </div>
      <div class="icons">
        <img @click="showDetail = true" src="../../../public/assets/info.png" alt="info">
      </div>
    </div>


    <div class="center">

      <template :key="index"  v-for="message,index in messages">

      <div v-if="message.type==='image'" :class="{ 'message': message.author!== currentuser, 'message_own': message.author=== currentuser ,'file': false,'photo': true}" >
        
        <img v-if="message.author!== currentuser" :src="message.profileImageUrl" alt="">
        
        <div class="text">
          
          <img  @click="downloadFile(message.content)" style="cursor:pointer"  :src="message.content" alt="">

          <p>{{message.messagecontent}}</p>
          <span @click="downloadFile(message.content)"  style="display:flex;align-items:end;gap:5px" class="time">{{formatTimeAgo(message.senttime)}} <span style="cursor:pointer;display:flex;align-items:end;gap:5px" class="time">Image<img style="height:20px;width:20px;border-radius:0" src="../../assets/download.png" alt=""><br>
</span></span>


        </div>
            
      </div>

      
      <div v-if="message.type==='text'" :class="{ 'message': message.author!== currentuser, 'message_own': message.author=== currentuser ,'file': false,'photo': false}">
        <img v-if="message.author!== currentuser" :src="message.profileImageUrl" alt="">

        <div class="text">
          <pre>{{message.content}}</pre>
                               <span class="time">{{formatTimeAgo(message.senttime)}}</span>

        </div>
      </div>

      
       <div v-if="message.type==='file'" :class="{ 'message': message.author!== currentuser, 'message_own': message.author=== currentuser ,'file': true,'photo': false}">
        <img v-if="message.author!== currentuser" :src="message.profileImageUrl" alt="">
        <div @click="download" style="cursor:pointer" class="text">
          <pre>{{message.filename}}</pre>
                     <span class="time">{{formatTimeAgo(message.senttime)}}</span>

        </div>
          <span @click="downloadFile(message.content)" style="cursor:pointer;display:flex;align-items:end;gap:5px" class="time">File<img style="height:20px;width:20px;border-radius:0" src="../../assets/download.png" alt=""><br>
</span>
      </div>




      </template>

     

      
    
    <div ref="targetscroll"></div>


    </div>

    <FilePreview :files="selectedFiles" @remove-file="removeFile"></FilePreview>

    <div class="bottom">
      
      <div class="icons">

         <label for="image-input" style="cursor:pointer;">
        <i class="bi bi-image" style="cursor:pointer;font-size: 1.6rem;"></i>

        </label>

        <label for="file-input" style="cursor:pointer;">
                  <i class="bi bi-paperclip" style="cursor:pointer;font-size: 1.6rem;"></i>

        </label>


        <input id="file-input" type="file" @change="handleFileChange" multiple hidden>
        <input id="image-input" accept="image/*" type="file" @change="handleFileChange" multiple hidden>

      </div>

      <textarea ref="myInput" v-model="text" type="text" placeholder="Type a message ..."></textarea>

      <div class="emoji">
          <i @click="toggleEmojiPicker" class="bi bi-emoji-smile-fill" style="cursor:pointer;margin-right:10px;font-size: 1.8rem;"></i>
      </div>

        <b-button class="efoiwnefoiwefoiwnef"  @click="send" >
                        <div style="display:flex;gap:20px;font-weight:bolder">

                        <img src="../../assets/send.png" alt="Profile Picture" class="profile-picturee ppppojpppo"/>

                        </div>
        </b-button>



    </div>
  

      <loadingPage v-if="loading" :progress="progr"/>


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
      <detail :data="chatdata" :mess="messages" />
    </b-modal>


</template>

<script>
import { EmojiButton } from '@joeattardi/emoji-button';
import detail from "@/components/detail/detail.vue"
import FilePreview from '../layout/filesPreview.vue';
import loadingPage from '@/components/layout/loadingPage.vue';
import { v4 as uuidv4 } from 'uuid';
import { formatDistanceToNow } from 'date-fns';
import { useSound } from '@vueuse/sound';





import { auth, firestore, storage } from '@/firebase/Config';
import { createUserWithEmailAndPassword ,sendPasswordResetEmail } from 'firebase/auth';
import { runTransaction,doc, updateDoc,setDoc ,collection,query,orderBy,getDocs,getDoc,where,limit,onSnapshot,getCountFromServer,arrayRemove,arrayUnion,serverTimestamp ,Timestamp,addDoc} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL ,deleteObject} from 'firebase/storage';


import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';


export default {
  components:{detail,FilePreview,loadingPage},
  props:['chatid'],
  data() {
    return {
      first:true,
      purgehere:null,
      friendstatus:false,
      friendlistener:null,
      chatdata:{id:null},
      listener:null,
      messages:[],
      currentuser:auth.currentUser.uid,
      text: "",
      picker: new EmojiButton(),
      showDetail: false,
      selectedFiles: [],
      maxFileSize: 10 * 1024 * 1024,
      loading:false,
      progr:0,
      sound:useSound(require('../../assets/sound.mp3'),{ volume: 0.05 })


    };
  },
  async beforeUnmount(){
    if(this.listener !== null){
        await this.listener()
      }
    if(this.friendlistener !== null){
        await this.friendlistener()
      }

  },
  mounted() {

    
    
    const targetElement = this.$refs.targetscroll;

      // Check if the element exists
      if (targetElement) {
        // Scroll to the element
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }


    this.picker.on('emoji', emoji => {
      this.text += emoji.emoji;
    });
  },
  methods: {
    toggleEmojiPicker(event) {
      this.picker.togglePicker(event.target);
    },
    removeFile(index) {
      this.selectedFiles.splice(index, 1);
    },
    async handleFileChange(event) {
      const files = event.target.files;
      

      if (this.selectedFiles.length + files.length > 20){
        this.showToast("too Many files, Maximum number is 20 file")
      }
      else
      {for (let i = 0; i < files.length; i++) {

        const file = files[i];

        if (file.size > this.maxFileSize){
          this.showToast("maximum size allowed is 10 Mb")
        }
        else {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.selectedFiles.push({
            name: file.name,
            type: file.type,
            url: e.target.result,
            file:file
          });
          const targetElement = this.$refs.targetscroll;

      // Check if the element exists
      if (targetElement) {
        // Scroll to the element
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }

        };
        
        reader.readAsDataURL(file);

        }
      }}
    },
    showToast(arg) {
      Toastify({
        text: arg,
        duration: 3000,
        close: true,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        backgroundColor: "red",
      }).showToast();
    },
    ppppppplla(){
      if(!this.first){
        this.sound.play()
      }
    },
    async send(){

     
      /*
      if(this.text.trim()==='' && this.selectedFiles.length === 0){
        return
      }


      const ChatDocRef = doc(firestore, "chats", this.chatdata.id);
      const messagesCollectionRef = collection(ChatDocRef, 'message');

      if(this.selectedFiles.length === 0){

            await addDoc(messagesCollectionRef,{
            author:auth.currentUser.uid,
            type:'text',
            senttime:Timestamp.now(),
            filename:'',
            content:this.text,
            unread:true,
            readby:[]
            });

          this.text = '';

          this.scrolllll()
          
          
      }else{ 




    this.loading = true
    const promises = this.selectedFiles.map(async (file) => {
    const type = file.type.split('/')[0];
    const uniqueName = `${Date.now()}_${uuidv4()}_${file.name}`;
    const storageRef = ref(storage, `chats/${this.chatdata.id}/${uniqueName}`);
    await uploadBytes(storageRef, file.file);
    const profileImageUrl = await getDownloadURL(storageRef);
    const messageType = type === 'image' ? 'image' : 'file';

    await addDoc(messagesCollectionRef, {
      author: auth.currentUser.uid,
      type: messageType,
      senttime:Timestamp.now(),
      filename: file.name,
      content: profileImageUrl,
      unread: true,
      messagecontent: this.text,
      readby:[]

    });
    this.progr += parseInt(100/this.selectedFiles.length)
  });

        // Wait for all promises to resolve
        await Promise.all(promises);
          this.text = '';
        this.loading = false
        this.progr = 100;
        this.selectedFiles = [];


          if (this.$refs.myInput) {
              this.$refs.myInput.focus();
          } 
       
          this.scrolllll()
          
          



      }*/


      
      if(this.text.trim()==='' && this.selectedFiles.length === 0){
        return
      }

      const ID = await this.getnextid()


      const ChatDocRef = doc(firestore, "chats", this.chatdata.id);
      const messagesCollectionRef = collection(ChatDocRef, 'message');

      if(this.selectedFiles.length === 0){

            await addDoc(messagesCollectionRef,{
            author:auth.currentUser.uid,
            type:'text',
            senttime:Timestamp.now(),
            filename:'',
            content:this.text,
            unread:true,
            readby:[],
            ID:ID
            });

          this.text = '';

          this.scrolllll()
          
          
      }else{ 




    this.loading = true
    const promises = this.selectedFiles.map(async (file) => {
    const type = file.type.split('/')[0];
    const uniqueName = `${Date.now()}_${uuidv4()}_${file.name}`;
    const storageRef = ref(storage, `chats/${this.chatdata.id}/${uniqueName}`);
    await uploadBytes(storageRef, file.file);
    const profileImageUrl = await getDownloadURL(storageRef);
    const messageType = type === 'image' ? 'image' : 'file';

    await addDoc(messagesCollectionRef, {
      author: auth.currentUser.uid,
      type: messageType,
      senttime:Timestamp.now(),
      filename: file.name,
      content: profileImageUrl,
      unread: true,
      messagecontent: this.text,
      readby:[],
      ID:ID


    });
    this.progr += parseInt(100/this.selectedFiles.length)
  });

        // Wait for all promises to resolve
        await Promise.all(promises);
          this.text = '';
        this.loading = false
        this.progr = 100;
        this.selectedFiles = [];


          if (this.$refs.myInput) {
              this.$refs.myInput.focus();
          } 
       
          this.scrolllll()
          
          



      }


      
      




    },
    async getNextId() {
    const counterDocRef = doc(firestore, 'chats', this.chatdata.id);

    try {
      const newId = await runTransaction(firestore, async (transaction) => {
      const counterDoc = await transaction.get(counterDocRef);

      if (!counterDoc.exists()) {
        return null
      }

      const currentId = counterDoc.data().currentId;
      const newId = currentId + 1;
      this.text = newId

      transaction.update(counterDocRef, { currentId: newId });

      return newId;
    });

    return newId;
  } catch (e) {
    return null
  }
    },
    async getnextid(){
      const counterDocRef = doc(firestore, 'chats', this.chatdata.id);
       const q =  await getDoc(counterDocRef);
       updateDoc(counterDocRef,{
        currentId:q.data().currentId+1
       })

       return q.data().currentId
      
    },
    scrolllll(){
      const targetElement = this.$refs.targetscroll;

      // Check if the element exists
      if (targetElement) {
        // Scroll to the element
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }

    },
    downloadFile(url) {
       window.open(url, '_blank');
      
    },
    formatTimeAgo(timestamp) {
        const sentTime = new Date(timestamp.seconds * 1000); // Convert seconds to milliseconds
        return formatDistanceToNow(sentTime, { addSuffix: true });// Using dayjs library to format "time ago"
    },
    async fetchmessages(){
      if(this.listener !== null){
        await this.listener()
      }
      

      this.messages = []
        
        if (this.chatdata.id !== null){
      
                    
                const ChatDocRef = doc(firestore, "chats", this.chatdata.id);
                const messagesCollectionRef = collection(ChatDocRef, 'message');
                const messagesQuery = query(messagesCollectionRef, orderBy('ID', 'asc'));


                try{
                  
                this.listener = await onSnapshot(messagesQuery, async (snapshot) => {
                        
                        const newMessages = [];
                       



                          // Collect all asynchronous tasks
                          const asyncTasks = snapshot.docChanges().map(async change => {

                              if (change.type === "added") {
                                 

                                  const message = change.doc.data();
                                  message.id = change.doc.id;
                                if(message.senttime !== null){
                                        if (message.author !== auth.currentUser.uid) {
                                          this.ppppppplla()
                                            const userDocRef = doc(firestore, 'users', message.author);
                                            const userDoc = await getDoc(userDocRef);
                                            const temp = {...userDoc.data()};
                                            // if you have read this comment that mean you have spent a lot of time reading this code, go rest some time, by bourich and oussama **

                                            message.profileImageUrl = temp.profileImageUrl;
                                        }

                                        if(this.chatdata.type == 'group'){

                                          if(message.author !== auth.currentUser.uid){
                                           
                                            if(message.readby && !message.readby.includes(auth.currentUser.uid)){
                                                  
                                          const ooooo = doc(firestore, "chats", this.chatdata.id);
                                          const pmoinoanc = collection(ooooo, 'message');
                                          const pppppp = doc(pmoinoanc,message.id);
                                          
                                          await updateDoc(pppppp, {
                                            readby: arrayUnion(auth.currentUser.uid)
                                          });


                                            }
                                        

                                          }




                                        }
                                        else{

                                          if(message.author !== auth.currentUser.uid){

                                          const oooooo = doc(firestore, "chats", this.chatdata.id);
                                          const ooounin = collection(oooooo, 'message');
                                          const ienoeunfwf = doc(ooounin,message.id);
                                        

                                          
                                          await updateDoc(ienoeunfwf, {
                                            unread:false
                                          });

                                          }



                                        }
                                        newMessages.push(message);
                                  }
                              }

                          });

                  // Wait for all asynchronous tasks to complete
                  await Promise.all(asyncTasks);

                  // Append new messages to the existing messages array
                  this.messages = [...this.messages, ...newMessages];

                  // Sort the messages based on senttime
                  this.messages = [...this.messages].sort((a, b) => a.ID - b.ID);
                  this.first = false

                  
                  if(this.purgehere){
                                      this.purgehere()
                  }


                  // Scroll to the latest message
                  this.$nextTick(() => {
                      this.scrolllll();

                      if (this.$refs.myInput) {
                          this.$refs.myInput.focus();
                      } 
       
                  });

                      

                    });
                

                }catch(error){
                    Toastify({
                        text: "Something went Wrong 1",
                        duration: 3000,
                        close: true,
                        gravity: "bottom", // `top` or `bottom`
                        position: "right", // `left`, `center` or `right`
                        backgroundColor: "red",
                      }).showToast();
                  this.$router.push('/');


                }





}

    },
    async fetchchat(){
      this.loading = true
      this.first = true


      if(this.chatid){

        try{

          const Check = doc(firestore, "users", auth.currentUser.uid);
          const tt = await getDoc(Check)

          if(!(tt.data().chats.includes(this.chatid))){
            this.$router.push('/errorpage')
            return
          }

          




          const ChatDocRef = doc(firestore, "chats", this.chatid);
          this.purgehere = await onSnapshot(ChatDocRef, async (docSnapshot) => {

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
            if(this.friendlistener !== null){
                await this.friendlistener()
            }
            this.assignuserlistener()
            
            this.listener = this.fetchmessages()
            this.progr = 60

            this.loading = false



                            



          }else{
            this.chatdata = chatData;
            this.listener = this.fetchmessages()
            this.progr = 60

            this.loading = false
          }






          }else{
        
          this.$router.push('/')
          
          
          }
        
          })
            
            




        }
        catch(error){
          Toastify({
                  text: "Something went Wrong 4",
                  duration: 3000,
                  close: true,
                  gravity: "bottom", // `top` or `bottom`
                  position: "right", // `left`, `center` or `right`
                  backgroundColor: "red",
                }).showToast();
            this.$router.push('/');
        }

      }


            


    },
    async assignuserlistener(){
      const friendDocRef = doc(firestore, "users", this.chatdata.friend.id);
      this.friendlistener = await onSnapshot(friendDocRef,(doc)=>{
        const temp = doc.data();
        this.friendstatus = temp.status
      })

    }
  },
  watch: {
    'chatid': {
      handler: 'fetchchat',
      immediate: true
    },
    
  }
    
  
};

</script>

<style scoped>
.efoiwnefoiwefoiwnef{
  background-color: red;
  background-color:transparent;border-color:transparent

}
.efoiwnefoiwefoiwnef:hover{
  background-color: rgb(24, 212, 125);

}
.profile-container {
    position: relative;
    display: inline-block;
}
.online-indicator {
    position: absolute;
    bottom: 0;
    left: 80%;
    transform: translateX(-50%);
    width: 15px;
    height: 15px;
    background-color: rgb(21, 223, 21);
    border-radius: 50%; /* To make it a circle */
}
.offline-indicator{
  position: absolute;
    bottom: 0;
    left: 80%;
    transform: translateX(-50%);
    width: 15px;
    height: 15px;
    background-color: rgb(103, 117, 103);
    border-radius: 50%; /* To make it a circle */

}
.oiwnefoiwnef{
  width: 10px;
  height: 10px;
}

.ppppojpppo{
  width: 30px;
  height: 30px;
}

.modal-content {
  background-color: red !important; /* Example: Light grey */
}






.chat {
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;
  border-left: 1px solid #dddddd35;
  border-right: 1px solid #dddddd35;
  overflow: scroll;
}
.top {
  width: 100%;

  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #dddddd35;
}
.user {
  display: flex;
  align-items: center;
  gap: 20px;
}
.user img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}
.texts {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.texts span {
  font-size: 18px;
  font-weight: bold;
}
p {
  font-size: 14px;
  font-weight: 300;
  color: white;
}
.icons {
  display: flex;
  gap: 20px;
}
.icons img {
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.center {
  flex: 1 ;
  padding: 20px;
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  gap: 20px;
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

.center:hover::-webkit-scrollbar-thumb {
  background-color: #888; /* Adjust as needed */

}

.send-button{
  background-color: #3365e4;
  border-color: darkblue;
}







.message {
  max-width: 70%;
  display: flex;
  gap: 20px;
    margin-bottom:17px ;

}
.message img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
  margin-top: 20px;
}
.message_own {
  align-self: flex-end;
  margin-bottom:17px ;
}
.message_own .text pre{
  background-color: #5183fe;
  color: white;
  padding: 5px;
  border-radius: 5px;
  color: white;
   margin-bottom:0 ;
}
 .text pre{
  background-color: rgba(17, 25, 40, 0.3);
  padding: 10px;
  border-radius: 5px;
  color: white;
  margin-bottom:0 ;
}

.text img{
  width: 100%;
  height: 300px;
  border-radius: 10px;
  object-fit: cover;

}

.time{
  font-size: 12px;
  float: inline-end;
}





.bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-top: 1px solid #dddddd35;
}
.bottom .icons img {
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.bottom textarea {
  flex: 1;
  background-color: rgba(17, 25, 40, 0.5);
  border: none;
  outline: none;
  color: white;
  border-radius: 10px;
  font-size: 18px;
  padding: 10px;
  margin: 0 10px;
  resize: none;
  height: 60px;
}
.bottom .sendButton {
  background-color: #5183fe;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>

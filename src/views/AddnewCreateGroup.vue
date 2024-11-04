<template>

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
</style>

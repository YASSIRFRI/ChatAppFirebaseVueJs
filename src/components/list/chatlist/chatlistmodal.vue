<template>
<div class="chatlist">

     <div class="search">
    <div class="searchbar">
      <b-form-input
        v-model="searchQuery"
        type="search"
        placeholder="Search"
        class="search-input"
        @input="performSearch"
      ></b-form-input>
            <img style="cursor:pointer" src="../../../../public/assets/search.png" alt="Search Icon" class="search-icon">

    </div>
    
    <div          v-b-tooltip.hover title="Add new user or create new group"
 ><i   @click="this.$router.push('/add-user-group')"  class="bi bi-plus kmkmk" style="color:white; font-size: 2rem;cursor:pointer"></i></div>


  </div>

     <div @click="this.$router.push(`/chat/${chat.id}`)" v-for="(chat, index) in filteredChats" :key="index" class="item">

      <div class="profile-container">
        
          <img v-if="chat.type === 'discussion'" :src="chat.friendpic" alt="" />
          <img v-if="chat.type === 'group'" :src="chat.groupicon" alt="" />
          <div v-if="chat.type==='discussion'"  :class="{'online-indicator':chat.status,'offline-indicator':!chat.status}"></div> <!-- Online status indicator -->

      </div>


      <div class="texts" style="overflow:hidden">
        <span v-if="chat.type === 'discussion'" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
          {{ chat.friendusername }}
        </span>
        <span v-if="chat.type === 'group'" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
          {{ chat.groupname }}
        </span>

        <p style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
          {{ chat.content }}
        </p>
      </div>

        <div v-if="chat.unreadmessages !== 0" style="flex:1;display:flex;align-items:right;justify-content:right"><div class="indicator">{{chat.unreadmessages}}</div></div>

    </div>
    
</div>
  
</template>



<script>
export default {
  props:['chats'],
    data(){
        return{
            searchQuery:'',
            addMode:true,
            first:require("../../../../public/assets/minus.png"),
            second:require("../../../../public/assets/plus.png")
        }
    },
    computed: {
    filteredChats() {
      if (!this.searchQuery) {
        return this.chats;
      }
      return this.chats.filter((chat) => {
        const query = this.searchQuery.toLowerCase();
        if (chat.type === 'discussion') {
          return chat.friendusername.toLowerCase().includes(query);
        } else if (chat.type === 'group') {
          return chat.groupname.toLowerCase().includes(query);
        }
        return false;
      });
    },
  },

}
</script>

<style scoped>
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

.indicator{
  border-radius: 10px;
  background-color: #2a8fc2;
  padding: 7px;
}

.kmkmk{
  background-color:green ;
  padding-right: 5px;
  padding-left:5px ;
  color: white;
  border-radius: 7px;
}

.search {
  gap: 20px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 600px;
  margin: 20px auto;
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

.chatlist:hover::-webkit-scrollbar-thumb {
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
    cursor: pointer;
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
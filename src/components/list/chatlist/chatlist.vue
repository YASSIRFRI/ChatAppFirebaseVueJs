<template>
  <div class="chatlist">
    <div class="search">
      <div class="searchbar">
        <b-form-input
          v-model="searchQuery"
          type="search"
          placeholder="Search"
          class="search-input"
        ></b-form-input>
        <img
          style="cursor:pointer"
          :src="require('../../../../public/assets/search.png')"
          alt="Search Icon"
          class="search-icon"
        />
      </div>

      <div
        class="oooooooooo"
        @click="$router.push('/add-user-group')"
        v-b-tooltip.hover
        title="Add new user or create new group"
      >
        <img
          :src="second"
          alt="Add Icon"
          class="add-icon"
          v-b-tooltip.hover
          title="Add new user or create new group"
        />
      </div>
    </div>
<div class="ppppppppppppp">
      <div @click="this.$router.push(`/chat/${chat.id}`)" v-for="(chat, index) in filteredChats" :key="index" class="item ">

      <div class="profile-container">
        
          <img v-if="chat.type === 'discussion'" :src="chat.friendpic" alt="" />
          <img v-if="chat.type === 'group'" :src="chat.groupicon" alt="" />
          <div v-if="chat.type==='discussion'"  :class="{'online-indicator':chat.status,'offline-indicator':!chat.status}"></div> <!-- Online status indicator -->

      </div>


        <div  class="texts" style="overflow:hidden">
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
  </div>
</template>

<script>
import 'animate.css'


export default {
  name: 'ChatList',
  props: ['chats'],
  data() {
    return {
      searchQuery: '',
      addMode: false,
      first: require('../../../../public/assets/minus.png'),
      second: require('../../../../public/assets/plus.png')
    };
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

};
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

.oooooooooo {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: green;
  padding: 10px;
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

.indicator{
  border-radius: 10px;
  background-color: #2a8fc2;
  padding: 7px;
  
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
  cursor: pointer;
}

::-webkit-scrollbar {
  width: 5px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background-color: transparent;
  border-radius: 5px;
  transition: background-color 0.1s ease;
}

.ppppppppppppp:hover::-webkit-scrollbar-thumb {
  background-color: #888;
}

.ppppppppppppp{
  height: 50vh;
  overflow-y: auto;
}

@media (max-height: 300px) {
  .ppppppppppppp {
    height: 30vh; /* Adjust this value as needed */
  }
}


/* Adjust height for medium screens (tablets) */
@media (min-height: 300px) and (max-height: 350px) {
  .ppppppppppppp {
    height: 35vh; /* Adjust this value as needed */
  }
}

@media (min-height: 400px) and (max-height: 500px) {
  .ppppppppppppp {
    height: 35vh; /* Adjust this value as needed */
  }
}


/* Adjust height for large screens (desktops) */
@media (min-height: 1025px) {
  .ppppppppppppp {
    height: 50vh; /* Adjust this value as needed */
  }
}



.search .searchbar {
  background-color: rgba(17, 25, 40, 0.5);
  gap: 20px;
  border-radius: 10px;
}

.search .searchbar input {
  background-color: transparent;
  border: none;
  outline: none;
  color: white;
  flex: 1;
}

.searchbar img {
  width: 20px;
  height: 20px;
}

.item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  cursor: pointer;
  border-bottom: 1px solid #dddddd35;
}

.item img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.texts {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.texts span {
  font-weight: 500;
}

.texts p {
  font-size: 14px;
  font-weight: 300;
}
</style>

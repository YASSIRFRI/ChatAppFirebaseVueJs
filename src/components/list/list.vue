<template>
  <div style="height:90vh;overflow:scroll"  class="d-flex flex-column iwnfunweifunwieunfwiuefn">
    <userinfo :username="username" :profileimagelink="profileimagelink" />
    <chatlist :chats="chats" />
  </div>
</template>

<script>
import chatlist from './chatlist/chatlist.vue';
import userinfo from './userinfo/userinfo.vue';

export default {
  components: { userinfo, chatlist },
  props:['username','profileimagelink','chats'],

};
</script>

<style scoped>
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

.iwnfunweifunwieunfwiuefn:hover::-webkit-scrollbar-thumb {
  background-color: #888; /* Adjust as needed */

}


.list {
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>

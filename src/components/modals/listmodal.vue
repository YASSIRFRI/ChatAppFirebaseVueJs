<template>
  <div class="d-flex flex-column h-100">
    <userinfo :username="username" :profileimagelink="profileimagelink" />
    <chatlist :chats="chats" />
  </div>
</template>

<script>
import chatlist from "@/components/list/chatlist/chatlistmodal.vue"
import userinfo from "@/components/list/userinfo/userinfomodal.vue"
export default {
  components: { userinfo, chatlist },
  props:['username','profileimagelink','chats'],

};
</script>

<style scoped>
.list {
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>

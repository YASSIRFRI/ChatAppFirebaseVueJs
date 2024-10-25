<template>
  <div class="chat">
    
 
    <div class="center">
                <i class="bi bi-chat" style=" cursor:pointer;font-size: 9rem;"></i>

        <h1>Welcome to chatFlow</h1>
        <h5>Start you first discussion. No friend, no worries, add as many as you want</h5>
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
import { EmojiButton } from '@joeattardi/emoji-button';
import detail from "@/components/detail/detail.vue"

export default {
  components:{detail},
  data() {
    return {
      text: "",
      picker: new EmojiButton(),
      showDetail: false

    };
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
    }
  }
};
</script>

<style scoped>

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
  align-items: center;
  justify-content: center;
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
.message_own .text p{
  background-color: #5183fe;
  color: white;
  padding: 5px;
  border-radius: 5px;
  color: white;
   margin-bottom:0 ;
}
 .text p{
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

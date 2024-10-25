<template>
  <b-row class="iii" style="overflow-y: scroll;height: 90vh;width:100%">
    <b-col cols="7" class="animated-flex d-none d-xl-block op"> 
      <intro />
    </b-col>



    <b-col  cols="12" xl="5" >

      
      <div style=" display: flex;justify-content: center;align-items:center ;">

          <div class="app-introduction animated-flex d-xl-none ">
            <h2 style="color: rgba(255, 255, 233, 0.9); font-weight: bold;">Welcome to ChatFlow!</h2><br>
          </div>

      </div>
      

      <RegisterForm/>
    </b-col>




    
  </b-row>



</template>

<script>
import RegisterForm from "@/components/auth/registerform.vue"
import intro from "@/components/layout/intro.vue"
export default {
    components:{RegisterForm,intro}
    
}
</script>

<style scoped>
.op{
      border-right: 1px solid rgba(255, 255, 255, 0.125);

        
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

.iii:hover::-webkit-scrollbar-thumb {
  background-color: #888; /* Adjust as needed */

}


.app-introduction {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  padding: 25px;
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
  max-width: 350px;
  color: #ffffff;
  text-align: center; /* Centers the text inside the introduction div */
}

.app-introduction h2 {
  font-size: 26px;
}

.app-introduction p {
  font-size: 18px;
  line-height: 1.4;
}







</style>

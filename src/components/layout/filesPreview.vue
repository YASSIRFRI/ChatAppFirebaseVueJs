<template>
  <div>
    <input type="file" @change="handleFileChange" multiple hidden>
    <div class="file-preview" v-if="files.length > 0">
      <div v-for="(file, index) in files" :key="index" class="file-item">
        <img v-if="file.type.startsWith('image/')" :src="file.url" class="file-image">
        <span v-else class="file-name">{{ file.name }}</span>
        <button @click="removeFile(index)" class="remove-button">&times;</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['files'],
  methods: {
    removeFile(index) {
      this.$emit('remove-file', index);
    }
  }
};
</script>

<style scoped>
.file-preview {
    border-top:rgba(0, 0, 0, 0.273) solid;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.file-item {
  position: relative;
  
}

.file-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border: 1px solid #ddd;
  border-radius: 5px;
}
:-webkit-scrollbar {
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



.file-name {
    max-height: 100px;
  display: block;
  width: 100px;
  height:100px;
  text-align: center;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}



.file-name:hover::-webkit-scrollbar-thumb {
  background-color: #888; /* Adjust as needed */

}

.remove-button {
  position: absolute;
  top: -15px;
  right: -5px;
  background: none;
  border: none;
  color: red;
  font-size: 50px;
  cursor: pointer;
}
</style>

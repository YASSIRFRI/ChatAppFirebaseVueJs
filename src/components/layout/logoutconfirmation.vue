<template>
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Logout Confirmation</h5>
          
      </div>
      <div class="modal-body">
        <p>Are you sure you want to logout?</p>
      </div>
      <div class="modal-footer">
        <b-button variant="secondary" @click="this.$emit('close');">Cancel</b-button>
        <b-button variant="danger" @click="this.$emit('logout');">Logout</b-button>
      </div>
    </div>
</template>


<style scoped>
.modal-content {
  border-radius: 12px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  backdrop-filter: blur(19px) saturate(180%);
 
}

.modal-header {
  border-bottom: none;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: bold;
}

.modal-body {
  padding: 20px;
}

.modal-footer {
  border-top: none;
  padding: 15px 20px;
  justify-content: space-between;
}

.close {
  font-size: 1.5rem;
  color: #000;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.close:hover {
  opacity: 1;
}
</style>
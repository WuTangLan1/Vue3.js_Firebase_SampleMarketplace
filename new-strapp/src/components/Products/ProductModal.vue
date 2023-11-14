<template>
  <div class="random">
    <transition name="fade">
      <div v-if="visible" class="modal-overlay">
        <div class="modal-content">
          <button class="exit-button" @click="closeModal">✖</button> <!-- Exit button -->
          <h3 class="modal-title">Select a Product</h3>
          <div class="product-item" v-for="product in products" :key="product.id" @click="selectProduct(product)">
            {{ product.Title }}
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>

export default {
props: {
  visible: {
    type: Boolean,
    default: false
  },
  products: {
    type: Array,
    default: () => []
  }
},
methods: {
  selectProduct(productId) {
      this.$emit('product-selected', productId);
    },
    closeModal() {
      this.$emit('close-modal'); // Emits a close-modal event
    }
  },
watch: {
  visible(newVal) {
    if (newVal) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  }
},
mounted() {
  if (this.visible) {
    document.body.classList.add('modal-open');
  }
},
beforeMount() {
  document.body.classList.remove('modal-open');
}
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7); 
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
}

.modal-overlay::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(5px);
}

.random {
  background-color: white;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 400px;  /* Adjusted width to 400px */
  height: 600px;
  overflow-y: auto;
  box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.15);
  position: relative;  /* Relative positioning for absolute positioned children */
  display: flex;
  flex-direction: column;
  align-items: center; 
}

.modal-title {
  color: #333;
  margin-bottom: 20px;
  font-weight: bold;
}

.product-item {
  background-color: #007bff;
  color: #fff;
  padding: 12px;
  margin: 10px 0;
  border-radius: 6px;
  cursor: pointer;
  width: 80%;  /* Adjusted width to 80% */
  text-align: center;
  transition: background-color 0.3s;
}

.product-item:hover {
  background-color: #0056b3;
}

.exit-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #333;
}

.exit-button:hover {
  color: #555;
}

/* Transition */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>

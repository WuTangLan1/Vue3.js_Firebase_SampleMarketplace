<template>
  <div class="bubble" :style="bubbleStyle" @click="handleClick">
    <img v-if="product.ProductImages && product.ProductImages.length" :src="product.ProductImages[0]" alt="Product Image" class="product-img">

    <div class="bubble-content">
      <h3>{{ product.Title }}</h3>
    </div>
    <footer>
      {{ product.uploader_username }}
      <a @click.stop="handleSeeMoreClick" class="see-more-link">See More</a>
    </footer>
  </div>
</template>


<script>
export default {
  props: {
    product: {
      type: Object,
      required: true
    },
    background: { 
      type: String,
      required: true
    }
  },
  computed: {
    bubbleStyle() {
      return {
        backgroundColor: this.background,
      };
    }
  },
  methods: {
    handleSeeMoreClick() {
      this.$emit('seeMore');
    },
    handleClick() {
      // Handle main click on the bubble if needed
    }
  }
};
</script>
<style>
.bubble {
  padding: 20px;
  border-radius: 10px; 
  width: 250px; 
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 15px;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
  position: relative;
}

.bubble-content {
  flex: 1;
  text-align: center;
}

.bubble h3 {
  font-size: 1.2em;
  margin-bottom: 10px;
  font-weight: 600;
  /* Removed the previous styles causing the ellipsis effect */
  text-align: center;  /* Center the title */
}

.bubble p {
  margin: 0 0 10px 0;
  color: #555;
}

.bubble footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-size: 0.9em;
  border-top: 1px solid #ddd;
  padding-top: 10px;
}

.see-more-link {
  text-decoration: underline;
  cursor: pointer;
  color: #007BFF;  
  font-size: 0.8em;
}

.see-more-link:hover {
  color: #0056b3; 
}

.product-img {
  width: 100%; 
  height: 150px; 
  border-radius: 5px;
  margin-bottom: 10px;
  object-fit: cover;
}
</style>



<template>
  <div v-if="product" class="product-card">
    <div class="product-images-container">
      <div class="image-carousel">
        <div class="carousel-frame">
          <div class="arrow-button-container">
            <button @click="prevImage" class="arrow-button prev-button">&#9664;</button>
          </div>
          <div class="image-container">
            <img
              :src="currentImage"
              alt="Product Image"
              class="carousel-image"
            />
          </div>
          <div class="arrow-button-container">
            <button @click="nextImage" class="arrow-button next-button">&#9654;</button>
          </div>
        </div>
      </div>
      <button @click="goToHomePage" class="return-btn">Return to Home</button>
    </div>
      <div class="product-info">
          <h2>{{ product.Title }}</h2>
          <p>{{ product.Description }}</p>
          <p>Price: {{ product.Price }}</p>
          <p>Available Quantity: {{ product.AvailableQntty }}</p>

          <div class="conditions-container">
              <h3>Conditions</h3>
              <span v-for="condition in product.conditions" 
                    :key="condition" 
                    class="condition-tag">{{ condition }}</span>
          </div>
          
          <p>Category: <span class="category-badge">{{ product.category_title }}</span></p>

          <div class="user-info">
              <h3>User Information</h3>
              <img v-if="uploader && uploader.profilePhotoUrl" 
                   :src="uploader.profilePhotoUrl" 
                   alt="Uploader's profile photo" 
                   class="uploader-image">
              <p>Uploader: {{ uploader ? (uploader.firstName + ' ' + uploader.lastMiddleName) : '' }}</p>
              <p>Username: {{ uploader ? uploader.username : '' }}</p>
          </div>
      </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState(['product', 'uploader']),
    currentImage() {
      if (this.product && this.product.ProductImages.length > 0) {
        return this.product.ProductImages[this.currentImageIndex];
      } else {
        return console.error("No Images for this product");
      }
    },
  },
  data() {
    return {
      currentImageIndex: 0,
    };
  },
  methods: {
    ...mapActions(['fetchProductById', 'fetchUploaderByUID']),
    async fetchProductData() {
      await this.fetchProductById(this.$route.params.prodId);
      if (this.product && this.product.uploaderUID) {
        await this.fetchUploaderByUID(this.product.uploaderUID);
      }
    },
    goToHomePage() {
      this.$router.push({ name: 'HomePage' });
    },

    prevImage() {
      if (this.currentImageIndex > 0) {
        this.currentImageIndex--;
      } else {
        // Wrap around to the last image when at the beginning
        this.currentImageIndex = this.product.ProductImages.length - 1;
      }
    },

    nextImage() {
      if (this.currentImageIndex < this.product.ProductImages.length - 1) {
        this.currentImageIndex++;
      } else {
        // Wrap around to the first image when at the end
        this.currentImageIndex = 0;
      }
    },
  },
  mounted() {
    this.fetchProductData();
  },
};
</script>

<style>
body, html {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f6f6f6;
}

.product-card {
  width: 800px;
  margin: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  background-color: #ffffff;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.1);
}

.product-images-container, .product-info {
  width: 50%;
}

.return-btn {
    padding: 8px 16px;
    border: none;
    background-color: #007BFF;
    color: white;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
    margin: 16px 0; 
}

.return-btn:hover {
    background-color: #0056b3;
}

.product-images-container {
  background-color: #f0f4f8;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
}

.product-main-image {
  width: 100%;
  height: 100%;
  max-height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 16px;
}

.product-sub-images {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px;
}

.product-sub-image {
  width: calc(50% - 4px);
  height: calc(50%);
  object-fit: cover;
  border-radius: 8px;
}

.product-sub-image-double {
  width: 100%;
  height: auto;
  object-fit: cover;
  border-radius: 8px;
}

.product-sub-image-triple-wide {
  width: 100%;
  height: 50%;
  object-fit: cover;
  border-radius: 8px;
}

.product-sub-image-triple {
  width: 50%;
  height: 50%;
  object-fit: cover;
  border-radius: 8px;
}

.product-sub-image-quad {
  width: calc(50% - 4px);
  height: calc(50%);
  object-fit: cover;
  border-radius: 8px;
}

.product-info {
  flex: 1; /* Let the product info take available space vertically */
  padding: 16px;
  background-color: #f9fcfd;
  display: flex; /* Use flex to center vertically */
  flex-direction: column; /* Stack items vertically */
  justify-content: center; /* Center items vertically */
}

.conditions-container {
  padding: 10px;
  border-top: 1px solid #eee;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 5px;
  background-color: #f0f4f8;
}

.condition-tag {
  background-color: #0056b3; 
  color: white;
  padding: 10px 16px;
  border-radius: 30px;
  font-size: 14px;
  margin: 5px 10px;
  display: inline-block;
  transition: transform 0.2s;
  cursor: pointer;
  width: 100px;
  text-align: center;
}

.condition-tag:hover {
  transform: scale(1.1);
}

.condition-tag:nth-child(1) {
  background-color: #0056b3;
}

.condition-tag:nth-child(2) {
  background-color: #c44630;
}

.condition-tag:nth-child(3) {
  background-color: #28a745;
}

.condition-tag:nth-child(4) {
  background-color: #c41277;
}

.condition-tag:nth-child(5) {
  background-color: #c49f29;
}

.condition-tag:nth-child(6) {
  background-color: #0056b3;
}

.user-info {
  padding: 10px;
  border-top: 1px solid #eee;
  background-color: #f0f4f8;
}

.category-badge {
    display: inline-block;
    background-color: #007BFF; /* default color */
    color: white;
    border-radius: 8px;
    padding: 3px 10px;
    margin-left: 10px;
    font-weight: bold;
    text-transform: capitalize;
    transition: background-color 0.3s ease;
}

/* You can have category-specific colors if you want */
.category-badge[data-category="electronics"] {
    background-color: #6F42C1; /* This is just an example */
}

.category-badge[data-category="furniture"] {
    background-color: #FD7E14; /* This is just an example */
}

.uploader-image {
  width: 50px;
  height: 50px;
  border-radius: 25px;
  object-fit: cover;
  margin-bottom: 10px;
}

.carousel-button {
  background: rgba(0, 0, 0, 0.3);
  color: white;
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 24px; /* Adjust the font size as needed */
}

.prev-button {
  transform: rotate(90deg); /* Rotate the button for previous */
}

.next-button {
  transform: rotate(-90deg); /* Rotate the button for next */
}

.carousel-frame {
  display: flex;
  max-height: 300px;
  flex-direction: row; /* Keep items in a row */
  align-items: center; /* Center items vertically */
  justify-content: center; /* Center items horizontally */
  background-color: #003366; /* Dark blue background color */
  padding: 16px; /* Add padding for spacing */
  border-radius: 8px; /* Add border-radius for rounded corners */
}

/* Update the styles for the image container */
.image-container {
  flex: 1; /* Let the image take available space */
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 10px; /* Add some margin between the image and buttons */
}

.image-carousel {
  display: flex;
  flex-direction: column; /* Stack items vertically */
  justify-content: center; /* Center items vertically */
  align-items: center; /* Center items horizontally */
  height: 100%;
}

.carousel-image {
  width: 200px; 
  height: 200px; 
}


</style>

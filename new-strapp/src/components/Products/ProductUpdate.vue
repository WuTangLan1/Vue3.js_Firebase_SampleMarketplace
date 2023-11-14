<template>
    <div class="update-product-container">

        <div class="title-container">
    <label for="productTitle">Product Title:</label>
    <input id="productTitle" class="product-title-input" v-model="product.Title" placeholder="Enter Product Title" @input="onInputChange" />
        </div>

      
      <label>Available Quantity:</label>
      <input v-model="product.AvailableQntty" @input="onInputChange" />
  
      <label>Description:</label>
      <textarea v-model="product.Description" @input="onInputChange"></textarea>
  
      <label>Price:</label>
      <input type="number" v-model="product.Price" @input="onInputChange" />
  
      <label>Is Available:</label>
      <input type="checkbox" v-model="product.isAvailable" @input="onInputChange" />
  
      <div v-for="(imgUrl, index) in product.ProductImages" :key="index">
        <img :src="product.ProductImages[index]" alt="Product Image" class="product-img">
      </div>

  
      <div class="button-container">

        <button v-if="showUpdateBtn" @click="updateProduct">Update Product</button>
        <button v-if="showUpdateBtn" @click="cancelChanges">Cancel</button>
        <button @click="deleteProduct">Delete Product</button>
      </div>



    </div>
</template>

  
  <script>
  import {firebase} from '@/firebase/index.js'
  import { getDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';
  import router from '@/router/index.js';
  
  export default {
      props: ['prodId'], 
      data() {
          return {
              product: '',
              originalProduct: null,
              showUpdateBtn: false
          };
      },
      created() {
        this.fetchProductDetails();
      },
      methods: {
          async fetchProductDetails() {
              try {
                  const productDocRef = doc(firebase, 'products', this.prodId);
                  const productSnapShot = await getDoc(productDocRef);
                  if (productSnapShot.exists()) {
                      this.product = productSnapShot.data();
                      this.originalProduct = JSON.parse(JSON.stringify(this.product));
                  } else {
                      console.log('could not get the product here :(');
                  }
              } catch (error) {
                  console.error('Error fetching product:', error);
              }
          },
          onInputChange() {
              this.showUpdateBtn = true;
          },
          async updateProduct() {
              try {
                  const productDocRef = doc(firebase, 'products', this.prodId);
                  await updateDoc(productDocRef, this.product);
                  this.originalProduct = JSON.parse(JSON.stringify(this.product)); // Update the originalProduct after updating the product
                  this.showUpdateBtn = false;
                  router.push({ name: 'UserMe' });
              } catch (error) {
                  console.error('Error updating product:', error);
              }
          },
          cancelChanges() {
              this.product = JSON.parse(JSON.stringify(this.originalProduct));
              this.showUpdateBtn = false;
          },
          async deleteProduct() {
            try {
                const productDocRef = doc(firebase, 'products', this.prodId);
                await deleteDoc(productDocRef);

                // Navigate back to ProfileDashboardView
                router.push({ name: 'UserMe' });
            } catch (error) {
                console.error('Error deleting product:', error);
            }
        }
      },
  };
  </script>
  
  
  <style scoped>
  img{
    object-fit: contain;
    aspect-ratio: 5/5;
    height: auto;
    max-height: 400px;
    display: block;
    align-items: center;
  }
  .update-product-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    background: linear-gradient(90deg, #c965c9, #6c6ced 100%);
  }
  
  img {
    object-fit: contain;
    aspect-ratio: 5/5;
    height: auto;
    max-height: 400px; /* or whatever height you choose */
    display: block;
  }

  h2 {
    font-size: 24px;
    margin-bottom: 20px;
  }
  
  label {
    font-size: 16px;
    margin-top: 10px;
    display: block;
    margin-bottom: 5px;
    color: #fff;
  }
  
  input, textarea {
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    border: 1px solid #fff;
    border-radius: 4px;
    font-size: 16px;
  }
  
  input[type="checkbox"] {
    width: auto;
  }
  
  button {
    padding: 10px 20px;
    background: linear-gradient(90deg, #c965c9, #6c6ced 100%);
    color: white;
    border: none;
    border-radius: 4px;
    font-weight: 600;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    letter-spacing: 0.8px;
    font-size: 16px;
    outline: none;
    text-decoration: none; /* Remove default button styles */
    margin: 0;
  }
  .button-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px; /* Provides even spacing between the buttons */
}
.title-container {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.title-container label {
    margin-right: 10px;  /* Adds some spacing between the label and the input */
    margin-bottom: 0;   /* Removes the default bottom margin from the label */
}

.product-title-input {
    font-size: 24px;
    flex: 1; /* Allows the input to take the remaining space */
    padding: 10px;
    border: 1px solid #fff;
    border-radius: 4px;
    font-weight: bold;
    outline: none;
    background-color: #fff; /* Same as the container's background for a seamless appearance */
}
.delete-button-container {
    position: absolute;
    bottom: 20px;
    left: 20px;
}
.delete-button-container button {
    background: #e74c3c; /* Red for delete action */
}

.delete-button-container button:hover {
    background: #c0392b; /* Darker red on hover */
}
button:not(:first-of-type) {
  margin-left: 10px; /* Apply margin to the left for all buttons except the first one */
}

.delete-button-container {
  display: flex;
  justify-content: center; /* Center the delete button when other buttons are not there */
  width: 100%; /* Take full width of the parent container */
}

.delete-button-container button {
  background: #e74c3c; /* Red for delete action */
}

.delete-button-container button:hover {
  background: #c0392b; /* Darker red on hover */
}

button:first-of-type {
  margin-right: 10px; /* This adds spacing between the two buttons */
}
  
  button:hover {
    background: linear-gradient(90deg, #6c6ced, #3a3ab1 100%);
  }
  </style>
  
  
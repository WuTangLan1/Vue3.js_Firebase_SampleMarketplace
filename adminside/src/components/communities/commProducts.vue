<template>
  <div class="comm-products-container">
      <h2>Products in this community</h2>
      <ul>
          <li v-for="product in products" :key="product.productID" 
              :style="{ backgroundColor: getColorForUploader(product.uploader_username) }">
              <img :src="product.ProductImages[0]" alt="Product Image">
              <div class="product-details">
                <h3>{{ product.Title }}</h3>
                <p>{{ product.Description }}</p>
                <p><strong>Uploader:</strong> <span @click="logUploaderUID(product.uploaderUID)">{{ product.uploader_username }}</span></p>
                <p><strong>Price:</strong> R{{ product.Price }}</p>
                <a href="#" @click.prevent="seeMore(product.productID)" class="see-more">See more</a>
                
              </div>
          </li>
      </ul>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { firestore } from '@/firebase/index.js';  
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useRouter } from 'vue-router'; // Import useRouter

export default {
  props: {
      commId: {
          type: String,
          required: true
      }
  },
  setup(props) {
      const products = ref([]);
      const router = useRouter(); // Create a router instance

      onMounted(async () => {
          try {
              const q = query(collection(firestore, "products"), where("communityId", "==", props.commId));
              const querySnapshot = await getDocs(q);
              products.value = querySnapshot.docs.map(doc => doc.data());
          } catch (error) {
              console.error("Error fetching products:", error);
          }
      });

      const getColorForUploader = (username) => {
    const colors = [
        0,   
        30,  
        60,  
        90,  
        120, 
        150, 
        180, 
        210, 
        240, 
        270,
        300, 
        330  
    ];

    let hash = 0;
    for (let i = 0; i < username.length; i++) {
        hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }

    const hue = colors[hash % colors.length];
    return `hsl(${hue}, 50%, 85%)`; 
};

      const seeMore = (productID) => {
        console.log(productID)
        router.push({ // Use router instance
      name: 'ProductInfoView',
      params: {
        prodId: productID
      }
    });
      };

      const logUploaderUID = (uploaderUID) => {
          console.log(uploaderUID);
      };

      return {
          products,
          getColorForUploader,
          seeMore,
          logUploaderUID
      }
  }
}
</script>


<style>
.comm-products-container {
  padding: 2rem;
  background: #EAEAEA;
  border-radius: 8px;
  height: 400px;
  overflow-y: auto;
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

li {
  border: 1px solid #ccc;
  padding: 10px;
  margin-bottom: 10px;
  display: flex;
  align-items: flex-start; 
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  height: auto;  
  overflow: hidden; 
}

li:hover {
  transform: scale(1.02);
  box-shadow: 0 10px 15px rgba(0,0,0,0.2);
}

img {
  margin-right: 10px;
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 50%;
}

.product-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

h3 {
  white-space: nowrap;  
  overflow: hidden;    
  text-overflow: ellipsis; 
  margin: 0;    
}

p {
  margin: 0.5rem 0;   
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.see-more {
    display: block;
    margin-top: auto;
    text-align: right;
    text-decoration: underline;
    cursor: pointer;
}

.product-details span {
    text-decoration: underline;
    cursor: pointer;
    color: blue;
}

</style>
<template>
    <div class="create-product-container">
    <h1>Create a New Product</h1>
    <form @submit.prevent="createproduct" class="product-form">
      <div class="form-group">
        <label for="title">Title:</label>
        <input type="text" id="title" v-model="product.Title" required class="form-input" />
      </div>
      <div class="form-group">
        <label for="description">Description:</label>
        <textarea id="description" v-model="product.Description" required class="form-input"></textarea>
      </div>
      <!-- Available Quantity Input -->
      <div class="form-group">
        <label for="availableQntty">Available Quantity:</label>
        <input type="number" id="availableQntty" v-model="product.AvailableQntty" required class="form-input" />
      </div>
      <!-- Price Input -->
      <div class="form-group">
        <label for="price">Price:</label>
        <input type="number" id="price" step="0.01" v-model="product.Price" required class="form-input" />
      </div>
      <!--Product Uploaded images display-->
      <div v-if="product.ProductImages.length">
        <h3>Uploaded Images:</h3>
        <div v-for="(image, index) in product.ProductImages" :key="index" class="uploaded-image-container">
        <img :src="image" class="uploaded-image" />
        </div>
      </div>
      <!-- Product Images Input -->
      <div class="form-group">
        <label for="productImages">Upload Product Images:</label>
        <input type="file" id="productImages" multiple v-on:change="handleImagesUpload" required class="form-input" ref="productImages" />
      </div>
    <!--Condition Selection-->
<div class="form-group">
  <label for="condition">Condition:</label>
  <div v-for="condition in conditions" :key="condition.id" @click="toggleSelection('condition',condition.title)" :class="['condition-card', product.conditions.includes(condition.title) ? 'selected-condition' : '']">
    {{ condition.title }}
  </div>
</div>
      <!--Category Selection-->
<div class="form-group">
  <label for="category">Category:</label>
  <div v-for="category in categories" :key="category.id" @click="toggleSelection('category', category.title)" :class="['category-card', product.category_title === category.title ? 'selected-condition' : '']">
    {{ category.title }}
  </div>
</div>

<!--Community Selection-->
<div class="form-group">
  <label for="community">Community:</label>
  <div v-for="community in communities" :key="community.id" @click="toggleSelection('community', community.title)" :class="['community-card', product.community_title === community.title ? 'selected-condition' : '']">
    {{ community.title }}
  </div>
</div>
      <button type="submit" class="submit-button" @click="UploadProduct">Create product</button>
    </form>
  </div>
  <div class="modal fade" id="popupMessageModal" tabindex="-1" role="dialog" aria-labelledby="popupMessageModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="popupMessageModalLabel">product</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          Please select a community and category before creating a product.
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">OK</button>
        </div>
      </div>
    </div>
  </div>
  <CloudImage path="pfp.jpg"/>
</template>
  
  <script>
  /* eslint-disable */
  import { collection, setDoc, doc, getDocs, query, where } from 'firebase/firestore'
  import { firebase, storage } from '@/firebase/index.js'
  import {ref, uploadBytes, getDownloadURL} from 'firebase/storage'
  import {uuid} from 'vue-uuid'
  import router from '@/router/index.js';
  //import router from '@/router/index.js';
  export default {
    data() {
      return {
        product: {
          AvailableQntty: 0,
          Description: '',
          FeaturePoints: 0,
          LastEditDate: new Date().toISOString(),
          Price: 0,
          ProductImages: [],
          Title:'',
          UploadDate: new Date().toISOString(),
          categoryId: '',
          category_title: "Select Category",
          communityId : '',
          community_title: 'Select Community',
          conditions: [],
          isAvailable: false,
          uploaderUID: '',
          uploader_username: ''
        },
        categoryDoc: null,
        communityDoc:null,
        conditionsDoc: null,
        categories: [],
        communities: [],
        conditions: [],
        files: []
      };
    },
    async mounted() {
      // Fetch preset list items from firebase
      await this.fetchCategories();
      await this.fetchCommunities();
      await this.fetchConditions();
    },
    computed: {
      displayedConditions() {
        return this.product.conditions.join(', ');
      }
    },

    methods: {
      toggleSelection(type, title) {
    if(type === 'condition') {
        if (this.product.conditions.includes(title)) {
            this.product.conditions = this.product.conditions.filter(condition => condition !== title);
        } else {
            this.product.conditions.push(title);
        }
    } else if(type === 'category') {
        this.product.category_title = this.product.category_title === title ? '' : title;
    } else if(type === 'community') {
        this.product.community_title = this.product.community_title === title ? '' : title;
    }
},


      handleImagesUpload(event) {
        this.files = event.target.files;
        if (this.files.length > 5) {
        alert("You can upload a maximum of 5 images.");
        return;
        }
        const imageUrls = [];
        // For demonstration purposes. Normally, you'd upload these and get URLs.
        for (const file of this.files) {
        imageUrls.push(URL.createObjectURL(file));
        }
        this.product.ProductImages = imageUrls;
      },
      async fetchCategories() {
        const categoriesCollection = collection(firebase, 'categories');
        const querySnapshot = await getDocs(categoriesCollection);

        this.categories = querySnapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title,
        }));
      },
    
      async fetchCommunities() {
        const communitiesCollection = collection(firebase, 'communities');
        const querySnapshot = await getDocs(communitiesCollection);

        this.communities = querySnapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title,
        }));
      },

      async fetchConditions(){
        const conditionsCollection = collection(firebase, 'productconditions');
        const querySnapshot = await getDocs(conditionsCollection);
        console.log(conditionsCollection)
        this.conditions = querySnapshot.docs.map(doc => ({
          id: doc.id,
          title: doc.data().title,
        }));
      },
      checkConditionLimit() {
      if (this.product.conditions.length > 5) {
        alert("You can select a maximum of 5 conditions.");
        this.product.conditions = this.product.conditions.slice(0, 5);
      }
    },
      removeCondition(index) {
        this.product.conditions.splice(index, 1);
      },
      async UploadProduct() {
        console.log("Upload Started...")
        //need to call 2 separate methods, pushing to both image storage and doc storage
        //Get the current user
        const currentUser = await this.$store.getters.thisUser
        if (!currentUser){return}
        //get the selected list items
        const categoryTitle = this.product.category_title;
        const communityTitle = this.product.community_title;
        const conditions = this.product.conditions
        if(communityTitle){
            const communitiesCollection = collection(firebase, 'communities');
            const communityQuery = query(communitiesCollection, where('title', '==', communityTitle));
            const communitySnapshot = await getDocs(communityQuery);
            if (communitySnapshot.size > 0)
            {
             this.communityDoc = communitySnapshot.docs[0]; 
            }
            else 
            { 
              console.warn('Community not found:', this.notice.community_title);
            }
          }
        if(categoryTitle){
          const categoriesCollection = collection(firebase, 'categories');
          const categoryQuery = query(categoriesCollection, where('title', '==', categoryTitle));
          const categorySnapshot = await getDocs(categoryQuery);
          if (categorySnapshot.size > 0) {
            this.categoryDoc = categorySnapshot.docs[0];
          } else {
            console.warn('Category not found:', this.notice.category_title);
          }
        }
        if (conditions){
          //const conditionsCollection = collection(firebase, 'productconditions')
          //the data call here needs to be corrected to work with the array of available and selected conditions on firebase and in the component
        }

        const catID = this.categoryDoc.data().categoryId
        const commID = this.communityDoc.data().communityId
        console.log(catID)
        console.log(commID)
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString("YYYY-MM-DD HH:MM:SS")
        const ItemImages = await this.PushProductImages(this.files)

        const newProduct = {
          AvailableQntty: this.product.AvailableQntty,
          Description: this.product.Description,
          FeaturePoints: 0,
          LastEditDate: formattedDate,
          Price: this.product.Price,
          productID: uuid.v1(),
          //Product images will get an array of image links from ItemImages
          ProductImages: ItemImages,
          Title:this.product.Title,
          UploadDate: formattedDate,
          categoryId: catID,
          category_title: this.product.category_title,
          communityId : commID,
          community_title: this.product.community_title,
          conditions: conditions,
          isAvailable: true,
          uploaderUID: currentUser.uid,
          uploader_username: currentUser.username
        }
        console.log(newProduct)
        const newProductFilled = (newProduct.AvailableQntty && 
        newProduct.Description && 
        !newProduct.FeaturePoints && 
        newProduct.LastEditDate &&
        newProduct.Price &&
        newProduct.ProductImages &&
        newProduct.Title &&
        newProduct.UploadDate &&
        newProduct.categoryId &&
        newProduct.category_title &&
        newProduct.communityId &&
        newProduct.community_title &&
        newProduct.conditions &&
        newProduct.isAvailable &&
        newProduct.uploaderUID &&
        newProduct.uploader_username)
        console.log("WE IS HERE")
        console.log(newProductFilled)
        if (newProductFilled) {
          const productID = newProduct.productID
          const productsCollection = collection(firebase, 'products')
          const offerRef = doc(productsCollection,productID)
          await setDoc(offerRef, newProduct)
          console.log("Product Pushed")
          router.push({ name: 'UserMe' });

        }
      },
      PushProductDoc(){
        //Push to firebase/firestore
      },
      async PushProductImages(imageFileList){
          /* eslint no-var: 0 */
          const imagesUrlArray = [];
          /* eslint no-var: 0 */
          for (let i = 0; i < imageFileList.length; i++) {
            const id = uuid.v1();
            console.log(id)
            /* eslint-disable no-await-in-loop */
            const storageRef = ref(storage, `images/${id}`);
            
            const upload = await uploadBytes(storageRef, imageFileList[i]);
            console.log(upload)
            const imageUrl = await getDownloadURL(storageRef);
            imagesUrlArray.push(imageUrl);
            console.log(imageUrl)
            console.log(imagesUrlArray)
          }
          return imagesUrlArray; // array of URLS of uploaded files
      }

    }
  };
  </script>
  
  <style scoped>
  .clickable-condition {
    cursor: pointer;
    border: 1px solid #ccc;
    padding: 5px 10px;
    border-radius: 4px;
    margin-right: 5px;
    transition: background-color 0.3s, transform 0.3s;
    display: inline-block;
  }

  .category-card,
  .community-card {
    display: inline-block;
    padding: 10px 20px;
    margin: 5px;
    border-radius: 4px;
    transition: background-color 0.3s;
    cursor: pointer;
  }

  .category-card:hover,
  .community-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .clickable-condition:hover {
    background-color: #ddd;
    transform: translateY(-2px);
  }

  .condition-card {
    display: inline-block;
    padding: 10px 20px;
    margin: 5px;
    border-radius: 4px;
    transition: background-color 0.3s;
    cursor: pointer;
  }

  .selected-condition {
    background: linear-gradient(90deg, #6200ea, #b743db);
    color: white;
  }

  .condition-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .uploaded-image-container {
    margin-top: 10px;
    width: 150px;
    height: 150px;
    border: 1px solid #ccc;
    display: inline-block;
    overflow: hidden;
    margin-right: 10px;
  }

  .uploaded-image {
    max-width: 100%;
    max-height: 100%;
    display: block;
    margin: 0 auto;
  }

  .create-product-container {
    width: 100%;
    max-width: 450px;
    margin: 0 auto;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    background: linear-gradient(90deg, #c965c9, #6c6ced);
    text-align: center;
  }

  h1 {
    margin-bottom: 20px;
    font-family: Impact;
    color: #fff;
  }

  .form-group {
    margin-bottom: 20px;
  }

  label {
    font-weight: bold;
  }

  .form-input {
    width: 100%;
    padding: 12px;
    border: 1px solid #fff;
    border-radius: 4px;
    font-size: 15px;
    outline: none;
    transition: border-color 0.3s;
    background-color: #fff;
  }

  .form-input:focus {
    border-color: #007bff;
  }

  .submit-button {
    margin-top: 20px;
    padding: 12px 18px;
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
  }

  .submit-button:hover {
    background: linear-gradient(90deg, #6c6ced, #3a3ab1 100%);
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
  }

  .submit-button:active {
    background: linear-gradient(90deg, #6c6ced, #3a3ab1 100%);
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
    transform: translateY(1px);
  }

  .product-details {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }

  .form-field {
    margin-bottom: 15px;
  }

  label {
    display: block;
    font-weight: bold;
  }

  .Upload-Btn {
    background-color: #42cb3b;
    color: rgb(0, 0, 0);
    border: 1px solid #000;
    border-radius: 5px;
    padding: 8px 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;
  }

  input,
  textarea {
    width: 100%;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
</style>

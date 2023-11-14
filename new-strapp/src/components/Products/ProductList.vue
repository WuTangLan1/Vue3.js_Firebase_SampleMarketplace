<template>
  <div v-if="!loadingDrops" class="center-elements">
    <div v-if="!loadingDrops">
      <!-- Dropdowns for communities, categories, and conditions -->
      <div class="dropdowns">
        <!-- Dropdown for communities -->
        <select v-if="communities.length > 0" v-model="selectedCommunityTitle" @change="setCommunity" class="dropdown">
          <option v-for="community in communities" :key="community.id" :value="community.title">
            {{ community.title }}
          </option>
        </select>

        <!-- Dropdown for categories -->
        <select v-if="categories.length > 0" v-model="selectedCategoryTitle" @change="setCategory" class="dropdown">
          <option v-for="category in categories" :key="category.id" :value="category.title">
            {{ category.title }}
          </option>
        </select>

        <!-- Dropdown for conditions -->
        <select v-if="conditions.length > 0" v-model="selectedConditionTitle" @change="setCondition" class="dropdown">
          <option value="">No condition selected</option>
          <option v-for="condition in conditions" :key="condition.id" :value="condition.title">
            {{ condition.title }}
          </option>
        </select>
        <button @click="resetAllFilters" class="clear-filters-btn">Clear Filters</button>

      </div>
    </div>

    <div v-if="!loadingProduct">
      <div v-if="!prodsEmpty" class="product-grid">
        <ProductCard v-for="product in products" :key="product.productID" :product="product" class="product-card" />
      </div>

      <!-- Friendly and interactive card when no products are available -->
      <div v-else class="no-products-card">
        <h2>Oops! No Products Found 🧐</h2>
        <p>It seems there are no products available for the selected criteria. Let's try adjusting the filters:</p>
        <ul>
          <li>Community: <strong>{{selectedCommunityTitle}}</strong></li>
          <li>Category: <strong>{{selectedCategoryTitle}}</strong></li>
          <div v-if="selectedConditionTitle">
            <li>Condition: <strong>{{selectedConditionTitle}}</strong></li>
          </div>
        </ul>
        <p>You might also want to explore other categories or communities to discover more products!</p>
      </div>  
    </div>

    <div v-else>
      <loader/>
    </div>
  </div>
</template>




<script>
//imports
import {collection, getDocs, query, where} from 'firebase/firestore'
import {firebase} from '@/firebase/index.js'
import ProductCard from '@/components/Products/ProductCard.vue'

import loader from '../LoaderIcon.vue'
//export
export default {
  components: {
    ProductCard, loader
  },
  data() {
    return {
      //list of products to be rendered
      products: [],
      //search conditions
      currentCommunity: {},
      currentCategory: {},
      currentCondition: {},
      selectedCommunityTitle: '',
      selectedCategoryTitle: '',
      selectedConditionTitle: '',
      titleSearch: '',
      //list of search terms
      communities: [],
      categories: [],
      conditions: [],
      //loading flag
      loadingDrops: true,
      loadingProduct: true,
      prodsEmpty: false,
    }
  },
  watch: {
    currentCommunity(){
      this.loadProducts()
    },
    currentCategory(){
      this.loadProducts()
    },
    currentCondition(){
      this.loadProducts()
    }
  },
  async mounted() {
  this.loadingDrops = true;
  console.log("Fetches Begin...");
  await this.fetchCommunities();
  await this.fetchCategories();
  await this.fetchConditions();
  console.log("Fetches end");
  if (this.communities.length > 0) {
    this.currentCommunity = this.communities[0];
    this.selectedCommunityTitle = this.currentCommunity.title;
  }
  if (this.categories.length > 0) {
    this.currentCategory = this.categories[0];
    this.selectedCategoryTitle = this.currentCategory.title;
  }
  this.loadingDrops = false;
},
  methods: {
    resetAllFilters() {
    if (this.communities.length > 0) {
      this.currentCommunity = this.communities[0];
      this.selectedCommunityTitle = this.currentCommunity.title;
    }
    if (this.categories.length > 0) {
      this.currentCategory = this.categories[0];
      this.selectedCategoryTitle = this.currentCategory.title;
    }
    this.selectedConditionTitle = '';
    this.loadProducts();
  },
    async loadProducts() {
      this.loadingProduct = true
      this.products = []
      const currentUserUID = this.$store.state.user ? this.$store.state.user.uid : null;
      console.log('da one', currentUserUID)
      if (!this.currentCommunity || !this.currentCategory || !this.currentCommunity.title || !this.currentCategory.title) {
        console.warn("Current community or category is not set or doesn't have a title");
        this.loadingProduct = false; // Always make sure to turn off the loading
        return;
      }
      try{
        if (this.selectedConditionTitle) {
        this.currentCondition = this.conditions.find(condition => condition.title === this.selectedConditionTitle);
      } else {
        this.currentCondition = {};
      }
      const productList = collection(firebase, 'products');
      // Query for products where uploaderUID is not equal to the current user's UID
      let q = null;
      if (this.currentCondition.title) {
        q = query(productList,
          where('communityId', '==', this.currentCommunity.id),
          where('categoryId', '==', this.currentCategory.id),
          where('conditions', 'array-contains', this.currentCondition.title),
          where('uploaderUID', '!=', currentUserUID) // Exclude products uploaded by the current user
        );
      } else {
        q = query(productList,
          where('communityId', '==', this.currentCommunity.id),
          where('categoryId', '==', this.currentCategory.id),
          where('uploaderUID', '!=', currentUserUID) // Exclude products uploaded by the current user
        );
      }

        console.log(currentUserUID, 'still here')
        const snapshot = await getDocs(q)
        if(snapshot.size > 0){
          this.products = snapshot.docs.map(doc => doc.data())
          //console.log("Loaded Products", this.products)
        }//else{
          //console.log("Snapshot size zero")
        //}
        this.loadingProduct = false
        //console.log(this.products.length)
        if(this.products.length == 0){
          this.prodsEmpty = true;
        }
        else{
          this.prodsEmpty = false;
        }
      }catch (err){
        console.warn("Error loading products", err)
        this.loadingProduct = false
      }
    },

    //These methods set search terms
    setCommunity() {
  const newCommunity = this.communities.find(community => community.title === this.selectedCommunityTitle);
  if (newCommunity.id !== this.currentCommunity.id) {
    this.currentCommunity = newCommunity;
    console.log("Selected Community", this.currentCommunity);
  }
},
setCategory() {
  this.currentCategory = this.categories.find(category => category.title === this.selectedCategoryTitle);
  console.log("Selected Category:", this.currentCategory);
},
setCondition() {
  this.currentCondition = this.conditions.find(condition => condition.title === this.selectedConditionTitle);
  console.log("Selected Condition:", this.currentCondition);
},

    //END of set methods

    //Method loads communities into local communities list for later selection
    async fetchCommunities() {
      try {
        const communitiesCollection = collection(firebase, 'communities');
        const querySnapshot = await getDocs(communitiesCollection);
        this.communities = querySnapshot.docs.map(doc => ({
            id: doc.id,
            title: doc.data().title,
        }));
        console.log("Communities Fetched")
        } catch (error) {
        console.error("Error fetching communities:", error);
        }
    },
    //Method loads categories into local categories list for later selection
    async fetchCategories() {
      try {
        const categoriesCollection = collection(firebase, 'categories');
        const querySnapshot = await getDocs(categoriesCollection);
        this.categories = querySnapshot.docs.map(doc => ({
            id: doc.id,
            title: doc.data().title,
        }));
        console.log("Categories Fetched")
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    },
    //Method loads conditions into local conditions list for later selection
    async fetchConditions() {
      try {
        const conditionsCollection = collection(firebase, 'productconditions');
        const querySnapshot = await getDocs(conditionsCollection);
        this.conditions = querySnapshot.docs.map(doc => ({
            id: doc.id,
            title: doc.data().title,
        }));
        console.log("Conditions Fetched")
      } catch (error) {
        console.error("Error fetching conditions:", error);
      }
    }

  }
}
</script>


<style>
.dropdown {
  margin: 5px; /* Add margin to create space between dropdowns */
}

option {
  background-color: #53477A; /* Darker option color */
  padding: 10px; /* Added more padding */
  animation: fadeIn ease 0.8s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}
select {
  margin: 10px;
  padding: 15px;
  background: linear-gradient(135deg, #c965c9, #6c6ced);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  appearance: none;
  font-size: 17px;
  font-weight: 500;
  transition: background 0.3s ease-in-out;
  animation: fadeIn ease 0.8s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100%{
    opacity: 1;
  }
}

select:last-child {
  margin-right: 50%;
}

select:first-child{
  margin-left: 7%;
}

select:hover {
  background: linear-gradient(45deg, #4B4070, #7B3F95);
  animation: fadeIn ease 0.8s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* Two columns per row */
  gap: 20px;
  padding: 15px;
  margin: 0 auto;
  width: 100%; /* Adjust the width as needed */
  justify-content: center;
  animation: fadeIn ease 0.8s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}
.center-elements {
  display: flex;
  flex-direction: column;
  align-items: center; /* Center-align content horizontally */
}

.no-products-card {
  width: 100%;
  max-width: 600px; /* or your desired width */
  padding: 20px;
  background-color: #f7f7f9; /* light gray */
  border-radius: 15px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  animation: fadeIn ease 0.8s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}

.no-products-card h2 {
  color: #53477A;
  margin-top: 0;
}

.no-products-card ul {
  list-style-type: none;
  padding: 0;
}

.no-products-card li {
  margin-bottom: 10px;
}

.product-card {
  width: 100%; /* Make the product card 100% wide */
  height: auto;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center; /* Center-align content horizontally */
  padding: 20px; /* Add padding for spacing */
  background-color: #fff; /* Add a background color for better visibility */
  border-radius: 10px; /* Add border-radius for rounded corners */
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); /* Add a subtle box shadow */
}

.dropdowns {
  display:flex;
  justify-content: space-between;  /* spreads items equally across the container */
  margin-top: 1%;
}

.clear-filters-btn {
  margin: 10px;
  padding: 15px;
  background: linear-gradient(135deg, #c965c9, #6c6ced);
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 17px;
  font-weight: 500;
  transition: background 0.3s ease-in-out;
  animation: fadeIn ease 0.8s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}

.clear-filters-btn:hover {
  background: linear-gradient(45deg, #4B4070, #7B3F95);
  animation: fadeIn ease 0.8s;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
}


</style>
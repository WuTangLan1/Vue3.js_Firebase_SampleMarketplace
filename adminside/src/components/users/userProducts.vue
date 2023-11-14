<template>
    <div>
        <h3>{{ uploader ? uploader.username : 'Unknown' }}'s Products</h3>
        <div class ="content-wrapper">

            <div v-if="userProducts.length === 0" class="no-products-card">
                <p>No products have been uploaded yet by {{ uploader ? uploader.username : 'this user' }}.</p>
            </div>

            <div class="products-container" v-else>
        <div 
            v-for="product in paginatedProducts" 
            :key="product.id" 
            class="product-card" 
            :style="{ backgroundColor: lightenColor(getCategoryColor(product.category_title), 0.7) }"
        >
            <div class="product-image">
                <img v-if="product.ProductImages && product.ProductImages.length" :src="product.ProductImages[0]" alt="Product Image" class="product-img">
            </div>
            <div class="product-details">
                <h5 v-html="formattedTitle(product.Title)"></h5>
                <div class="metadata">
                    <span class="tag product-category">{{ product.category_title }}</span>
                    <span class="tag product-community">{{ product.community_title }}</span>
                </div>
            </div>
        </div>
    </div>

            <div class="pagination-controls" v-if="userProducts.length > productsPerPage">
                <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
                <span>Page {{ currentPage }}</span>
                <button @click="nextPage" :disabled="currentPage * productsPerPage >= userProducts.length">Next</button>
            </div>

        </div>
    </div>
</template>


<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
    props: ['uid'],

    setup(props) {
        const store = useStore();

        store.dispatch('fetchProducts');
        store.dispatch('fetchCategories');

        const userProducts = computed(() => {
            return store.state.products.filter(product => product.uploaderUID === props.uid);
        });

        const uploader = computed(() => {
            return store.state.users.find(user => user.id === props.uid);
        });

        const getCategoryColor = (categoryTitle) => {
            const category = store.state.categories.find(cat => cat.title === categoryTitle); 
            if (!category) return "#FFFFFF"; 

            const hash = Array.from(category.id).reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
            const color = (hash & 0x00FFFFFF)
                .toString(16)
                .toUpperCase();
            return "#" + "00000".substring(0, 6 - color.length) + color;
        };

        return {
            userProducts,
            uploader,
            getCategoryColor
        }
    },

    data() {
        return {
            currentPage: 1,
            productsPerPage: 2
        };
    },

    computed: {
        paginatedProducts() {
            const start = (this.currentPage - 1) * this.productsPerPage;
            const end = start + this.productsPerPage;
            return this.userProducts.slice(start, end);
        },
        formattedTitle() {
        return (title) => {
            let words = title.split(' ');
            let line = '';
            let result = '';
            
            for(let word of words) {
                if ((line + ' ' + word).length <= 10) {
                    line += (line ? ' ' : '') + word;
                } else {
                    result += (result ? '<br>' : '') + line;
                    line = word;
                }
            }
            
            if (line) result += (result ? '<br>' : '') + line;
            
            return result;
        }
      }   
    },

    methods: {
        seeMore(productId) {
                    this.$router.push({
                name: 'ProductInfoView',
                params: {
                prodId: productId
                }
            });
        },

        nextPage() {
            if (this.currentPage * this.productsPerPage < this.userProducts.length) {
                this.currentPage++;
            }
        },

        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },
        lightenColor(color, percent) {
    let r = parseInt(color.substring(1, 3), 16);
    let g = parseInt(color.substring(3, 5), 16);
    let b = parseInt(color.substring(5, 7), 16);

    // Calculate the adjustment value for each color component
    const adjust = (amount, color) => {
        return Math.round((255 - color) * amount) + color;
    };

    r = adjust(percent, r);
    g = adjust(percent, g);
    b = adjust(percent, b);

    r = r.toString(16).padStart(2, "0");
    g = g.toString(16).padStart(2, "0");
    b = b.toString(16).padStart(2, "0");

    return `#${r}${g}${b}`;
}
    }
}

</script>

<style scoped>
.product-card {
    width: 240px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    margin-bottom: 10px;
    transition: transform 0.3s, box-shadow 0.3s;
    border: 1px solid transparent;
    cursor: pointer;
    background-color: #f9f9f9; 
}

.product-card:hover {
    transform: translateY(-5px);
    box-shadow: 0px 5px 20px rgba(0, 0, 0, 0.2);
    border: 1px solid #007BFF;
}

.no-products-card {
    width: 100%;
    background-color: #f9f9f9;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: #555;
    text-align: center;
}

.content-wrapper {
    width: 520px; 
    margin: 0 auto; 
}

.products-container {
    display: flex;
    flex-wrap: no-wrap;
    gap: 15px;
    justify-content: space-between;
    background-color: #f5f3e0;
    width: 100%;
    justify-content: center;
}

.pagination-controls {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    margin-top: 20px;
    padding: 10px 0;
    border-top: 1px solid #ddd;
}

.product-card:active {
    transform: translateY(-3px);
    box-shadow: 0px 3px 15px rgba(0, 0, 0, 0.2);
}

.product-image {
    width: 100%;  /* Make image take the full width */
}

.product-img {
    width: 100%;
    object-fit: cover;
    border-radius: 5px 5px 0 0; /* Remove the bottom border-radius */
    max-height: 150px;
}

.product-details {
    flex-direction: row; /* Change to row layout */
    justify-content: space-between; /* Space between title and metadata + See more button */
    align-items: center; /* Vertically center the items */
    width: 100%; /* Take full width */
    padding-top: 10px; /* Add top padding */
}

.product-details h5 {
    font-size: 1em;
    font-weight: bold;
    margin: 0; /* Remove margin */
    flex: 1;  /* Allow title to expand */
    text-align: center; /* Center align the title */
}

.metadata {
    flex-direction: column; /* Stack tags vertically */
    gap: 5px; /* Gap between tags */
    margin-right: 10px; /* Space to the right */
}

.product-details a {
    align-self: center; /* Align self in the center */
    background-color: #007BFF;
    color: white;
    padding: 5px 15px;
    border-radius: 15px;
    cursor: pointer;
    text-decoration: none; /* Removes the default underline for links */
    transition: background-color 0.3s; /* Smooth color transition */
}

.product-details a:hover {
    background-color: #0056b3; /* Darker shade on hover for interaction */
}

.metadata {
    display: flex;
    gap: 10px; /* Creates spacing between the tags */
    justify-content: center; /* Centers the tags */
    align-items: center;
}

.tag {
    display: inline-block;
    padding: 5px 10px;
    border-radius: 15px;
    font-size: 0.85em;
    margin: 3px 2px;
    cursor: pointer;
    transition: background-color 0.3s, color 0.3s;
}

.tag:hover {
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
}

.product-category {
    background-color: #007BFF;
    color: white;
}

.product-category:hover {
    background-color: #0056b3;
}

.product-community {
    background-color: #FFD700;
    color: black;
}

.product-community:hover {
    background-color: #b3a100;
}

.no-products {
    padding: 20px;
    text-align: center;
    font-weight: bold;
    color: red;
}
</style>


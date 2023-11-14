<template>
    <div class="category-container">
        <div class="header-container">
            <h2>Manage Categories</h2>
            <button @click="goToHomePage" class="return-btn">Return to Home</button>
        </div>
        <div class="categories-scroll">
            <div v-for="category in categories" :key="category.id" class="category-item">
                <span>{{ category.title }}</span>
                <button @click="editCategory(category)" class="edit-btn">Edit</button>
                <button @click="deleteCategory(category.id)" class="delete-btn">Delete</button>
            </div>
        </div>

        <div class="pagination-controls">
            <button @click="prevPage" :disabled="currentPage <= 1">Previous</button>
            <span>Page {{ currentPage }} of {{ totalPages }}</span>
            <button @click="nextPage" :disabled="currentPage >= totalPages">Next</button>
        </div>


        <div class="category-form">
        <div class="inputs-container">
            <input v-model="categoryForm.title" placeholder="Category Title" class="category-input">
            <input v-model="categoryForm.description" placeholder="Category Description" class="category-input description-input">
            <button @click="saveCategory" class="category-save-btn">{{ editingCategory ? 'Update' : 'Add' }} Category</button>
        </div>
        <p v-if="validationError" class="error-message">{{ validationError }}</p>
    </div>
    </div>
</template>

<script>
import { firestore } from '@/firebase/index.js';
import { doc, deleteDoc, collection, updateDoc, addDoc } from 'firebase/firestore';

export default {
    name: 'categoryManage',
    data() {
        return {
            categories: [],
            categoryForm: { title: '', description: '' },
            editingCategory: null,
            validationError: null,
            currentPage: 1,  // The current page being displayed
            perPage: 2,      // The number of categories per page
            totalPages: 0    // The total number of pages
        };
    },
    created() {
        this.fetchCategories();
    },
    methods: {
        async fetchCategories() {
            try {
                await this.$store.dispatch('fetchCategories');
                const allCategories = this.$store.state.categories;
                this.totalPages = Math.ceil(allCategories.length / this.perPage);
                this.categories = allCategories.slice((this.currentPage - 1) * this.perPage, this.currentPage * this.perPage);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
                this.fetchCategories();
            }
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.fetchCategories();
            }
        },
        editCategory(category) {
            this.editingCategory = category;
            this.categoryForm = { ...category };
        },
        async deleteCategory(categoryId) {
            try {
                const categoryRef = doc(firestore, 'categories', categoryId);
                await deleteDoc(categoryRef);
                this.fetchCategories();
            } catch (error) {
                console.error("Error deleting category:", error);
            }
        },
        async saveCategory() {
            if (!this.categoryForm.title || !this.categoryForm.description) {
                this.validationError = "Both title and description are required!";
                return;
            }

            this.validationError = null; // Reset the error if there is any

            try {
                const categoryRef = collection(firestore, 'categories');
                if (this.editingCategory) {
                    const categoryToUpdate = doc(firestore, 'categories', this.editingCategory.id);
                    await updateDoc(categoryToUpdate, this.categoryForm);
                } else {
                    await addDoc(categoryRef, this.categoryForm);
                }

                this.editingCategory = null;
                this.categoryForm = { title: '', description: '' };
                this.fetchCategories();
            } catch (error) {
                console.error("Error saving category:", error);
            }
        },
        goToHomePage() {
            this.$router.push({ name: 'HomePage' });
        },
    }
};
</script>

<style scoped>
.category-container {
    font-family: 'Arial', sans-serif;
    padding: 25px;
    background-color: #ffffff;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    margin-bottom: 25px;
    width: 95%;
}

.category-container h2 {
    color: #344955;
    margin-bottom: 30px;
}

.category-form {
    margin-top: 30px;
}

.inputs-container {
    display: flex;
    align-items: flex-end;
    gap: 10px;
}

.category-input {
    flex: 1;
    width: 100%;
    padding: 10px 15px;
    border: 1px solid #b6b6b6;
    border-radius: 4px;
    transition: border-color 0.3s, box-shadow 0.3s;
    margin-bottom: 10px;
}

.category-input:hover {
    border-color: #344955;
    box-shadow: 0 0 5px rgba(52,73,85,0.2);
}

.category-input:focus {
    border-color: #344955;
    box-shadow: 0 0 5px rgba(52,73,85,0.4);
    outline: none;
}

.description-input {
    flex: 2;
}

.category-save-btn {
    width: auto;
    padding: 10px 20px;
    background-image: linear-gradient(to right, #344955, #23333d);
    border: none;
    border-radius: 4px;
    box-shadow: none;
    color: #fff;
    cursor: pointer;
    transition: background-color 0.3s, transform 0.1s;
    margin-left: 15px;
}

.category-save-btn:hover {
    background-image: linear-gradient(to right, #23333d, #1b252d);
}

.category-save-btn:active {
    transform: scale(0.97);
}

.categories-scroll {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 15px; 
    margin-bottom: 20px;
    overflow-y: auto;
}

.category-item {
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.edit-btn, .delete-btn {
    font-size: 14px;
    margin-left: 10px;
    padding: 5px 15px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.edit-btn {
    background-color: #ffa726;
    color: #fff;
}

.delete-btn {
    background-color: #e74c3c;
    color: #fff;
}

.edit-btn:hover {
    background-color: #ff8f00;
}

.delete-btn:hover {
    background-color: #c0392b;
}

.error-message {
    color: #e74c3c;
    margin-top: 10px;
}

.header-container {
    display: flex;
    align-items: center; 
    justify-content: space-between;
    margin-bottom: 20px; 
}

.return-btn {
    padding: 8px 16px; 
    background-color: #344955; 
    color: #fff; 
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.return-btn:hover {
    background-color: #23333d; 
}

.pagination-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
}

.pagination-controls button {
    padding: 8px 16px;
    background-color: #344955;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.pagination-controls button:hover {
    background-color: #23333d;
}

.pagination-controls button:disabled {
    background-color: #b6b6b6;
    cursor: not-allowed;
}

</style>

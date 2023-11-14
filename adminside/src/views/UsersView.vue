<template>
    <div class="user-view">
        <header class="header-section">
            <h1>User's Dashboard</h1>
            <button @click="goToHomePage" class="return-btn">← Return to Home</button>
        </header>
        
        <div class="carousel-container">
            <button class="carousel-btn prev-btn" @click="prevComponent">Previous</button>
            <div class="carousel-content">
                <component :is="currentComponent" :uid="uid"></component>
            </div>
            <button class="carousel-btn next-btn" @click="nextComponent">Next</button>
        </div>
    </div>
</template>

<script>
import UsersProducts from '../components/users/userProducts.vue';
import UserInfo from '../components/users/userInfo.vue';  
import UserNotices from '../components/users/userNotices.vue';  
import UserOffers from '../components/users/userOffers.vue';
import UserNotifs from '../components/users/userNotifications.vue';

export default {
    components: {
        UserInfo, 
        UsersProducts,
        UserNotices,
        UserNotifs,
        UserOffers
    },
    props: {
        uid: {
            type: [String, Number],
            required: true
        }
    },
    data() {
        return {
            components: [ 'UserInfo', 'UsersProducts', 'UserNotices', 'UserNotifs', 'UserOffers' ],  
            currentComponentIndex: 0
        };
    },
    computed: {
        currentComponent() {
            return this.components[this.currentComponentIndex];
        }
    },
    methods: {
        nextComponent() {
            if (this.currentComponentIndex < this.components.length - 1) {
                this.currentComponentIndex++;
            } else {
                this.currentComponentIndex = 0;
            }
        },
        prevComponent() {
            if (this.currentComponentIndex > 0) {
                this.currentComponentIndex--;
            } else {
                this.currentComponentIndex = this.components.length - 1;
            }
        },
        goToHomePage() {
            this.$router.push({ name: 'HomePage' });
        },
    }
}
</script>

<style scoped>
.user-view {
    font-family: 'Arial', sans-serif;
    max-width: 900px; 
    margin: 0 auto;
    padding: 2.5rem; 
    border: 1px solid #ddd;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    background-color: #f2f4f6;
}

.header-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(135deg, #003366, #0066cc);
    color: #fff;
    padding: 25px 30px; 
    border-radius: 5px;
    margin-bottom: 20px;
    position: relative;
    border: none;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

h1 {
    font-weight: bold;
    margin: 0;
    font-size: 1.5em; /* Increased font size */
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2); /* Text shadow for depth */
    text-decoration: underline; /* Add underline */
    z-index: 1;
}

.return-btn {
    background-color: #fff; /* Enhanced for better contrast */
    color: #007BFF;
    border: 1px solid #007BFF; /* Enhanced for aesthetics */
    padding: 10px 20px;  /* Enhanced for a better touch target */
    transition: all 0.2s;  /* Enhanced to smooth the hover transition */
    border-radius: 5px;
    font-size: 0.9em;
}

.return-btn:hover {
    background: linear-gradient(135deg, #833bb0, #cf4b67); /* Slightly darker gradient for hover effect */
    color: #fff;
}

.carousel-container {
    display: flex;
    align-items: center;
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 10px;
    margin-top: 40px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    padding: 15px 15px; 
}


.carousel-content {
    flex-grow: 1;
    min-height: 180px;
    overflow-x: auto;
    display: flex;
    align-items: flex-start; 
    white-space: nowrap;
    padding: 15px;
    width: 520px; 
    margin: 0 auto; 
}
.carousel-btn {
    background: linear-gradient(135deg, #003366, #0066cc); 
    color: #fff;
    width: 100px;
    padding: 0.5rem 1rem;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s;
}

.carousel-btn:hover {
    background: linear-gradient(135deg, #002244, #0055aa);
}


.prev-btn {
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
    /* Removed margin-left for symmetry */
}

.next-btn {
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
}

</style>

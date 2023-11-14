<template>
    <div class="comms-view-container">
        <header class="comms-view-header">
            <button @click="goToHomePage" class="return-btn">Return to Home</button>
            <h2>Community Details</h2>
        </header>

        <div class="content-section">
            <commInfo :commId="commId"/> 
            <commProducts :commId="commId"/> 
        </div>
    </div>
</template>

<script>
import commInfo from '@/components/communities/commInfo.vue'
import commProducts from '@/components/communities/commProducts.vue'

export default {
    components: {
        commInfo,
        commProducts
    },
    props: {
        commId: {
            type: String,
            required: true
        }
    },
    methods: {
        goToHomePage() {
            this.$router.push({ name: 'HomePage' });
        }
    }
}
</script>

<style>
.comms-view-container {
    padding: 2rem;
    background: #FAFAFA;
    border-radius: 8px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    position: relative;
}

.comms-view-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 0 2rem;  /* This padding ensures a consistent look with child components */
}

.content-section {
    display: flex; 
    justify-content: space-between; 
    align-items: flex-start; 
    gap: 2rem; 
}

.return-btn {
    padding: 8px 16px;
    border: none;
    background-color: #007BFF;
    color: white;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
}

.return-btn:hover {
    background-color: #0056b3;
}

h2 {
    margin: 0;
}
</style>

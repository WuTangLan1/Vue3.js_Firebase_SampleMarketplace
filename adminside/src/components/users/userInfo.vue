<template>
    <div class="user-info">
        <div v-if="loading" class="loading">Loading...</div>
        <div v-else-if="user" class="info-wrapper">
            <img 
            :src="user && user.profilePhotoUrl ? user.profilePhotoUrl : '/NoProfile.jpg'"

    alt="User Profile" 
    class="profile-photo"/>
            <div class="info-content">
                <h2>{{ user.username }}</h2>
                <div class="details">
                    <p><strong>First Name:</strong> {{ user.firstName }}</p>
                    <p><strong>Last Middle Name:</strong> {{ user.lastMiddleName }}</p>
                    <p><strong>Role:</strong> {{ user.role }}</p>
                    <p><strong>Contact Number:</strong> {{ user.cellphoneContact }}</p>
                    <p><strong>Identity Number:</strong> {{ user.identityNumber }}</p>
                </div>
            </div>
            <button @click="blockUser" class="block-btn">Block User</button>
        </div>
        <div v-else>No user information available.</div>
    </div>
</template>


<script>
import { mapState } from 'vuex';

export default {
    props: ['uid'],
    data() {
        return {
            user: null,
            loading: false // loading state
        };
    },
    computed: {
        ...mapState(['uploader'])
    },
    async mounted() {
        this.loading = true; // start loading
        await this.$store.dispatch('fetchUploaderByUID', this.uid);
        this.user = this.uploader;
        this.loading = false; // end loading
    },
    watch: {
        async uid(newUid) {
            this.loading = true; // start loading
            await this.$store.dispatch('fetchUploaderByUID', newUid);
            this.user = this.uploader;
            this.loading = false; // end loading
        }
    }
}
</script>
<style scoped>
.user-info {
    display: flex;
    align-items: center;
    padding: 20px;
    border-radius: 10px;
    background-color: #ffffff; 
    margin: 15px 0;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    transition: transform 0.2s, box-shadow 0.2s;
    position: relative;
    width: 100%;
}

.user-info:hover {
    transform: scale(1.01);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.info-wrapper {
    display: flex;
    align-items: center;
    width: 100%;
}

.profile-photo {
    width: 120px;
    height: 120px;
    border-radius: 60px;
    object-fit: cover;
    margin-right: 20px; 
    transition: transform 0.2s;
    border: 3px solid #007BFF;
}

.profile-photo:hover {
    transform: scale(1.05);
}

.info-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;  
}

h2 {
    font-weight: bold;
    color: #333;
    margin-bottom: 20px; 
    text-align: center;  
    text-decoration: underline;  
}

.loading {
    text-align: center;
    padding: 20px;
    font-size: 1.2em;
    color: #007BFF;
    font-weight: bold;
}

.details p {
    margin: 5px 0;
    color: #333;
    transition: color 0.2s;
    font-size: 0.9em;
    display: flex;
    justify-content: space-between;
    width: 100%;  /* adjusted to 100% */
    align-items: center;
}

.details p strong {
    min-width: 160px; 
    display: inline-block;
}

.details p:hover {
    color: #007BFF;
}

.block-btn {
    position: absolute; /* Add this line */
    top: 10px;  /* Add this line */
    right: 10px;  /* Add this line */
    margin-top: 0;  /* Override the existing margin */
    background-color: #f44336;
    color: #fff;
    border: none;
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
}


.block-btn:hover {
    background-color: #d32f2f;  
}
</style>

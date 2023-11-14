<template>
    <div class="notices-container">
        <div v-if="notices.length === 0" class="no-notices-card">
            <p> This user has not current notices</p>
        </div>

        <div v-else>
            <div class="notices-row"> 
                <div 
                    v-for="notice in paginatedNotices" 
                    :key="notice.communityId" 
                    :style="{backgroundColor: getBgColor(notice.communityId)}" 
                    class="notice-card">
                    
                    <h3>{{ notice.title }}</h3>
                    <p><strong>Category:</strong> {{ notice.category_title }}</p>
                    <p><strong>Community: </strong>{{ notice.community_title }}</p>
                    <p class="notice-footer">
                        <span>{{ notice.user_username }}</span>
                        <span><b>{{ notice.resolved ? 'Resolved' : 'Unresolved' }}</b></span>
                    </p>
                </div>
            </div>
            <div class="pagination-controls">
                <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
                <span>Page {{ currentPage }}</span>
                <button @click="nextPage" :disabled="currentPage * noticesPerPage >= notices.length">Next</button>
            </div>
        </div>
    </div>
</template>



<script>
import { mapActions, mapState } from 'vuex';

export default {
    props: ['uid'],

    computed: {
        ...mapState(['notices']),
        paginatedNotices() {
        const start = (this.currentPage - 1) * this.noticesPerPage;
        const end = start + this.noticesPerPage;
        return this.notices.slice(start, end);
    }
    },
    data() {
        return {
            currentPage: 1,
            noticesPerPage: 2
        };
    },

    async mounted() {
    await this.fetchfilteredNotices(this.uid);
},
    methods: {
        ...mapActions(['fetchfilteredNotices']),

        getBgColor(string) {
            let hash = 0;
            for (let i = 0; i < string.length; i++) {
                hash = string.charCodeAt(i) + ((hash << 5) - hash);
            }
            let color = "#";
            for (let i = 0; i < 3; i++) {
                const value = (hash >> (i * 8)) & 0xFF;
                color += ('00' + value.toString(16)).substr(-2);
            }
            return color;
        },
        nextPage() {
            if (this.currentPage * this.noticesPerPage < this.notices.length) {
                this.currentPage++;
            }
        },

        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        }
    }
}
</script>
<style scoped>
.notices-container {
    display: flex;
    flex-direction: column; /* This makes the inner divs stack in a column */
    gap: 20px;
    align-items: center;    /* This centers the child elements horizontally */

}

.notices-row {
    display: flex;
    flex-wrap: wrap;
    min-width:520px;
    gap: 20px;
    width: 100%; /* Use the full width */
    justify-content: center; 
}

.notice-card {
    padding: 20px;
    border-radius: 10px;
    color: white;
    width: calc(50% - 10px); 
    box-sizing: border-box;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.2s, box-shadow 0.2s; 
    cursor: pointer;
    

}

.notice-card:hover {
    transform: scale(1.03);  
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);  
}

.notice-card h3, .notice-card p {
    transition: color 0.2s;  
}
.notice-card:hover h3, .notice-card:hover p {
    color: #eee;  
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

.pagination-controls button {
    cursor: pointer;
    background-color: #007bff;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 5px;
    transition: background-color 0.3s ease;
}

/* New styles for disabled button */
.pagination-controls button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
}

.pagination-controls button:not(:disabled):hover {
    background-color: #0056b3;
}


.notice-card h3 {
    margin-top: 0;
}

.notice-footer {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
}

.no-notices-card {
    padding: 20px;
    border: 2px dashed #ccc;
    border-radius: 10px;
    text-align: center;
    background-color: #f9f9f9;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    width: 100%;
}

.no-notices-card h2 {
    font-size: 1.5em;
    color: #333;
    margin-top: 0;
    margin-bottom: 10px;
}

.no-notices-card p {
    color: #666;
    font-size: 1em;
}
</style>

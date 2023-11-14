<template>
    <div class="comm-info-container">
        <h1 class="community-title">Editing: {{ originalTitle }}</h1>
        <h2>Edit Community Info</h2>
        <div class="input-group">
            <label for="locationInput">Location:</label>
            <input v-model="editableLocation" id="locationInput" type="text" />
        </div>

        <div class="input-group">
            <label for="titleInput">Title:</label>
            <input v-model="editableTitle" id="titleInput" type="text" />
        </div>

        <div class="button-group">
            <button @click="resetChanges" class="btn-reset">Reset</button>
            <button @click="updateInfo" class="btn-update">Update</button>
        </div>

        <p v-if="updateMessage" class="update-message">{{ updateMessage }}</p>
    </div>
</template>
<script>

import { firestore } from '@/firebase/index.js';  
import { collection, doc, getDoc, updateDoc } from 'firebase/firestore';

export default {
    props: {
        commId: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            originalLocation: '',
            originalTitle: '',
            editableLocation: '',
            editableTitle: '',
            updateMessage: ''
        };
    },
    async created() {
        try {
            const docRef = doc(collection(firestore, "communities"), this.commId);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
                this.originalLocation = docSnap.data().location;
                this.originalTitle = docSnap.data().title;
                this.resetChanges();  // Initialize editable fields
            } else {
                console.error("No such document!");
            }
        } catch (error) {
            console.error("Error fetching document:", error);
        }
    },
    methods: {
        resetChanges() {
            this.editableLocation = this.originalLocation;
            this.editableTitle = this.originalTitle;
            this.updateMessage = '';  // Clear any previous messages
        },
        async updateInfo() {
            try {
                const docRef = doc(collection(firestore, "communities"), this.commId);
                await updateDoc(docRef, {
                    location: this.editableLocation,
                    title: this.editableTitle
                });
                this.originalLocation = this.editableLocation; // Update the original values
                this.originalTitle = this.editableTitle;
                this.updateMessage = "Successfully updated the community info!";
            } catch (error) {
                this.updateMessage = "Error updating the community info.";
                console.error("Error updating document:", error);
            }
        }
    },
    mounted() {
        console.log('this da one', this.commId);
    }
}
</script>


<style>
.comm-info-container {
    width: 48%;
    padding: 2rem;
    background: #FAFAFA;
    border-radius: 8px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    animation: fadeIn 0.3s ease-in-out;
}

.input-group {
    width: 90%;
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.input-group label {
    margin-bottom: 0.5rem;
}

.input-group input {
    padding: 0.5rem;
    border: 1px solid #666;
    border-radius: 5px;
    width: 100%;
}

.button-group {
    margin-top: 1rem;
    display: flex;
    gap: 1rem;
}

.community-title {
    color: #2C3E50;
    font-size: 2rem;
    margin-bottom: 1rem;
}

/* Enhanced input focus effect */
.input-group input:focus {
    border: 1px solid #3498DB;
    outline: none;
    box-shadow: 0 0 5px rgba(52, 152, 219, 0.5);
}

/* More modern button look */
button {
    padding: 0.7rem 1.5rem;
    font-size: 0.9rem;
    border-radius: 8px;
    box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.1);
}

.btn-reset {
    background: linear-gradient(135deg, #9c27b0, #673ab7);
    color: #FFF;
}

.btn-update {
    background: linear-gradient(135deg, #004d7a, #006494);
    color: #FFF;
}

button:hover {
    opacity: 0.8;
}

.update-message {
    margin-top: 1rem;
    font-weight: bold;
    color: green; /* assuming successful messages are green, adjust if needed */
}
</style>

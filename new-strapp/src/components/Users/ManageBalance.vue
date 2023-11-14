<template>
    <div class="manage-balance">
      <div class="balance-info">
        Current Balance: {{ user.balance }}
      </div>
      <div class="update-balance">
        <input 
          v-model="amountToAdd"
          type="number"
          placeholder="Enter Amount"
          @input="validateInput"
        >
        <button @click="updateBalance" :disabled="!isValidAmount">+</button>
      </div>
      <div v-if="error" class="error-message">{{ error }}</div>
      <div v-if="success" class="success-message">Balance updated successfully!</div>
    </div>
</template>

<script>
import { doc, updateDoc, increment, getDoc } from 'firebase/firestore';
import { firebase } from '@/firebase/index.js';

export default {
  props: {
    user: Object
  },
  data() {
    return {
      amountToAdd: '',
      error: '',
      isValidAmount: false,
      success: false  // Added this for the success message.
    };
  },
  methods: {
    validateInput() {
      this.error = '';
      let amount = parseFloat(this.amountToAdd);
      if (isNaN(amount) || amount <= 0) {
        this.isValidAmount = false;
        this.error = 'Please enter a valid positive number';
      } else {
        this.isValidAmount = true;
      }
    },
    async updateUserBalance() {
      try {
        const { uid } = this.user;
        const incrementBy = parseFloat(this.amountToAdd);

        const userRef = doc(firebase, 'users', uid);
        await updateDoc(userRef, {
          balance: increment(incrementBy)
        });

        // Fetch updated user data and emit it to the parent.
        const updatedUserDoc = await getDoc(userRef);
        if (updatedUserDoc.exists()) {
          this.$emit('user-updated', updatedUserDoc.data());
          this.$store.dispatch('updateUser', updatedUserDoc.data());
          this.success = true;
          setTimeout(() => {
            this.success = false;
          }, 3000);  // Hide the success message after 3 seconds.
        }

        this.amountToAdd = '';
      } catch (err) {
        this.error = 'Failed to update balance.';
        console.error(err);
      }
    },
    async updateBalance() {
      if (this.isValidAmount) {
        try {
          await this.updateUserBalance();
        } catch (err) {
          this.error = 'Failed to update balance.';
          console.error(err);
        }
      }
    }
  }
};
</script>

  
<style scoped>
.manage-balance {
  padding: 20px;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  background-color: #fbfbfb;
  width: 300px; /* Adjust width as required */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.balance-info {
  font-size: 1.2em;
  font-weight: 500;
  margin-bottom: 20px;
}

.update-balance {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.update-balance input {
  padding: 8px 12px;
  border: 1px solid #d1d1d1;
  border-radius: 4px;
  font-size: 1em;
  transition: border-color 0.3s ease;
}

.update-balance input:focus {
  border-color: #007BFF;
  outline: none;
}

.update-balance button {
  padding: 8px 12px;
  background-color: #007BFF;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.update-balance button:hover {
  background-color: #0056b3;
}

.update-balance button:disabled {
  background-color: #b3c6e2;
  cursor: not-allowed;
}

.error-message, .success-message {
  padding: 10px;
  border-radius: 4px;
  margin-top: 10px;
}

.error-message {
  background-color: #ffe5e5;
  color: #d43f00;
  border: 1px solid #d43f00;
}

.success-message {
  background-color: #e6ffed;
  color: #2d8558;
  border: 1px solid #2d8558;
}
</style>
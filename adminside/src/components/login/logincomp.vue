<template>
    <div class="login-container">
      <h1>Login</h1>
      <div class="input-group">
        <input type="text" placeholder="Email Address" v-model="email" />
        <input type="password" placeholder="Password" v-model="password" />
      </div>
  
      <button class="login-btn" @click="login">Login</button>
      <button class="forgot-password-btn" @click="forgotPassword">Forgot Password?</button>
      <div v-if="error" class="error-message">{{ error }}</div>
    </div>
  </template>

<script>
import { defineComponent } from "vue";
import { auth, firestore } from "@/firebase/index.js";
import { doc, getDoc } from "firebase/firestore";
import router from '@/router/index.js'

export default defineComponent({
  name: "AdminLogin",

  data() {
    return {
      email: "",
      password: "",
      error: null,
    };
  },

  methods: {
    async login() {
      if (!this.email || !this.password) {
        this.error = "Please enter your email and password.";
        return;
      }

      try {
        console.log('1')
        await this.$store.dispatch("login", {
            email: this.email,
            password: this.password,
        });
        await new Promise(resolve => setTimeout(resolve, 300));

        const uid = auth.currentUser.uid;
        const userDoc = await getDoc(doc(firestore, "users", uid));
        const user = userDoc.data();


        if (user.role !== "admin") {
          throw new Error("You are not authorized to access the admin portal.");
        }
        
        this.$store.commit("setUser", user);
        
        router.push("/"); 
      } catch (error) {
        this.error = error.message;
      }
    },
  },
});
</script>


<style scoped>
.login-container {
    width: 350px;
    margin: 0 auto;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    background-color: #f4f4f4;
}

h1 {
    text-align: center;
    margin-bottom: 20px;
}

.input-group {
    display: flex;
    flex-direction: column;
    gap: 15px;
    align-items: center;
}

input {
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 15px;
    outline: none;
    transition: border-color 0.3s;
    background-color: #e9e9e9;
}

input:focus {
    border-color: #007bff;
}

.error-message {
    margin-top: 10px;
    color: #f00;
    font-weight: 600;
    text-align: center;
}

button.login-btn {
    margin-top: 20px;
    padding: 12px 18px;
    background: linear-gradient(90deg, #0056b3 0%, #003f8f 100%);
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

button.forgot-password-btn {
margin-top: 10px;
background: none;
color: #0056b3;
border: none;
cursor: pointer;
text-decoration: underline;
font-weight: normal;
font-size: 14px;
transition: color 0.3s;
outline: none;
}

button.forgot-password-btn:hover {
color: #003f8f;
}


button.login-btn:hover {
    background: linear-gradient(90deg, #003f8f 0%, #002b70 100%);
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
}

button.login-btn:active {
    background: linear-gradient(90deg, #002b70 0%, #001955 100%);
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
    transform: translateY(1px);
}
</style>

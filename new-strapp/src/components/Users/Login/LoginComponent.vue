<template>
  <div class="login-container">
    <h1>Login</h1>
    <div class="input-group">
      <input type="text" placeholder="Email Address" v-model="email" />
      <input type="password" placeholder="Password" v-model="password" />
    </div>

    <button class="login-btn" @click="login">Login</button>
    <button class="forgot-password-btn" @click="forgotPassword">Forgot Password?</button>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { auth, firebase} from '@/firebase/index.js'
import {  doc, getDoc} from "firebase/firestore";





export default defineComponent({
  name: "LoginComp",

  data() {
    return {
      email: "",
      password: "",
    };
  },

  methods: {


    async login() {
      if (!this.email|| !this.password) {
        return;
      }

      try {


        
         await this.$store.dispatch("login", {
          email: this.email,
          password: this.password,
        });


        const nowauth = auth;
        const uid = nowauth.currentUser.uid;
        const userDoc = await getDoc(doc(firebase, 'users', uid));
        const newUser = userDoc.data();

        const email =this.email;
        const password = this.password;

          this.$store.commit('setUser', {
            email,
            password,
            ...newUser
          });


      } catch (error) {
        console.log(error)
      }
    },
async forgotPassword() {
          if (!this.email) {
            alert("Please enter your email.");
            return;
          }
          
          try {
            await this.$store.dispatch("sendPasswordReset", this.email);
            alert("Password reset link has been sent to your email.");
          } catch (error) {
            console.error("Error sending password reset email:", error);
            alert("Failed to send password reset email.");
          }
        }
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
  background: linear-gradient(135deg, #c965c9, #6c6ced); /* Match the sidebar's background */
  color: white; /* Set text color to white */
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #fff;
  font-family: Impact; /* Darken the header text color */
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
}

input {
  padding: 12px;
  border: 1px solid #fff;
  border-radius: 4px;
  font-size: 15px;
  outline: none;
  transition: border-color 0.3s;
  background-color: #fff; /* Match the sidebar's background */
  width: 100%;
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
  background: linear-gradient(135deg, #c965c9, #6c6ced); /* Match the sidebar's background */
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
  color: #fff; /* Use the primary color from your sidebar for consistency */
  border: none;
  cursor: pointer;
  text-decoration: underline;
  font-weight: normal;
  font-size: 14px;
  transition: color 0.3s;
  outline: none;
}

button.forgot-password-btn:hover {
  color: #6c6ced; /* Adjust the color on hover to match the sidebar's hover effect */
}

button.login-btn:hover {
  background: linear-gradient(135deg, #6c6ced, #3a3ab1); /* Match the sidebar's background */
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}

button.login-btn:active {
  background: linear-gradient(135deg, #3a3ab1, #1a1a80); /* Match the sidebar's background */
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
  transform: translateY(1px);
}
</style>

  
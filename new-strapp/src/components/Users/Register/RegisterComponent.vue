<template>
  <form @submit.prevent="handleSubmit">
    <div class="register-container">
      <h1>Register</h1>

      <div class="input-group">
        <input
          type="text"
          placeholder="First Name"
          name="firstname"
          required
          v-model="firstName"
        />

        <input
          type="text"
          placeholder="Last Middle Name"
          name="lastmiddlename"
          required
          v-model="lastMiddleName"
        />

        <input
          type="email"
          placeholder="Email Contact"
          name="email"
          required
          v-model="email"
        />

        <input
          type="tel"
          placeholder="Cellphone Contact"
          name="cellphonecontact"
          required
          v-model="cellphoneContact"
        />

        <input
          type="text"
          placeholder="Username"
          name="username"
          required
          v-model="username"
        />

        <input
          type="password"
          placeholder="Password"
          name="password"
          required
          v-model="password"
        />

        <input
        type="file"
        name="profilePhoto"
        accept="image/*"
        @change="handlePhotoChange"
      />

        <input
          type="text"
          placeholder="Identity Number"
          name="identitynumber"
          required
          v-model="identityNumber"
        />

        <input type="submit" class="button.register-btn" />

        <div v-if="error">{{ error }}</div>
      </div>
    </div>
  </form>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { firebase, storage } from "@/firebase/index.js";
import { getDownloadURL, ref as storageRef, uploadBytes } from "firebase/storage";
import { setDoc, doc } from "firebase/firestore";
import {uuid} from 'vue-uuid'

export default {
  setup() {
    const email = ref("");
    const password = ref("");
    const firstName = ref("");
    const lastMiddleName = ref("");
    const cellphoneContact = ref("");
    const username = ref("");
    const identityNumber = ref("");
    const profilePhoto = ref(null);

    const store = useStore();
    const router = useRouter();
    const error = ref(null);

    const handlePhotoChange = (event) => {
          profilePhoto.value = event.target.files[0];
        };

    const handleSubmit = async () => {
  try {
    const user = await store.dispatch("signup", {
      email: email.value,
      password: password.value,
    });

    const newUserObject = {
      uid: user.uid,
      documentId: user.uid,
      firstName: firstName.value,
      lastMiddleName: lastMiddleName.value,
      username: username.value,
      cellphoneContact: cellphoneContact.value,
      identityNumber: identityNumber.value,
      role : "client",
      favorites: [""],
      balance: 20000,
    };

    // If a profile photo has been chosen by the user
    if (profilePhoto.value) {
    const tempid = uuid.v1();
    const photoRef = storageRef(storage, `profile_photos/${tempid}`);
    await uploadBytes(photoRef, profilePhoto.value)
    newUserObject.profilePhotoUrl = await getDownloadURL(photoRef)
    }


    await setDoc(doc(firebase, "users", user.uid), newUserObject);
    store.commit('setUser', {
      email: user.email,
      password: user.password,
      ...newUserObject,
    });

    router.push("/");
  } catch (err) {
    error.value = err.message;
  }
};

    return {
      handleSubmit,
      handlePhotoChange,
      email,
      password,
      error,
      firstName,
      lastMiddleName,
      cellphoneContact,
      username,
      identityNumber,
    };
  },
};
</script>

  
<style scoped>
.register-container {
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
  font-family: Impact;
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

button.register-btn {
  margin-top: 20px;
  padding: 12px 18px;
  background: linear-gradient(135deg, #c965c9, #6c6ced); /* Match the sidebar's background */
  color: #6c6ced;
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

button.register-btn:hover {
  background: linear-gradient(135deg, #6c6ced, #3a3ab1); /* Match the sidebar's background */
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}

button.register-btn:active {
  background: linear-gradient(135deg, #3a3ab1, #1a1a80); /* Match the sidebar's background */
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
  transform: translateY(1px);
}
</style>



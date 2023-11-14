<template>
  <div class="admin-container">
      <!-- Return Home Button at top right -->
      <button @click="goToHomePage" class="return-btn">Return to Home</button>
      
      <form @submit.prevent="handleSubmit" class="admin-form">
          <h1>Load Admin</h1>

          <div class="input-group">
              <div class="input-row">
                  <input type="text" placeholder="First Name" v-model="firstName" required />
                  <input type="text" placeholder="Last Middle Name" v-model="lastMiddleName" required />
              </div>
              <div class="input-row">
                  <input type="email" placeholder="Email Contact" v-model="email" required />
                  <input type="tel" placeholder="Cellphone Contact" v-model="cellphoneContact" required />
              </div>
              <div class="input-row">
                  <input type="text" placeholder="Username" v-model="username" required />
                  <input type="password" placeholder="Password" v-model="password" required />
              </div>
              <div class="input-row">
                  <input type="file" accept="image/*" @change="handlePhotoChange" class="photo-input"/>
                  <input type="text" placeholder="Identity Number" v-model="identityNumber" required />
              </div>
          </div>

          <input type="submit" class="button load-btn" value="Load Admin" />

          <div v-if="message" class="message">{{ message }}</div>
      </form>
  </div>
</template>

  
<script>
import { ref } from "vue";
import { firestore, storage, auth } from "@/firebase/index.js"; // added auth
import { createUserWithEmailAndPassword } from "firebase/auth"; // added this line
import { getDownloadURL, ref as storageRef, uploadBytes } from "firebase/storage";
import { setDoc, doc } from "firebase/firestore";
import { uuid } from 'vue-uuid';

export default {
  setup() {

    const message = ref(null);
    const firstName = ref("");
    const lastMiddleName = ref("");
    const email = ref("");
    const cellphoneContact = ref("");
    const username = ref("");
    const password = ref("");
    const identityNumber = ref("");
    const photo = ref(null);

    const handlePhotoChange = (e) => {
      photo.value = e.target.files[0];
    };

    const uploadPhoto = async () => {
      if (!photo.value) return null;

      const path = `profile_photos/${uuid.v4()}`;
      const storageReference = storageRef(storage, path);
      await uploadBytes(storageReference, photo.value);
      return getDownloadURL(storageReference);
    };

    const handleSubmit = async () => {
      try {
        const credential = await createUserWithEmailAndPassword(auth, email.value, password.value);
        const user = credential.user;

        if (user) {
          console.log(photo.value)
          const photoURL = await uploadPhoto();

          const newUserObject = {
            role: "admin",
            email: email.value,
            firstName: firstName.value,
            lastMiddleName: lastMiddleName.value,
            cellphoneContact: cellphoneContact.value,
            username: username.value,
            identityNumber: identityNumber.value,
            profilePhotoUrl: photoURL,
            uid: user.uid
          };

          await setDoc(doc(firestore, "users", user.uid), newUserObject);

          message.value = "Admin loaded successfully!";
          setTimeout(() => {
            this.$router.push({ name: 'HomePage' });
          }, 2000);
        }

      } catch (err) {
        message.value = err.message;
      }
    };

    return {
      handleSubmit,
      message,
      firstName,
      lastMiddleName,
      email,
      cellphoneContact,
      username,
      password,
      identityNumber,
      handlePhotoChange,
    };
  },

  methods : {
    goToHomePage() {
            this.$router.push({ name: 'HomePage' });
        },
  }
};
</script>


<style scoped>
.admin-container {
    width: 720px;
    margin: 2em auto;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    background-color: #f4f4f4;
    position: relative;
}

.return-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 8px 16px; 
    background-color: #344955; 
    color: #fff; 
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
    font-weight: 600;
}

.return-btn:hover {
    background-color: #23333d; 
}

.admin-form h1 {
    color: #344955;
    font-weight: 700;
    margin-bottom: 25px;
    text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
}

.input-group {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.input-row {
    display: flex;
    justify-content: space-between;
    gap: 20px;
}

input {
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 15px;
    outline: none;
    transition: border-color 0.3s, box-shadow 0.2s;
    background-color: #e9e9e9;
    width: 48%; 
    box-shadow: 0 1px 3px rgba(0,0,0,0.05) inset;
}

.photo-input {
    width: 100%;
}

input:focus {
    border-color: #007bff;
    box-shadow: 0 2px 6px rgba(0,120,255,0.2);
}

.message {
    margin-top: 10px;
    color: #f00;
    font-weight: 600;
    text-align: center;
}

.button.load-btn {
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
    width: 100%;
}

.button.load-btn:hover {
    background: linear-gradient(90deg, #003f8f 0%, #002b70 100%);
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}

.button.load-btn:active {
    background: linear-gradient(90deg, #002b70 0%, #001955 100%);
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
}

</style>

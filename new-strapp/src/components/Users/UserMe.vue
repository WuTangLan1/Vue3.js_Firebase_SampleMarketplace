<template>
  <div class="profile-container">
    <h1>{{ user.firstName }} {{ user.lastMiddleName }}</h1>
    
    <img
      v-if="user.profilePhotoUrl"
      :src="user.profilePhotoUrl"
      alt="Profile Photo"
      class="profile-photo"
    />
    <br><br>
    <div class="card">
      <div class="card-body">
        <button v-if="!isEditMode" @click="enableEditMode" class="btn btn-primary">Edit Profile</button>
        <form v-if="isEditMode" @submit.prevent="updateProfile">
          <!-- Removed the profile photo edit option -->

          <div class="form-group">
            <label for="firstName">First Name</label>
            <input type="text" class="form-control read-only" id="firstName" v-model="user.firstName" readonly />
          </div>

          <div class="form-group">
            <label for="lastMiddleName">Last Middle Name</label>
            <input type="text" class="form-control read-only" id="lastMiddleName" v-model="user.lastMiddleName" readonly />
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" class="form-control" id="email" v-model="user.email" />
          </div>

          <div class="form-group">
            <label for="cellphoneContact">Cellphone Contact</label>
            <input type="tel" class="form-control" id="cellphoneContact" v-model="user.cellphoneContact" />
          </div>

          <div class="form-group">
            <label for="username">Username</label>
            <input type="text" class="form-control" id="username" v-model="user.username" />
          </div>

          <div class="form-group">
            <label for="identityNumber">Identity Number</label>
            <input type="text" class="form-control read-only" id="identityNumber" v-model="user.identityNumber" readonly />
          </div>

          <div class="button-container">
            <button type="button" @click="cancelEdit" class="btn btn-secondary">Cancel</button>
            <button type="submit" class="btn btn-primary">Update Profile</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>



<script>
import { firebase, auth } from "@/firebase/index.js";
import { defineComponent } from "vue";
import { updateDoc, doc } from "firebase/firestore";
import clonedeep from "lodash/cloneDeep";
import { updateEmail } from "firebase/auth";

export default defineComponent({
  name: "ProfileComp",
  data() {
    return {
      isEditMode: false,
      Baseuser: null,
      user: {
        uid: "",
        firstName: "",
        lastMiddleName: "",
        email: "",
        cellphoneContact: "",
        username: "",
        identityNumber: "",
        password: "",
        profilePhotoUrl: "",
        favorites: []
      },
      errorMessage: "",
      selectedPhotoFile: null,
    };
  },
  methods: {
    triggerPhotoInput() {
    const photoInput = document.getElementById('profilePhoto');
    photoInput.click();
},
    enableEditMode() {
      this.isEditMode = true;
    },
    cancelEdit() {
      this.isEditMode = false;
      // Reset the form fields to their original values
      this.user = clonedeep(this.Baseuser);
    },
    async updateProfile() {
      const gotAuth = auth;

      if (this.Baseuser.email !== this.user.email) {
        await updateEmail(gotAuth.currentUser, this.user.email);
      }

      const userRef = doc(firebase, "users", this.user.uid);

      if (this.selectedPhotoFile) {
        const storageRef = firebase.storage().ref();
        const photoRef = storageRef.child(`profile_photos/${this.user.uid}`);
        await photoRef.put(this.selectedPhotoFile);
        this.user.profilePhotoUrl = await photoRef.getDownloadURL();
    }

      if (
        this.Baseuser.cellphoneContact != this.user.cellphoneContact ||
        this.Baseuser.firstName != this.user.firstName ||
        this.Baseuser.username != this.user.username ||
        this.Baseuser.identityNumber != this.user.identityNumber
      ) {
        const pushUser = this.user;

        delete pushUser.email;
        delete pushUser.password;
        await updateDoc(userRef, pushUser);
        await this.$router.push({
          name: "Home",
          path: "/",
        });
      } else {
        console.log("nothing changed");
        // need to enter some sort of display modal in here.
      }

      this.errorMessage = "";
    },
    handlePhotoChange(event) {
    // Assign the selected photo to a local variable but do not upload yet
    this.selectedPhotoFile = event.target.files[0];
    },
  },
  async created() {
    this.user = await this.$store.getters.thisUser;
    this.Baseuser = clonedeep(this.user);
  },
});
</script>


<style scoped>
.profile-container {
  width: 600px;
  margin: 0 auto;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: #ccc;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #fff;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

label {
  font-weight: bold;
  margin-bottom: 5px;
}

input {
  padding: 10px;
  border: 1px linear-gradient(135deg, #c965c9, #6c6ced);
  border-radius: 4px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s;
  background-color: linear-gradient(135deg, #c965c9, #6c6ced);
}

#profilePhoto {
  display: none;
}

.change-photo-button {
  margin-top: 10px;
}

input:focus {
  border-color: #007bff;
}

.profile-photo {
  max-width: 200px;
  max-height: 200px;
}

.error-message {
  margin-top: 10px;
  color: #f00;
  font-weight: 600;
  text-align: center;
}

button {
  margin-top: 20px;
  padding: 10px 15px;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
  letter-spacing: 0.8px;
  font-size: 16px;
  outline: none;
}

button:hover {
  background-color: linear-gradient(135deg, #6c6ced, #3a3ab1);
}


.button-container {
  display: flex;
  margin-top: 40px;
  gap: 20px;
  margin-right: 10px;
  justify-content: center;
  background-color: linear-gradient(135deg, #c965c9, #6c6ced);
}

button:active {
  background-color: linear-gradient(135deg, #6c6ced, #3a3ab1);
}
.card-body button {
  padding: 10px 15px;
  background-color: linear-gradient(135deg, #c965c9, #6c6ced);
  color: #fff;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease-in-out;
  letter-spacing: 0.8px;
  font-size: 16px;
  outline: none;
}
.read-only {
  pointer-events: none;
  background-color: #fff;
}
</style>

  
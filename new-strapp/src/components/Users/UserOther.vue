<template>
  <div class="card">
    <div class="header">
      <p>This is where we will call the specific user: <!--{{ user.Id }}--></p>
    </div>
    <div class="user-info">
      <p>Name: <!--{{ user.FirstName }} {{ user.LastMiddleName }}--></p>
    </div>
    <div class="account-rating">
      <p><!--{{ rating }}--></p>
    </div>
    <div class="reviews">
      <p>This will theoretically be a list of the reviews that are stored in the account</p>
    </div>
  </div>
</template>

<script>
import Store from '@/store/index.js'
  export default {
    props: ['id'],
    mounted(){
      console.log(this.id)
      console.log(Store.getters.getUserById(this.id))
    }
  }
</script>

<style>
.card {
  background-color: #f0f0f0;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 16px;
}

.header {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
}

.user-info {
    padding: 2px;
    background-color: #e6b4b4;
}

.account-rating {
    padding: 2px;
    background-color: #a27aff;
}

.reviews {
    padding: 2px;
    background-color: #efffc6;
}
</style>

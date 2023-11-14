<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  overflow: hidden;
  padding: 0;
  margin: 0;
}

.component-heading {
  margin: 0 auto; /* This centers the heading */
  font-size: 1.5em;
  color: #ffffff;
  align-self: center;
  align-content: center;
  font-weight: 600;
  background-color: #3f51b5;
  padding: 10px 20px;
  border-radius: 8px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  width: fit-content;
}

.global-table {
  max-width: 100%;
  background: #FFF;
  border: 2px solid #333;
  border-collapse: collapse; 
}

.global-table th, .global-table td {
    padding: 10px;
    border: 1px solid #666;
    text-align: left;
    align-items: center;  /* vertically centers the content */
    justify-content: center;
}

.global-table th {
  background-color: #007BFF;
  color: #FFF;
  cursor: pointer;
  padding: 15px 10px; 
  font-weight: bold; 
  text-transform: uppercase;
  letter-spacing: 1px; 
  transition: background-color 0.3s;
}

.global-table th:hover {
  background-color: #0056b3;
}
</style>

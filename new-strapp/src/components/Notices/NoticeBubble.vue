<template>
  <div class="bubble" :style="bubbleStyle" @click="handleClick">
    <h3>{{ truncatedTitle }}</h3>
    <p>{{ truncatedDescription }}</p>
    <footer>
      <span>{{ notice.user_username }}</span>
    </footer>
  </div>
</template>

  
<script>
export default {
  props: {
    notice: {
      type: Object,
      required: true
    },
    background: {
      type: String,
      required: true
    }
  },
  computed: {
    bubbleStyle() {
      return {
        backgroundColor: this.background,
      };
    },
    truncatedTitle() {
      return this.notice.title.length > 30 ? this.notice.title.substring(0, 30) + '...' : this.notice.title;
    },
    truncatedDescription() {
      return this.notice.description.length > 70 ? this.notice.description.substring(0, 70) + '...' : this.notice.description;
    },
  },
  methods: {
    handleClick() {
      // Handle the main click on the bubble, if required in the future
    }
  }
};

</script>


<style>

.bubble {
  padding: 10px;
  border-radius: 75px;  /* Half of width and height to make it a circle */
  width: 150px;
  height: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  margin: 15px;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  position: relative;
  overflow: hidden;
}

.bubble h3 {
  font-size: 1.1em;
  margin-bottom: 8px;
  max-width: 90%;
  white-space: normal;
}

.bubble p {
  margin: 0 0 8px 0;
  max-width: 90%;
  white-space: normal;
  overflow-wrap: break-word;
}

.bubble footer {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;  /* Center the username since "See More" is removed */
  font-size: 0.9em;
  color: gray;
  width: 100%;
  padding: 0 10px;
}

</style>
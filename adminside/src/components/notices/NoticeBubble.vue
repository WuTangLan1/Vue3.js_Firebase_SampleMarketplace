<template>
  <div class="bubble" :style="bubbleStyle">
    <span class="status-icon" v-text="statusIcon"></span>
    <h3>{{ truncatedTitle }}</h3>
    <p>{{ truncatedDescription }}</p>
    <footer>
      <span>{{ notice.user_username }}</span>
    </footer>
    <span class="upload-date"><b>{{ formattedDate }}</b></span>
    <span class="delete-icon" @click.stop="promptDelete">&#10005;</span>
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
    formattedDate() {
      if (!this.notice.uploadDate) return '';
      
      // Check if the uploadDate is an ISO string or a Firestore Timestamp
      let date = (typeof this.notice.uploadDate === 'string')
                  ? new Date(this.notice.uploadDate)
                  : this.notice.uploadDate.toDate(); // Convert Firestore Timestamp to JS Date

      return date.toLocaleDateString();
    },
    statusIcon() {
      return this.notice.resolved ? '✓' : '❓';
    },
  },
  methods: {
    promptDelete() {
      if (window.confirm("Are you sure you want to delete this notice?")) {

        this.$emit('deleteNotice', this.notice.id);
      }
    },
  }
};
</script>

<style>
.bubble {
  padding: 10px;
  border-radius: 75px;
  width: 150px;
  height: 150px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  margin: 15px;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.bubble:hover {
  transform: scale(1.03) rotate(3deg);
  box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.1);
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
  justify-content: center;
  font-size: 0.9em;
  color: gray;
  width: 100%;
  padding: 0 10px;
}

.upload-date {
  position: absolute;
  bottom: 5px;
  right: 5px;
  font-size: 0.8em;
  color: gray;
}

.delete-icon {
  position: absolute;
  top: 5px;
  right: 5px;
  cursor: pointer;
  font-weight: bold;
  color: black;
}

.bubble:hover .delete-icon {
  color: red;
}

.status-icon {
  position: absolute;
  top: 5px;
  left: 5px;
  font-size: 16px;
  font-weight: bold;
}
</style>

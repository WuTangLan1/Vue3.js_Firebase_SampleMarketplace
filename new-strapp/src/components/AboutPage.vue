<template>
  <div class="about-page-container">
    <div class="section" @click="toggleSection('about')" :class="{ active: expandedSection.includes('about') }">
      <h1>WHO ARE WE?</h1>
      <div class="section-content" v-if="expandedSection.includes('about')">
        <div class="content-box">
          <p>
            We are a tech startup that is passionate about helping community members safely connect and transact with each other.
          </p>
          <p>
            We are building safe, connected, transactional communities to make it easier and more sustainable to rent and borrow what you need from those around you.
          </p>
          <p>
            Empowering communities to become more connected through shared ownership.
          </p>
        </div>
      </div>
    </div>

    <div class="section" @click="toggleSection('mission')" :class="{ active: expandedSection.includes('mission') }">
      <h1>THE MISSION</h1>
      <div class="section-content" v-if="expandedSection.includes('mission')">
        <div class="content-box">
          <div class="mission-section">
            <div class="mission-item">
              <img src="@/assets/Flexible.jpg" alt="Flexible" />
              <p><strong>Flexible:</strong> INCREASE ACCESS</p>
              <p>The first safe peer-2-peer transactional marketplace in Africa.</p>
            </div>
            <div class="mission-item">
              <img src="@/assets/Safety.jpg" alt="Safety" />
              <p><strong>Safety:</strong> TO PROVIDE A SAFE AND CENTRAL PLATFORM</p>
              <p>We are making it safer and easier than ever to transact with others in your community by connecting you to your neighbors in one central place.</p>
            </div>
            <div class="mission-item">
              <img src="@/assets/Collaboration.jpg" alt="Collaboration" />
              <p><strong>Collaborative:</strong> TO BUILD TRANSACTIONAL COMMUNITIES</p>
              <p>We believe humans were meant to share and collaborate, that’s why we are making it easier to connect with those around you.</p>
            </div>
            <div class="mission-item">
              <img src="@/assets/Friendly.jpg" alt="Friendly" />
              <p><strong>Friendly:</strong> TO DECREASE OVERPRODUCTION</p>
              <p>Reduce the strain on the environment by decreasing the reliance on overproduced items and use what others already own.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="section" @click="toggleSection('goal')" :class="{ active: expandedSection.includes('goal') }">
      <h1>THE GOAL</h1>
      <div class="section-content" v-if="expandedSection.includes('goal')">
        <div class="content-box">
          <p>
            We want to redefine what it means to use and to own. Gone are the days of wasted purchases and scarcity. We should be able to leverage our communities so that scarcity is replaced with access.
          </p>
        </div>
      </div>
    </div>
    
    <div class="section" @click="toggleSection('team')" :class="{ active: expandedSection.includes('team') }">
      <h1>THE TEAM</h1>
      <div class="section-content" v-if="expandedSection.includes('team')">
        <div class="content-box">
          <div class="team-members">
            <div class="team-member">
              <img src="@/assets/Darren.jpg" alt="Darren" />
              <p><strong>Darren De Abreu</strong></p>
              <p>Co-Founder and Head of Growth</p>
              <p>“If you aren’t failing, you aren’t trying hard enough”</p>
            </div>
            <div class="team-member">
              <img src="@/assets/Jamie.jpg" alt="Jamie" />
              <p><strong>Jamie Seymour</strong></p>
              <p>Co-Founder and Head of Product Development</p>
              <p>“Great things never come from comfort zones”</p>
            </div>
            <div class="team-member">
              <img src="@/assets/Aidan.jpg" alt="Aidan" />
              <p><strong>Aidan Katzef</strong></p>
              <p>Head Developer</p>
              <p>“If opportunity doesn't knock, build a door”</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "AboutPage",
  data() {
    return {
      expandedSection: ['about', 'mission', 'goal', 'team'], // All sections are expanded by default
    };
  },
  methods: {
    toggleSection(section) {
      // Toggle the section's visibility
      if (this.expandedSection.includes(section)) {
        this.expandedSection = this.expandedSection.filter(item => item !== section);
      } else {
        this.expandedSection.push(section);
      }
    },
  },
};
</script>

<style scoped>
/* Section styles */
.section {
  background-color: #f1facd;
  padding: 20px;
  margin-bottom: 20px;
  cursor: pointer;
  border-radius: 8px;
  transition: background-color 0.3s ease;
  border: 1px solid #ccc; /* Add a gray border */
  background: linear-gradient(135deg, #c965c9, #6c6ced);
}

/* Header styles */
.section h1 {
  color: white;
  margin-bottom: 10px;
}

/* Content box styles */
.content-box {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

/* Display section content when active */
.section.active .section-content {
  display: block;
}

/* Additional styling for section content */
.section-content {
  display: block; /* Always display section content */
  margin-top: 10px;
}

/* Mission section styles */
.mission-section {
  display: flex;
  justify-content: space-between; /* Horizontally divide the mission items */
}

.mission-item {
  flex-basis: calc(24% - 10px); /* Set each mission item to take up one-fourth of the space with spacing in between */
  text-align: center;
}

.mission-item img {
  max-width: 100px;
  max-height: 100px;
  margin-bottom: 10px;
}
/* Team section styles */
.team-members {
  display: flex;
  flex-direction: row; /* Display team members in a row */
  justify-content: space-between; /* Add space between team members */
}

.team-member {
  flex-basis: calc(33.33% - 20px); /* Set each team member to take up one-third of the space with spacing in between */
  text-align: center;
}

.team-member img {
  max-width: 100px;
  max-height: 100px;
  margin-bottom: 10px;
}
</style>


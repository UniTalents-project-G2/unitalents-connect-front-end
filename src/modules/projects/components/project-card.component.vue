<script>
export default {
  name: 'project-card',
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  computed: {
    statusClass() {
      return {
        'en-curso': this.project.status === 'En curso',
        'finalizado': this.project.status === 'Finalizado',
        'pendiente': this.project.status === 'Pendiente'
      }
    },
    displayedSkills() {
      if (!this.project.skills || this.project.skills.length === 0) return [];
      const maxSkills = 3;
      if (this.project.skills.length <= maxSkills) return this.project.skills;
      return [
        ...this.project.skills.slice(0, maxSkills),
        `+${this.project.skills.length - maxSkills} más`
      ];
    }
  }
}
</script>

<template>
  <div class="project-card">
    <div class="header">
      <h3>{{ project.title }}</h3>
      <span :class="['status', statusClass]">{{ project.status }}</span>
    </div>
    <p class="field">Área: {{ project.field }}</p>

    <div v-if="project.skills && project.skills.length > 0" class="skills-container">
      <div class="skills-list">
        <span v-for="(skill, index) in displayedSkills" :key="index"
              :class="['skill-tag', { 'more-skills': index >= 3 }]">
          {{ skill }}
        </span>
      </div>
    </div>

    <p class="description">{{ project.description }}</p>
    <div class="actions">
      <router-link :to="`/manager/projects/${project.id}`">
        <button class="view-btn">Ver más</button>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.project-card {
  background: #fff;
  border: 2px solid #1c1f2b;
  border-radius: 10px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  font-family: 'Inter', sans-serif;
}

.status {
  padding: 0.25rem 0.5rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
}

.status.en-curso {
  background-color: #FFD479;
  color: #1c1f2b;
}

.status.finalizado {
  background-color: #d4d4d4;
  color: #1c1f2b;
}

.status.pendiente {
  background-color: #c9d8f0;
  color: #1c1f2b;
}

.field, .description {
  margin: 0;
  font-size: 0.9rem;
  color: #555;
  font-family: 'Nunito', sans-serif;
}

.actions {
  margin-top: 1rem;
}

.view-btn {
  background: #FFD479;
  color: #1c1f2b;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  width: 100%;
  font-family: 'Inter', sans-serif;
}

.view-btn:hover {
  background-color: #ffc84c;
}

.skills-container {
  margin: 0.25rem 0;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skill-tag {
  background-color: #e0e7ff;
  color: #1c1f2b;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
}

.skill-tag.more-skills {
  background-color: #f3f4f6;
  color: #6b7280;
}

.description {
  margin-top: 0.5rem;
}

@media (max-width: 768px) {
  .project-card {
    padding: 1rem;
  }

  h3 {
    font-size: 1rem;
  }
}
</style>
<template>
  <div
      class="portfolio-card"
      @click="goToProject"
  >
    <h3 class="card-title">{{ project.title }}</h3>
    <div class="skills-container">
      <span
          v-for="(skill, index) in project.skills"
          :key="index"
          class="skill-tag"
      >
        {{ skill }}
      </span>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';

export default {
  name: 'PortfolioItem',
  props: {
    project: {
      type: Object,
      required: true,

    },
    userType: {
      type: String,
      default: 'student',
    }
  },
  setup(props) {
    const router = useRouter();

    const goToProject = () => {


      if (props.userType === 'manager') {
        router.push({
          name: 'ManagerProjectDetail',
          params: { id: props.project.id }
        });
      } else {
        router.push({
          name: 'StudentProjectDetail',
          params: { id: props.project.id }
        });
      }
    };

    return { goToProject };
  }
};
</script>
<style scoped>
.portfolio-card {
  background: white;
  border-radius: 8px;
  padding: 1.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.2s ease;
}

.portfolio-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card-title {
  margin: 0 0 0.75rem 0;
  color: #1C1F2B;
  font-size: 1.1rem;
}

.skills-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.skill-tag {
  background: #E5E7EB;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  color: #4B5563;
}

@media (max-width: 768px) {
  .portfolio-card {
    padding: 1rem;
  }

  .card-title {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .skills-container {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
<template>
  <div class="portfolio-list">
    <h2 class="list-title">Proyectos Completados</h2>

    <div class="projects-container" v-if="!loading">
      <PortfolioItem
          v-for="project in completedProjects"
          :key="project.id"
          :project="project"
      />
    </div>

    <div v-else>Cargando proyectos...</div>

    <div v-show="!loading && completedProjects.length === 0" class="empty-message">
      No hay proyectos completados
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { projectService } from "@/modules/projects/services/project.service.js";
import { StudentService } from "@/modules/students/services/student.service.js";
import { authStore } from "@/shared/stores/auth.store.js";
import PortfolioItem from "@/modules/projects/components/portfolio-item.component.vue";

export default {
  name: 'PortfolioList',
  components: { PortfolioItem },
  setup() {
    const completedProjects = ref([]);
    const loading = ref(true);

    const getCurrentUserId = () => {
      if (authStore.user?.id) return authStore.user.id;
      const userId = localStorage.getItem('userId');
      return userId ? parseInt(userId) : null;
    };

    const loadCompletedProjects = async () => {
      try {
        const userId = getCurrentUserId();
        if (!userId) throw new Error("No se encontró el usuario");

        const studentService = new StudentService();
        const student = await studentService.getByUserId(userId);

        if (!student.endedProjects || student.endedProjects.length === 0) {
          completedProjects.value = [];
          return;
        }

        const projectPromises = student.endedProjects.map(id => projectService.getById(id));
        const projects = await Promise.all(projectPromises);

        completedProjects.value = projects.filter(p => p != null);
      } catch (error) {
        console.error("Error al cargar proyectos del portafolio:", error);
      } finally {
        loading.value = false;
      }
    };

    onMounted(loadCompletedProjects);

    return { completedProjects, loading };
  }
}
</script>

<style scoped>
.portfolio-list {
  padding: 20px;
}

.projects-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

@media (max-width: 768px) {
  .portfolio-list {
    padding: 15px;
  }
}
</style>

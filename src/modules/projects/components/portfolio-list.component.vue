<script>
import { ref, onMounted } from 'vue';
import { projectService} from "@/modules/projects/services/project.service.js";
import { authStore} from "@/shared/stores/auth.store.js";
import PortfolioItemComponent from "@/modules/projects/components/portfolio-item.component.vue";
import PortfolioItem from "@/modules/projects/components/portfolio-item.component.vue";

export default {
  name: 'PortfolioList',
  components: {PortfolioItem, PortfolioItemComponent },
  setup() {
    const completedProjects = ref([]);
    const loading = ref(true);

    const getCurrentUserId = () => {
      // Si el store ya tiene al usuario, usarlo
      if (authStore.user?.id) return authStore.user.id;

      // Si no, intentar obtenerlo desde localStorage
      const userId = localStorage.getItem('userId');
      return userId ? parseInt(userId) : null;
    };

    const loadCompletedProjects = async () => {
      try {
        const currentUserId = getCurrentUserId();

        if (!currentUserId) {
          console.warn('No hay usuario autenticado.');
          return;
        }

        const allProjects = await projectService.getAll();
        completedProjects.value = allProjects.filter(
            project =>
                project.status === 'Finalizado' &&
                project.studentSelected === currentUserId
        );
      } catch (error) {
        console.error('Error al cargar proyectos del portafolio:', error);
      } finally {
        loading.value = false;
      }
    };

    onMounted(loadCompletedProjects);

    return { completedProjects, loading };
  }
};
</script>
<template>
  <div class="portfolio-list">
    <h2 class="list-title">Proyectos Completados</h2>

    <div class="projects-grid" v-if="!loading">
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

<style scoped>
.portfolio-list {
  padding: 20px;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

@media (max-width: 768px) {
  .portfolio-list {
    padding: 15px;
  }

  .projects-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}

@media (max-width: 480px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }
}
</style>
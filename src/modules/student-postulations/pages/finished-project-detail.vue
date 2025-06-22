<!-- src/modules/projects/pages/finished-project-detail.vue -->
<template>
  <div class="finished-project-detail">
    <button @click="goBack" class="back-button">
      ← Volver a postulaciones
    </button>

    <div v-if="loading" class="loading">Cargando proyecto...</div>
    <div v-else>
      <div class="project-header">
        <h1>{{ project.title }}</h1>
        <span class="status-badge finished">Finalizado</span>
      </div>

      <div class="project-content">
        <div class="message">
          <p>Tu participación en este proyecto ha finalizado.</p>
          <p>Gracias por tu contribución.</p>
        </div>

        <div class="project-description">
          <h3>Resumen</h3>
          <p>{{ project.description }}</p>
        </div>

        <div class="project-meta">
          <div class="meta-item" v-if="company">
            <img :src="company.logo" :alt="company.companyName" class="company-logo">
            <div>
              <h4>{{ company.companyName }}</h4>
              <p>{{ company.location }}</p>
            </div>
          </div>
          <div class="meta-item">
            <span>Fecha de finalización: {{ formatDate(project.createdAt) }}</span>
          </div>
        </div>
      </div>

      <button @click="goToRating" class="rate-button" v-if="company">
        Calificar a {{ company.companyName }}
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { CompanyService } from '@/modules/companies/services/company.service';
import { projectService } from '@/modules/projects/services/project.service';

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const project = ref({});
    const company = ref(null);
    const loading = ref(true);
    const companyService = new CompanyService();

    const formatDate = (dateString) => {
      if (!dateString) return 'No especificada';
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const loadProject = async () => {
      try {
        project.value = await projectService.getById(route.params.id);
        if (project.value.companyId) {
          company.value = await companyService.getById(project.value.companyId);
        }
      } catch (error) {
        console.error("Error loading project:", error);
        router.push('/student/postulations');
      } finally {
        loading.value = false;
      }
    };

    const goBack = () => {
      router.push('/student/postulations');
    };

    const goToRating = () => {
      router.push({
        name: 'RateCompany',
        params: { id: company.value.id },
        query: { projectId: project.value.id }
      });
    };

    onMounted(loadProject);

    return {
      project,
      company,
      loading,
      formatDate,
      goBack,
      goToRating
    };
  }
};
</script>

<style scoped>
/* Estilos anteriores más: */
.company-logo {
  width: 50px;
  height: 50px;
  border-radius: 4px;
  object-fit: cover;
  margin-right: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}
</style>
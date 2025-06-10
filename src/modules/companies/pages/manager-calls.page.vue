<script>
import CallCard from '../components/call-card.component.vue';
import { CompanyService } from '@/modules/companies/services/company.service.js';
import { ProjectService } from '@/modules/projects/services/project.service.js'; // ruta corregida

export default {
  name: 'ConvocatoriasPage',
  components: {
    CallCard
  },
  data() {
    return {
      allProjects: [],
      companyId: null
    };
  },
  computed: {
    filteredCalls() {
      return this.allProjects.filter(
          (p) =>
              p.companyId === this.companyId &&
              p.studentSelected === null &&
              !p.isFinished
      );
    }
  },
  async created() {
    try {
      const userId = parseInt(localStorage.getItem('userId'));

      // Obtener la empresa asociada al userId
      const companyService = new CompanyService();
      const companies = await companyService.getByUserId(userId);
      if (!companies.length) return;

      this.companyId = companies[0].id;

      // Obtener proyectos
      const projectService = new ProjectService();
      this.allProjects = await projectService.getAll();
    } catch (error) {
      console.error('Error cargando convocatorias:', error);
    }
  }
};
</script>

<template>
  <div class="layout">
    <div class="content">
      <h1>Convocatorias</h1>
      <div class="card-container">
        <CallCard
            v-for="project in filteredCalls"
            :key="project.id"
            :project="project"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
}
.content {
  padding: 2rem;
  width: 100%;
  background-color: #f4eddf;
}
.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
</style>

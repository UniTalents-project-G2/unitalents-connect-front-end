<script>
import { ProjectService } from '../services/project.service';
import { CompanyService } from '@/modules/companies/services/company.service';
import ProjectCard from '../components/opportunity-card.component.vue';

export default {
  name: 'StudentOpportunitiesPage',
  components: { ProjectCard },
  data() {
    return {
      projects: [],
      companies: []
    };
  },
  async created() {
    const projectService = new ProjectService();
    const companyService = new CompanyService();

    const availableProjects = await projectService.getAvailable();
    const companies = await companyService.getAll();

    // Mapeamos el nombre de empresa directamente a cada proyecto
    this.projects = availableProjects.map(project => {
      const company = companies.find(c => c.id === project.companyId);
      return {
        ...project,
        companyName: company ? company.name : 'Empresa desconocida'
      };
    });
  },
  methods: {
    handleApply(projectId) {
      // Aquí iría la lógica de postulación
      alert(`Te has postulado al proyecto ID: ${projectId}`);
    }
  }
}
</script>

<template>
  <div class="opportunities-container">
    <h1>Oportunidades Disponibles</h1>
    <div class="cards-container">
      <ProjectCard
          v-for="project in projects"
          :key="project.id"
          :project="project"
          @apply="handleApply"
      />
    </div>
  </div>
</template>

<style scoped>
.opportunities-container {
  padding: 20px;
}

.cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

@media (max-width: 768px) {
  .opportunities-container {
    padding: 15px;
  }

  h1 {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .cards-container {
    grid-template-columns: 1fr;
  }
}
</style>

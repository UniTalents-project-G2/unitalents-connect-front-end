<script>
import ProjectCard from '@/modules/projects/components/project-card.component.vue'
import { projectService } from '@/modules/projects/services/project.service'
import { CompanyService } from '@/modules/companies/services/company.service'

export default {
  name: 'ManagerProjectsPage',
  components: {
    ProjectCard
  },
  data() {
    return {
      projects: [],
      loading: true,
      error: null
    }
  },
  async created() {
    try {
      const userId = parseInt(localStorage.getItem('userId'))
      const companyService = new CompanyService()
      const companies = await companyService.getByUserId(userId)

      if (!companies.length) {
        this.error = 'No se encontró la compañía asociada al usuario.'
        return
      }

      const companyId = companies[0].id
      this.projects = await projectService.getByCompanyId(companyId)

      if (this.projects.length === 0) {
        console.warn('No se encontraron proyectos para la compañía con ID:', companyId)
      }
    } catch (error) {
      this.error = 'Error al cargar los proyectos'
      console.error('Error detallado:', error)
    } finally {
      this.loading = false
    }
  }
}
</script>



<template>
  <div class="projects-page">
    <div class="header">
      <h1>Proyectos de la Compañía</h1>
      <router-link to="/manager/projects/new">
        <button class="new-project-btn">Nuevo Proyecto</button>
      </router-link>
    </div>

    <div v-if="loading" class="loading">
      Cargando proyectos...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else-if="projects.length === 0" class="empty-state">
      <p>No hay proyectos registrados para esta compañía</p>

    </div>

    <div v-else class="projects-grid">
      <ProjectCard
          v-for="project in projects"
          :key="project.id"
          :project="project"
      />
    </div>
  </div>
</template>

<style scoped>
.projects-page {
  padding: 2rem;

}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

h1 {
  margin: 0;

  font-size: 1.8rem;
}

.new-project-btn {
  background: #1c1f2b;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

}

.new-project-btn:hover {
  background-color: #2a2e3d;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.loading, .error, .empty-state {
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;
}

.empty-state p {
  margin-bottom: 1rem;
}

.create-btn {
  background: #1c1f2b;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;

}

@media (max-width: 768px) {
  .projects-page {
    padding: 1rem;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  h1 {
    font-size: 1.5rem;
  }

  .new-project-btn {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .projects-grid {
    grid-template-columns: 1fr;
  }
}
</style>
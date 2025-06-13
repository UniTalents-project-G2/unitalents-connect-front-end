<script>
import { projectService } from '@/modules/projects/services/project.service'

export default {
  name: 'StudentProjectDetailPage',
  data() {
    return {
      project: null,
      loading: false,
      error: null
    }
  },
  methods: {
    async loadProject(id) {
      this.loading = true;
      try {
        const response = await projectService.getById(id);
        this.project = response.data || response;
      } catch (error) {
        console.error('Error loading project:', error);
        this.error = 'No se pudo cargar el proyecto';
      } finally {
        this.loading = false;
      }
    }
  },
  computed: {
    statusClass() {
      if (!this.project) return {};
      return {
        'en-curso': this.project.status === 'En curso',
        'finalizado': this.project.status === 'Finalizado',
        'pendiente': this.project.status === 'Pendiente'
      }
    }
  },
  watch: {
    '$route.params.id': {
      immediate: true,
      handler(newId) {
        if (newId) {
          this.loadProject(newId);
        }
      }
    }
  }
}
</script>

<template>
  <div class="project-detail">
    <router-link to="/student/opportunities" class="back-link">
      ← Volver a Oportunidades
    </router-link>

    <div v-if="loading" class="loading">
      Cargando proyecto...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else-if="project" class="project-info">
      <div class="header">
        <h1>{{ project.title }}</h1>
      </div>

      <div class="meta">
        <p><strong>Estado:</strong> <span :class="['status', statusClass]">{{ project.status }}</span></p>
        <p><strong>Área:</strong> {{ project.field }}</p>
        <p v-if="project.budget"><strong>Presupuesto:</strong> ${{ project.budget }}</p>
        <p v-if="project.createdAt"><strong>Publicado:</strong> {{ project.createdAt }}</p>

        <div v-if="project.skills && project.skills.length > 0" class="skills-display">
          <strong>Habilidades requeridas:</strong>
          <div class="skills-list">
            <span v-for="(skill, index) in project.skills" :key="index" class="skill-tag">
              {{ skill }}
            </span>
          </div>
        </div>
      </div>

      <div class="description">
        <h3>Descripción del proyecto:</h3>
        <p>{{ project.description }}</p>
      </div>

      <div v-if="project.studentSelected && project.status === 'En curso'" class="assigned-student">
        <h3>Estudiante asignado:</h3>
        <p>{{ project.studentSelected }}</p>
      </div>
      <div class="actions">
        <router-link
            :to="{ name: 'StudentCompanyProfile', params: { id: project.companyId } }"
            class="view-company-btn"
        >
          Ver empresa
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.project-detail {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.back-link {
  display: inline-block;
  margin-bottom: 20px;
  color: #4a89dc;
  text-decoration: none;
}

.header {
  margin-bottom: 20px;
}

.meta {
  margin-bottom: 20px;
}

.skills-display {
  margin: 15px 0;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.skill-tag {
  background-color: #e0e0e0;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9em;
}

.description {
  margin-bottom: 20px;
}

.status {
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: bold;
}

.status.pendiente {
  background-color: #ffcc00;
  color: #333;
}

.status.en-curso {
  background-color: #4a89dc;
  color: white;
}

.status.finalizado {
  background-color: #66bb6a;
  color: white;
}

.loading, .error {
  text-align: center;
  padding: 20px;
}

.error {
  color: #e74c3c;
}

.actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
}

.view-company-btn {
  background-color: #4a89dc;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  text-decoration: none;
  transition: background-color 0.3s;
}

.view-company-btn:hover {
  background-color: #3a70c2;
}
</style>
<script>
import { projectService } from '@/modules/projects/services/project.service';
import { postulationService } from '@/modules/student-postulations/services/postulation.service.js';
import { StudentService } from '@/modules/students/services/student.service.js';

export default {
  name: 'StudentProjectDetailPage',
  data() {
    return {
      userId: parseInt(localStorage.getItem('userId')),
      studentId: null,
      project: null,
      loading: false,
      error: null,
      hasApplied: false,
      applicationStatus: null
    };
  },
  methods: {
    async loadStudentId() {
      const studentService = new StudentService();
      const allStudents = await studentService.getAll();
      const matchedStudent = allStudents.find(s => s.userId === this.userId);
      if (matchedStudent) {
        this.studentId = matchedStudent.id;
      } else {
        throw new Error('No se encontró el estudiante con userId: ' + this.userId);
      }
    },

    async loadProject(id) {
      this.loading = true;
      try {
        await this.loadStudentId();

        const response = await projectService.getById(id);
        this.project = response.data || response;

        const currentPostulants = (this.project.postulants || []).filter(p => p != null);
        this.hasApplied = currentPostulants.includes(this.studentId);
      } catch (error) {
        console.error('Error loading project:', error);
        this.error = 'No se pudo cargar el proyecto';
      } finally {
        this.loading = false;
      }
    },

    async applyToProject() {
      try {
        const postulationData = {
          studentId: this.studentId,
          projectId: this.project.id,
          status: 'enviado',
          date: new Date().toISOString().split('T')[0]
        };

        await postulationService.create(postulationData);

        const currentPostulants = (this.project.postulants || []).filter(p => p != null);
        if (!currentPostulants.includes(this.studentId)) {
          const updatedProject = {
            ...this.project,
            postulants: [...currentPostulants, this.studentId]
          }
        }

        this.hasApplied = true;
        this.applicationStatus = 'enviado';
        alert('¡Postulación enviada con éxito!');
      } catch (error) {
        console.error('Error applying to project:', error);
        alert('Error al enviar la postulación');
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
      };
    },
    applicationStatusText() {
      const statusMap = {
        'enviado': 'Postulación enviada',
        'en revisión': 'En revisión',
        'aceptado': 'Aceptado',
        'rechazado': 'Rechazado'
      };
      return statusMap[this.applicationStatus] || this.applicationStatus;
    },
    applicationStatusClass() {
      return {
        'enviado': 'status-pending',
        'en revisión': 'status-review',
        'aceptado': 'status-accepted',
        'rechazado': 'status-rejected'
      }[this.applicationStatus] || '';
    }
  },
  watch: {
    '$route.params.id': {
      immediate: true,
      async handler(newId) {
        if (newId) {
          await this.loadProject(newId);
        }
      }
    }
  }
};
</script>


<template>
  <div class="project-detail">
    <router-link :to="{ name: 'StudentOpportunities' }" class="back-link">
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
        <div v-if="hasApplied" class="application-status">
          <span :class="['status-chip', applicationStatusClass]">
            {{ applicationStatusText }}
          </span>
        </div>
      </div>

      <div class="meta">
        <p><strong>Estado:</strong> <span :class="['status', statusClass]">{{ project.status }}</span></p>
        <p><strong>Área:</strong> {{ project.field }}</p>
        <p v-if="project.budget"><strong>Presupuesto:</strong> ${{ project.budget }}</p>
        <p v-if="project.createdAt"><strong>Publicado:</strong> {{ project.createdAt }}</p>

        <div v-if="project.skills?.length > 0" class="skills-display">
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
        <button v-if="!hasApplied && project.status === 'Open'" @click="applyToProject" class="apply-btn">
          Postularme
        </button>

        <router-link :to="{ name: 'StudentCompanyProfile', params: { id: project.companyId } }" class="view-company-btn">
          Ver empresa
        </router-link>
      </div>
    </div>
  </div>
</template>


<style scoped>
/* Tus estilos actuales están correctos, los mantengo igual */
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
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  justify-content: space-between;
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

.apply-btn {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1em;
  transition: background-color 0.3s;
}

.apply-btn:hover {
  background-color: #3e8e41;
}

.application-status {
  margin-left: 20px;
}

.status-chip {
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 0.9em;
  font-weight: bold;
}

.status-pending {
  background-color: #FFC107;
  color: #212121;
}

.status-review {
  background-color: #2196F3;
  color: white;
}

.status-accepted {
  background-color: #4CAF50;
  color: white;
}

.status-rejected {
  background-color: #F44336;
  color: white;
}

@media (max-width: 768px) {
  .project-detail {
    padding: 15px;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .actions {
    width: 100%;
    flex-direction: column;
    gap: 10px;
  }

  .apply-btn, .view-company-btn {
    width: 100%;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .meta p {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .skills-list {
    flex-direction: column;
  }

  .skill-tag {
    width: fit-content;
  }
}
</style>
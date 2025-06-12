<script>
import { projectService } from '@/modules/projects/services/project.service'

export default {
  name: 'ProjectDetailPage',
  data() {
    const defaultData = {
      title: '',
      description: '',
      field: '',
      companyId: 1,
      studentSelected: null,
      isFinished: false,
      postulants: [],
      skills: [],
      status: 'Pendiente'
    }
    return {
      project: null,
      isEditing: false,
      editData: JSON.parse(JSON.stringify(defaultData)),
      newSkill: '',
      errors: {
        title: false,
        description: false,
        field: false,
        skills: false
      },
      loading: false,
      error: null,
      statusOptions: [
        { value: 'Pendiente', label: 'Pendiente' },
        { value: 'En curso', label: 'En Curso' },
        { value: 'Finalizado', label: 'Finalizado' }
      ]
    }
  },
  methods: {
    getDefaultProjectData() {
      return {
        title: '',
        description: '',
        field: '',
        companyId: 1,
        studentSelected: null,
        isFinished: false,
        postulants: [],
        skills: [],
        status: 'Pendiente'
      }
    },
    async loadProject(id) {
      this.loading = true;
      try {
        const response = await projectService.getById(id);
        this.project = response.data || response;
        this.editData = { ...this.project };
        if (!Array.isArray(this.editData.skills)) {
          this.editData.skills = [];
        }
      } catch (error) {
        console.error('Error loading project:', error);
        this.error = 'No se pudo cargar el proyecto';
      } finally {
        this.loading = false;
      }
    },
    addSkill() {
      if (this.newSkill.trim() && !this.editData.skills.includes(this.newSkill.trim())) {
        this.editData.skills = [...this.editData.skills, this.newSkill.trim()];
        this.newSkill = '';
        this.errors.skills = false;
      }
    },
    removeSkill(index) {
      this.editData.skills.splice(index, 1);
    },
    validateForm() {
      this.errors.title = !this.editData.title.trim();
      this.errors.description = !this.editData.description.trim();
      this.errors.field = !this.editData.field.trim();
      this.errors.skills = this.editData.skills.length === 0;

      return !this.errors.title &&
          !this.errors.description &&
          !this.errors.field &&
          !this.errors.skills;
    },
    async saveProject() {
      if (!this.validateForm()) return;

      this.loading = true;
      try {
        const projectData = {
          ...this.editData,
          skills: this.editData.skills
        };

        if (this.project) {
          await projectService.update(this.project.id, projectData);
          await this.loadProject(this.project.id);
        } else {
          const newProject = await projectService.create(projectData);
          this.$router.push(`/manager/projects/${newProject.id}`);
        }
        this.isEditing = false;
      } catch (error) {
        console.error('Error saving project:', error);
        this.error = 'Error al guardar el proyecto';
      } finally {
        this.loading = false;
      }
    },
    async deleteProject() {
      if (confirm('¿Eliminar este proyecto?')) {
        try {
          await projectService.delete(this.project.id);
          this.$router.push('/manager/projects');
        } catch (error) {
          console.error('Error deleting project:', error);
          this.error = 'Error al eliminar el proyecto';
        }
      }
    },
    startEditing() {
      this.editData = { ...this.project };
      // Asegurar que skills sea un array
      if (!Array.isArray(this.editData.skills)) {
        this.editData.skills = [];
      }
      this.isEditing = true;
    },
    cancelEditing() {
      if (this.project) {
        this.isEditing = false;
      } else {
        this.$router.push('/manager/projects');
      }
    }
  },
  computed: {
    statusText() {
      if (!this.project) return this.editData.status || 'Pendiente';
      return this.project.isFinished ? 'Finalizado' :
          this.project.studentSelected ? 'En curso' : 'Pendiente';
    },
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
        if (newId && newId !== 'new') {
          this.loadProject(newId);
        } else {
          this.isEditing = true;
          this.editData = this.getDefaultProjectData();
        }
      }
    }
  }
}
</script>

<template>
  <div class="project-detail">
    <router-link to="/manager/projects" class="back-link">
      ← Volver a Proyectos
    </router-link>

    <div v-if="loading" class="loading">
      Cargando proyecto...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else-if="!isEditing && project" class="project-info">
      <div class="header">
        <h1>{{ project.title }}</h1>
        <div class="actions">
          <button @click="startEditing" class="edit-btn">Editar</button>
          <button @click="deleteProject" class="delete-btn">Eliminar</button>
        </div>
      </div>

      <div class="meta">
        <p><strong>Estado:</strong> <span :class="['status', statusClass]">{{ project.status }}</span></p>
        <p><strong>Área:</strong> {{ project.field }}</p>
        <div v-if="project.skills && project.skills.length > 0" class="skills-display">
          <strong>Habilidades requeridas:</strong>
          <div class="skills-list">
            <span v-for="(skill, index) in project.skills" :key="index" class="skill-tag">
              {{ skill }}
            </span>
          </div>
        </div>
        <p v-if="project.studentSelected"><strong>Estudiante asignado:</strong> {{ project.studentSelected }}</p>
        <p v-if="project.postulants.length > 0"><strong>Postulantes:</strong> {{ project.postulants.length }}</p>
      </div>

      <div class="description">
        <h3>Descripción:</h3>
        <p>{{ project.description }}</p>
      </div>
    </div>

    <div v-else class="edit-form">
      <h1>{{ project ? 'Editar Proyecto' : 'Nuevo Proyecto' }}</h1>

      <div class="form-group status-group">
        <label>Estado del Proyecto:</label>
        <div class="status-options">
          <label v-for="option in statusOptions" :key="option.value"
                 :class="['status-option', { 'active': editData.status === option.value }]">
            <input type="radio" v-model="editData.status" :value="option.value" hidden>
            {{ option.label }}
          </label>
        </div>
      </div>

      <div class="form-group skills-group" :class="{ 'error': errors.skills }">
        <label>Habilidades Requeridas <span class="required">*</span></label>
        <div class="skills-input-container">
          <div class="selected-skills">
            <span v-for="(skill, index) in editData.skills" :key="index" class="skill-tag">
              {{ skill }}
              <button @click="removeSkill(index)" class="remove-skill">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M18 6L6 18M6 6l12 12" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>
            </span>
            <input
                v-model="newSkill"
                @keyup.enter="addSkill"
                placeholder="Escribe una habilidad y presiona Enter"
                class="skill-input"
            >
          </div>
          <button @click="addSkill" class="add-skill-btn" :disabled="!newSkill.trim()">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 5v14M5 12h14" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        <span v-if="errors.skills" class="error-message">Debe agregar al menos una habilidad</span>
        <p class="hint">Ejemplo: Vue.js, Node.js, MongoDB, Diseño UI/UX</p>
      </div>

      <div class="form-group" :class="{ 'error': errors.title }">
        <label>Título: <span class="required">*</span></label>
        <input v-model="editData.title" type="text" placeholder="Nombre del proyecto">
        <span v-if="errors.title" class="error-message">Este campo es obligatorio</span>
      </div>

      <div class="form-group" :class="{ 'error': errors.field }">
        <label>Área: <span class="required">*</span></label>
        <input v-model="editData.field" type="text" placeholder="Área del proyecto (ej: Ingeniería de Software)">
        <span v-if="errors.field" class="error-message">Este campo es obligatorio</span>
      </div>

      <div class="form-group" :class="{ 'error': errors.description }">
        <label>Descripción: <span class="required">*</span></label>
        <textarea v-model="editData.description" rows="5" placeholder="Descripción detallada del proyecto"></textarea>
        <span v-if="errors.description" class="error-message">Este campo es obligatorio</span>
      </div>

      <div class="form-actions">
        <button @click="saveProject" class="save-btn">Guardar</button>
        <button @click="cancelEditing" class="cancel-btn">{{ project ? 'Cancelar' : 'Volver' }}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.project-detail {
  padding: 2rem;
  font-family: 'Nunito', sans-serif;
}

.back-link {
  display: inline-block;
  margin-bottom: 1rem;
  color: #1c1f2b;
  text-decoration: none;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

h1 {
  margin: 0;
  font-family: 'Inter', sans-serif;
  font-size: 1.8rem;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.edit-btn {
  background: #FFD479;
  color: #1c1f2b;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
}

.delete-btn {
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
}

.meta {
  margin-bottom: 1.5rem;
}

.meta p {
  margin: 0.5rem 0;
  font-size: 1rem;
}

.status {
  padding: 0.25rem 0.5rem;
  border-radius: 20px;
  font-size: 0.9rem;
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

.description {
  margin-bottom: 1.5rem;
}

.description h3 {
  font-family: 'Inter', sans-serif;
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.description p {
  line-height: 1.6;
}

.edit-form {
  max-width: 800px;
  margin: 0 auto;
}

.edit-form h1 {
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
  background: #f9fafb;
  padding: 1.5rem;
  border-radius: 12px;
  transition: all 0.2s;
}

.form-group:hover {
  background: #f3f4f6;
}

.form-group.error {
  background: #fef2f2;
  border-left: 4px solid #ef4444;
}

.form-group label {
  color: #1c1f2b;
  font-weight: 600;
  margin-bottom: 0.75rem;
  display: block;
}

.form-group input[type="text"],
.form-group textarea {
  background: white;
  border: 1px solid #e5e7eb;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  transition: all 0.2s;
  font-family: 'Nunito', sans-serif;
}

.form-group input[type="text"]:focus,
.form-group textarea:focus {
  border-color: #1c1f2b;
  box-shadow: 0 0 0 3px rgba(28, 31, 43, 0.1);
}

.status-group {
  margin-bottom: 2rem;
}

.status-options {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.status-option {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
}

.status-option:hover {
  border-color: #c0c0c0;
}

.status-option.active {
  border-color: #1c1f2b;
  background-color: #1c1f2b;
  color: white;
}

.skills-group {
  margin-bottom: 2rem;
}

.skills-input-container {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.selected-skills {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  min-height: 50px;
}

.skill-tag {
  background-color: #e0e7ff;
  color: #1c1f2b;
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  display: inline-flex;
  align-items: center;
  font-size: 0.9rem;
  font-weight: 500;
}

.remove-skill {
  background: none;
  border: none;
  margin-left: 0.5rem;
  cursor: pointer;
  color: #6b7280;
  display: flex;
  align-items: center;
  padding: 0;
}

.remove-skill:hover {
  color: #ef4444;
}

.skill-input {
  flex: 1;
  min-width: 200px;
  border: none;
  outline: none;
  padding: 0.5rem;
  font-family: 'Nunito', sans-serif;
}

.add-skill-btn {
  background-color: #1c1f2b;
  color: white;
  border: none;
  border-radius: 8px;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.add-skill-btn:disabled {
  background-color: #d1d5db;
  cursor: not-allowed;
}

.add-skill-btn:not(:disabled):hover {
  background-color: #2a2e3d;
}

.skills-display {
  margin: 0.5rem 0;
}

.skills-display .skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.skills-display .skill-tag {
  background-color: #e0e7ff;
  color: #1c1f2b;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 500;
}

.hint {
  font-size: 0.8rem;
  color: #6b7280;
  margin-top: 0.5rem;
  font-style: italic;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.save-btn {
  background: #FFD479;
  color: #1c1f2b;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
}

.cancel-btn {
  background: #d4d4d4;
  color: #1c1f2b;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  font-family: 'Inter', sans-serif;
}

.required {
  color: #ff6b6b;
}

.error-message {
  color: #ff6b6b;
  font-size: 0.8rem;
}

@media (max-width: 768px) {
  .project-detail {
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

  .actions {
    width: 100%;
    justify-content: flex-end;
  }

  .status-options {
    flex-direction: column;
  }

  .skills-input-container {
    flex-direction: column;
  }

  .add-skill-btn {
    width: 100%;
    height: auto;
    padding: 0.75rem;
  }

  .skills-display {
    margin: 0.5rem 0;
  }

  .skills-display .skills-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .skills-display .skill-tag {
    background-color: #e0e7ff;
    color: #1c1f2b;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-size: 0.9rem;
    font-weight: 500;
  }
}
</style>
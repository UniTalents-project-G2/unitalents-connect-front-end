<script>
import { projectService } from '@/modules/projects/services/project.service'
import { CompanyService } from '@/modules/companies/services/company.service'
import { ReputationService } from '@/modules/reputations/services/reputation.service'
import { StudentService } from '@/modules/students/services/student.service'
import ReputationForm from '@/modules/reputations/components/ReputationForm.vue'

export default {
  name: 'ProjectDetailPage',
  components: { ReputationForm },
  data() {
    return {
      project: null,
      isEditing: false,
      mostrarFormularioReputacion: false,
      editData: {
        title: '',
        description: '',
        field: '',
        companyId: null,
        studentSelected: null,
        isFinished: false,
        postulants: [],
        skills: [],
        status: 'Pendiente', // ← lo mostramos como label en español
        budget: ''
      },
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
        { value: 'En curso', label: 'En curso' },
        { value: 'Finalizado', label: 'Finalizado' },
        { value: 'Cancelado', label: 'Cancelado' }
      ],
      statusMap: {
        'Pendiente': 'Open',
        'En curso': 'InProgress',
        'Finalizado': 'Finished',
        'Cancelado': 'Cancelled'
      },
      statusReverseMap: {
        'Open': 'Pendiente',
        'InProgress': 'En curso',
        'Finished': 'Finalizado',
        'Cancelled': 'Cancelado'
      }
    };
  },
  methods: {
    getStatusLabel(status) {
      return this.statusReverseMap[status] || status;
    },
    async loadProject(id) {
      this.loading = true;
      try {
        const response = await projectService.getById(id);
        this.project = response.data || response;
        this.editData = { ...this.project };

        // 🟡 Transformamos status del backend → label en español
        this.editData.status = this.statusReverseMap[this.project.status] || 'Pendiente';

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
      const skill = this.newSkill.trim();
      if (skill && !this.editData.skills.includes(skill)) {
        this.editData.skills.push(skill);
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
        const projectData = { ...this.editData };

        // ✅ Convertimos status a backend enum
        projectData.status = this.statusMap[projectData.status] || 'Open';

        if (this.project) {
          await projectService.update(this.project.id, projectData);
          await this.loadProject(this.project.id);
        } else {
          const userId = parseInt(localStorage.getItem('userId'));
          const companyService = new CompanyService();
          const companies = await companyService.getByUserId(userId);

          if (!companies.length) {
            throw new Error("No se encontró la compañía asociada al usuario");
          }

          const myCompany = companies.find(c => c.userId === userId); // 🟢 asegúrate que este es tuyo

          if (!myCompany?.id) {
            throw new Error("La compañía encontrada no tiene un ID válido");
          }

          projectData.companyId = myCompany.id; // ✅ este es el ID correcto
          projectData.createdAt = new Date().toISOString().split('T')[0];

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
      this.editData.status = this.statusReverseMap[this.project.status] || 'Pendiente';

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
    },
    finalizarProyecto() {
      this.mostrarFormularioReputacion = true;
    },
    async enviarReputacion({ projectId, rating, comment, studentId }) {
      try {
        const reputationService = new ReputationService();

        // 1. Crear reputación  ➜  backend cierra proyecto y actualiza rating
        await reputationService.create({ projectId, rating, comment });

        // 2. Ocultar formulario y recargar proyecto
        this.mostrarFormularioReputacion = false;
        await this.loadProject(projectId);

        alert('Proyecto finalizado y reputación guardada ✅');
      } catch (err) {
        console.error('Error al guardar reputación:', err);
        alert('Ocurrió un error al guardar la reputación ❌');
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
          this.editData = {
            title: '',
            description: '',
            field: '',
            companyId: null,
            studentSelected: null,
            isFinished: false,
            postulants: [],
            skills: [],
            status: 'Pendiente', // en español para el formulario
            budget: ''
          };
        }
      }
    }
  }
};
</script>


<template>
  <div class="project-detail">
    <router-link to="/manager/projects" class="back-link">← Volver a Proyectos</router-link>

    <div v-if="loading" class="loading">Cargando proyecto...</div>
    <div v-else-if="error" class="error">{{ error }}</div>

    <!-- Vista del proyecto -->
    <div v-else-if="!isEditing && project" class="project-info">
      <div class="header">
        <h1>{{ project.title }}</h1>
        <div class="header-actions">
          <button @click="startEditing" class="button yellow">Editar</button>
          <button @click="deleteProject" class="button gray">Eliminar</button>
        </div>
      </div>

      <p><strong>Estado:</strong> {{ getStatusLabel(project.status) }}</p>
      <p><strong>Área:</strong> {{ project.field }}</p>
      <p><strong>Pago:</strong> {{ project.budget }}</p>

      <div v-if="project.skills?.length">
        <strong>Habilidades requeridas:</strong>
        <ul>
          <li v-for="(skill, i) in project.skills" :key="i">{{ skill }}</li>
        </ul>
      </div>

      <p><strong>Descripción:</strong> {{ project.description }}</p>

      <!-- Mostrar botón y formulario si proyecto está en curso -->
      <div v-if="project.status === 'InProgress' && project.studentSelected">
        <button class="button yellow" @click="finalizarProyecto">Finalizar Proyecto</button>
      </div>

      <!-- Formulario de reputación -->
      <ReputationForm
          v-if="mostrarFormularioReputacion"
          :studentId="project.studentSelected"
          :projectId="project.id"
          @submit="enviarReputacion"
      />
    </div>

    <!-- Formulario editar / nuevo -->
    <div v-else class="edit-form">
      <h1>{{ project ? 'Editar Proyecto' : 'Nuevo Proyecto' }}</h1>

      <div class="form-field">
        <label>Estado del Proyecto</label>
        <select v-model="editData.status">
          <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
            {{ opt.label }}
          </option>
        </select>
      </div>

      <div class="form-field">
        <label>Habilidades Requeridas *</label>
        <div class="tags-input">
          <span class="tag" v-for="(skill, i) in editData.skills" :key="i">
            {{ skill }}
            <button @click="removeSkill(i)">×</button>
          </span>
          <input v-model="newSkill" @keyup.enter="addSkill" placeholder="Presiona Enter para añadir" />
        </div>
      </div>

      <div class="form-field">
        <label>Título *</label>
        <input v-model="editData.title" type="text" placeholder="Título del proyecto" />
      </div>

      <div class="form-field">
        <label>Área *</label>
        <input v-model="editData.field" type="text" placeholder="Ej: Ingeniería de Software" />
      </div>

      <div class="form-field">
        <label>Pago</label>
        <input v-model="editData.budget" type="number" placeholder="Monto estimado en dólares" />
      </div>

      <div class="form-field">
        <label>Descripción *</label>
        <textarea v-model="editData.description" rows="4" placeholder="Describe el proyecto..."></textarea>
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
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.back-link {
  margin-bottom: 2rem;
  color: #1c1f2b;
  font-weight: bold;
  text-decoration: none;
}

.project-info h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.project-info {
  width: 100%;
}

.project-info p {
  margin-bottom: 1.5rem;
}


.header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.header-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}

.button {
  font-family: inherit;
  padding: 0.4rem 1rem;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.button.yellow {
  background-color: #FFD479;
  color: #1c1f2b;
}

.button.gray {
  background-color: #e5e7eb;
  color: #1c1f2b;
}

ul {
  padding-left: 1.5rem;
  margin: 0.5rem 0 1rem 0;
}

.edit-form {
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.edit-form h1 {
  text-align: center;
  margin-bottom: 2rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
}

.form-field label {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.form-field input,
.form-field select,
.form-field textarea {
  padding: 0.75rem 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
}

.tags-input {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.tags-input input {
  border: none;
  flex-grow: 1;
  outline: none;
  min-width: 120px;
}

.tag {
  background-color: #dbeafe;
  padding: 0.3rem 0.8rem;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.tag button {
  background: none;
  border: none;
  cursor: pointer;
  font-weight: bold;
  color: #1c1f2b;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.save-btn {
  background-color: #FFD479;
  color: #1c1f2b;
  font-weight: 600;
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
}

.cancel-btn {
  background-color: #e5e7eb;
  color: #1c1f2b;
  font-weight: 600;
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .project-detail {
    padding: 1rem;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-start;
  }

  .form-actions {
    flex-direction: column;
  }

  .save-btn,
  .cancel-btn {
    width: 100%;
  }
}

</style>
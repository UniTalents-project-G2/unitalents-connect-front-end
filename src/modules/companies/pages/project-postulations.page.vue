<script>
import Sidebar from '@/shared/components/manager-sidebar.components.vue';
import StudentPostulantCard from '../components/studente-postulant-card.components.vue';

import { ProjectService } from '@/modules/projects/services/project.service.js';
import { StudentService } from '@/modules/students/services/student.service.js';
import { UserService } from '@/modules/users/services/user.service.js';

export default {
  name: 'ProjectPostulationsPage',
  components: {
    Sidebar,
    StudentPostulantCard
  },
  data() {
    return {
      project: null,
      students: [],
      users: [],
      postulantStudents: [],
      isLoaded: false,
      filters: {
        field: '',
        skill: '',
        minRating: ''
      }
    }
  },

  async created() {
    const projectId = parseInt(this.$route.params.id);

    try {
      const projectService = new ProjectService();
      const studentService = new StudentService();
      const userService = new UserService();

      const [project, studentRes, users] = await Promise.all([
        projectService.getById(projectId),
        studentService.getAll(),
        userService.getAll()
      ]);

      const students = studentRes.map(s => s); // ya que no usamos entidad

      this.project = project;
      this.students = students;
      this.users = users;

      this.postulantStudents = this.project.postulants.map(studentId => {
        const student = this.students.find(s => s.id === studentId);
        const user = this.users.find(u => u.id === student?.userId);

        console.log('studentId:', studentId);
        console.log('student encontrado:', student);
        console.log('user encontrado:', user);


        if (!student || !user) return null;

        return {
          id: student.id,
          userId: student.userId,
          name: user.name,
          rating: student.rating,
          field: student.field,
          portfolioLink: student.portfolioLink,
          skills: student.specializations || [],
          logo: student.logo
        };
      }).filter(Boolean);

      this.isLoaded = true;

    } catch (error) {
      console.error('Error cargando postulaciones del proyecto:', error);
      this.project = null;
    }
  },

  computed: {
    filteredStudents() {
      return this.postulantStudents.filter(student => {
        const fieldOk = !this.filters.field || student.field === this.filters.field;
        const skillOk = !this.filters.skill || (student.skills || []).includes(this.filters.skill);
        const ratingOk = !this.filters.minRating || student.rating >= parseFloat(this.filters.minRating);
        return fieldOk && skillOk && ratingOk;
      });
    }
  }
}
</script>

<template>
  <div class="layout">
    <div class="content">
      <router-link to="/manager/calls" class="back-link">← Volver a Convocatorias</router-link>

      <template v-if="isLoaded">
        <h1>{{ project.title }}</h1>

        <!-- Filtros -->
        <div class="filters">
          <select v-model="filters.field">
            <option value="">Carrera</option>
            <option>Ingeniería de Software</option>
            <option>Diseño Gráfico</option>
            <option>Marketing</option>
            <option>Ciberseguridad</option>
            <option>Analítica de Datos</option>
          </select>

          <select v-model="filters.skill">
            <option value="">Habilidades</option>
            <option>Python</option>
            <option>MatLab</option>
            <option>Social Media</option>
            <option>Vue.js</option>
            <option>Node.js</option>
            <option>SQL</option>
          </select>

          <select v-model="filters.minRating">
            <option value="">Calificación mínima</option>
            <option value="3.5">3.5</option>
            <option value="4.0">4.0</option>
            <option value="4.5">4.5</option>
          </select>

          <button class="btn">Filtrar</button>
        </div>

        <!-- Tarjetas de estudiantes -->
        <StudentPostulantCard
            v-for="student in filteredStudents"
            :key="student.id"
            :student="student"
            :project-id="project.id"
        />
      </template>

      <template v-else>
        <p class="error-msg">Cargando proyecto...</p>
      </template>
    </div>
  </div>
</template>

<style scoped>
/* Hace que todo el layout ocupe la altura completa y permita scroll global */
html, body, #app, .layout {
  height: 100%;
}

/* Sidebar + contenido */
.layout {
  display: flex;
  min-height: 100%;          /* asegura ocupación vertical */
}

/* Área desplazable */
.content {
  flex: 1 1 auto;            /* ocupa todo lo que deje el sidebar */
  overflow-y: auto;          /* usa la barra del navegador */
  padding: 2rem;
  background-color: #f4eddf;
}

/* -------------------- Filtros -------------------- */
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin: 1rem 0 2rem;
}

.filters select,
.filters .btn {
  font-size: 1rem;
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  min-width: 160px;
}

.filters .btn {
  background-color: #fdd567;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}
.filters .btn:hover { background-color: #fccc4e; }

/* Responsive filtros en columnas */
@media (max-width: 600px) {
  .filters {
    flex-direction: column;
    align-items: stretch;
  }
  .filters select,
  .filters .btn { width: 100%; }
}

/* -------------------- Enlaces & mensajes -------------------- */
.back-link {
  display: inline-block;
  margin-bottom: 1rem;
  color: #1c1f2b;
  font-weight: 500;
  text-decoration: none;
}
.back-link:hover { text-decoration: underline; }

.error-msg {
  color: red;
  font-weight: bold;
  margin-top: 2rem;
}
</style>


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

      // OJO: el studentService devuelve el AxiosResponse completo
      const students = studentRes.map(s => s); // ya que no tenemos entidad en el service

      this.project = project;
      this.students = students;
      this.users = users;

      // Procesamos los postulantes
      this.postulantStudents = this.project.postulants.map(studentId => {
        const student = this.students.find(s => s.id === studentId);
        const user = this.users.find(u => u.id === student?.userId);
        if (!student || !user) return null;

        return {
          ...student,
          name: user.name,
          rating: student.rating,
          field: student.field,
          portfolioLink: student.portfolioLink,
          skills: this.generateSkills()
        }
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
  },

  methods: {
    generateSkills() {
      const pool = [['Python', 'MatLab'], ['Social Media'], ['Vue.js', 'Node.js'], ['Excel', 'SQL']];
      return pool[Math.floor(Math.random() * pool.length)];
    }
  }
};
</script>



<template>
  <div class="layout">
    <div class="content">
      <router-link to="/manager/calls" class="back-link">← Volver a Convocatorias</router-link>

      <template v-if="isLoaded">
        <h1>{{ project.title }}</h1>

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
.layout {
  display: flex;
}

.content {
  padding: 2rem;
  width: 100%;
  background-color: #f4eddf;
}

.filters {
  display: flex;
  gap: 1rem;
  margin: 1rem 0 2rem;
}

select {
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.btn {
  background-color: #fdd567;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.back-link {
  display: inline-block;
  margin-bottom: 1rem;
  color: #1c1f2b;
  text-decoration: none;
  font-weight: 500;
}

.back-link:hover {
  text-decoration: underline;
}

.error-msg {
  color: red;
  font-weight: bold;
  margin-top: 2rem;
}
</style>

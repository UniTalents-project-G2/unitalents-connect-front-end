<script>
import Sidebar from '@/shared/components/manager-sidebar.components.vue';
import StudentPostulantCard from '../components/studente-postulant-card.components.vue';
import { http } from '@/shared/services/http.instance.js';

export default {
  name: 'ProjectPostulationsPage',
  components: {
    Sidebar,
    StudentPostulantCard
  },
  data() {
    return {
      project: null,
      allPostulations: [],
      allStudents: [],
      filters: {
        field: '',
        skill: '',
        minRating: ''
      }
    };
  },
  computed: {
    filteredStudents() {
      return this.postulantStudents.filter(student => {
        const fieldOk = !this.filters.field || student.field === this.filters.field;
        const skillOk = !this.filters.skill || (student.skills || []).includes(this.filters.skill);
        const ratingOk = !this.filters.minRating || student.rating >= parseFloat(this.filters.minRating);
        return fieldOk && skillOk && ratingOk;
      });
    },
    postulantStudents() {
      const postulantIds = this.allPostulations
          .filter(p => p.projectId === this.project?.id)
          .map(p => p.studentId);
      return this.allStudents.filter(s => postulantIds.includes(s.id));
    }
  },
  async created() {
    const projectId = parseInt(this.$route.params.id);

    try {
      const [project, postulations, students, users] = await Promise.all([
        http.get(`/projects/${projectId}`),
        http.get('/postulations'),
        http.get('/students'),
        http.get('/users')
      ]);

      this.project = project.data;
      this.allPostulations = postulations.data;

      this.allStudents = students.data.map(s => {
        const user = users.data.find(u => u.id === s.userId);
        return {
          ...s,
          name: user?.name || 'Estudiante',
          rating: this.getRandomRating(),
          skills: this.generateSkills()
        };
      });
    } catch (error) {
      console.error('Error cargando datos del proyecto:', error);
      this.project = null;
    }
  },
  methods: {
    getRandomRating() {
      return parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)); // entre 3.5 y 5.0
    },
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
      <router-link to="/manager/convocatorias" class="back-link">← Volver a Convocatorias</router-link>

      <h1 v-if="project">{{ project.title }}</h1>
      <p v-else class="error-msg">Proyecto no encontrado.</p>

      <div class="filters" v-if="project">
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
      />
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

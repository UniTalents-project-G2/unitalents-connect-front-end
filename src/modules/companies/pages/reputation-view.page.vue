<script>
import Sidebar from '@/shared/components/manager-sidebar.components.vue';
import ReputationCard from '@/modules/students/components/reputation-card.components.vue';

import { ReputationService } from '@/modules/students/services/reputation.service.js';
import { StudentService } from '@/modules/students/services/student.service.js';
import { CompanyService } from '@/modules/companies/services/company.service.js';
import { ProjectService } from '@/modules/projects/services/project.service.js';

export default {
  name: 'ReputationViewPage',
  components: {
    Sidebar,
    ReputationCard
  },
  data() {
    return {
      student: null,
      user: null,
      reputations: [],
      projectId: null
    };
  },
  async created() {
    try {
      const studentId = parseInt(this.$route.params.studentId);
      this.projectId = parseInt(this.$route.query.projectId);

      const studentService = new StudentService();
      const companyService = new CompanyService();
      const reputationService = new ReputationService();

      this.student = await studentService.getById(studentId);
      const users = await companyService.getAllUsers(); // Asegúrate de que este método exista
      this.user = users.find(u => u.id === this.student.userId);

      this.reputations = await reputationService.getByStudentId(studentId);
    } catch (error) {
      console.error('Error cargando información del estudiante:', error);
    }
  },
  methods: {
    async aceptarPostulante() {
      if (!this.projectId) return;

      try {
        const projectService = new ProjectService();
        await projectService.update(this.projectId, {
          studentSelected: this.student.id
        });

        alert('Estudiante aceptado ✅');
        this.$router.push('/manager/convocatorias');
      } catch (error) {
        console.error('Error al aceptar postulante:', error);
        alert('Ocurrió un error al aceptar al postulante ❌');
      }
    }
  }
};
</script>

<template>
  <div class="layout">
    <div class="content">
      <router-link :to="`/projects/${projectId}`">← Volver a postulantes</router-link>

      <h1>{{ user?.name }}</h1>
      <p><strong>Carrera:</strong> {{ student?.field }}</p>
      <a :href="student?.portfolioLink" target="_blank" class="portfolio">Ver portafolio</a>

      <h2>Reputaciones anteriores</h2>
      <ReputationCard
          v-for="rep in reputations"
          :key="rep.id"
          :reputation="rep"
      />

      <button class="accept-btn" @click="aceptarPostulante">Aceptar postulante</button>
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
.portfolio {
  display: inline-block;
  margin: 0.5rem 0 2rem;
  color: #007bff;
  text-decoration: underline;
}
.accept-btn {
  background-color: #fdd567;
  border: none;
  border-radius: 8px;
  padding: 0.7rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
}
</style>

<script>
import Sidebar from '@/shared/components/manager-sidebar.components.vue';
import ReputationCard from '@/modules/students/components/reputation-card.components.vue';
import { ReputationService } from '@/modules/students/services/reputation.service.js';

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
      projectId: null,
      reputationService: new ReputationService()
    };
  },
  async created() {
    const studentId = parseInt(this.$route.params.studentId);
    this.projectId = parseInt(this.$route.query.projectId); // importante pasar ?projectId= al navegar

    const [studentRes, usersRes] = await Promise.all([
      fetch(`http://localhost:3000/students/${studentId}`).then(res => res.json()),
      fetch(`http://localhost:3000/users`).then(res => res.json())
    ]);

    this.student = studentRes;
    this.user = usersRes.find(u => u.id === studentRes.userId);

    this.reputations = await this.reputationService.getByStudentId(studentId);
  },
  methods: {
    async aceptarPostulante() {
      if (!this.projectId) return;

      await fetch(`http://localhost:3000/projects/${this.projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentSelected: this.student.id })
      });

      alert('Estudiante aceptado ✅');
      this.$router.push('/company/convocatorias');
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

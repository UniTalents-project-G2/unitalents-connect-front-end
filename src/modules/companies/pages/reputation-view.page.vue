<script>
import Sidebar from '@/shared/components/manager-sidebar.components.vue';
import ReputationCard from '@/modules/students/components/reputation-card.components.vue';

import { ReputationService }   from '@/modules/students/services/reputation.service.js';
import { StudentService }      from '@/modules/students/services/student.service.js';
import { UserService }         from '@/modules/users/services/user.service.js';
import { postulationService }  from '@/modules/student-postulations/services/postulation.service.js';

export default {
  name: 'ReputationViewPage',
  components: { Sidebar, ReputationCard },

  data() {
    return {
      student: null,
      user: null,
      reputations: [],
      projectId: null              // viene por query ?projectId=
    };
  },

  async created() {
    const studentId = parseInt(this.$route.params.studentId);
    this.projectId  = parseInt(this.$route.query.projectId);

    const studentSvc    = new StudentService();
    const userSvc       = new UserService();
    const reputationSvc = new ReputationService();

    try {
      const [studentData, users, reps] = await Promise.all([
        studentSvc.getById(studentId),
        userSvc.getAll(),
        reputationSvc.getByStudentId(studentId)
      ]);

      this.student     = studentData;
      this.user        = users.find(u => u.id === studentData.userId);
      this.reputations = reps ?? [];
    } catch (err) {
      console.error('Error cargando reputación:', err);
    }
  },

  methods: {
    async aceptarPostulante() {
      if (!this.projectId || !this.student?.id) {
        alert('Faltan datos para aceptar al postulante.');
        return;
      }

      try {
        // 1. Buscar la postulación del estudiante seleccionado
        const postulaciones = await postulationService.getByProject(this.projectId);
        const propiaPostul  = postulaciones.find(p => p.studentId === this.student.id);

        if (!propiaPostul) {
          alert('No se encontró la postulación del estudiante.');
          return;
        }

        // 2. Llamar al endpoint /accept (esto actualiza todo en backend)
        await postulationService.update(propiaPostul.id, {});  // el service agrega /accept

        alert('Estudiante aceptado ✅');
        this.$router.push('/manager/calls');
      } catch (err) {
        console.error('Error al aceptar postulante:', err);
        alert('Ocurrió un error al aceptar al postulante ❌');
      }
    }
  }
};
</script>

<template>
  <div class="layout">
    <div class="content">
      <router-link to="#" @click.prevent="$router.go(-1)" class="back-link">← Volver a postulantes</router-link>

      <div v-if="student && user" class="header">
        <img class="avatar" :src="student.logo || 'https://i.pravatar.cc/100?img=3'" alt="Foto" />
        <div class="info">
          <h1>{{ user?.name }}</h1>
          <p>{{ student?.field }}</p>
          <div class="rating-projects">
            <span>⭐ {{ student?.rating }}</span>
            <span class="projects">{{ student?.endedProjects?.length || 0 }} proyectos completados</span>
          </div>
          <p v-if="student.city || student.country">
            📍 {{ student.city }}<span v-if="student.city && student.country">,</span> {{ student.country }}
          </p>
          <p v-if="student.birthdate">🎂 Nacimiento: {{ student.birthdate }}</p>
          <p v-if="student.phoneNumber">📞 {{ student.phoneNumber }}</p>
          <p v-if="student.aboutMe">🧠 {{ student.aboutMe }}</p>
          <a v-if="student.portfolioLink" :href="student.portfolioLink" target="_blank" class="portfolio-link">🔗 Ver portafolio</a>
          <div v-if="student.specializations?.length">
            <strong>Especialidades:</strong>
            <ul>
              <li v-for="(spec, index) in student.specializations" :key="index">{{ spec }}</li>
            </ul>
          </div>
        </div>
        <button class="accept-btn" @click="aceptarPostulante">Aceptar</button>
      </div>

      <h2>Reputación</h2>
      <ReputationCard
          v-for="rep in reputations"
          :key="rep.id"
          :reputation="rep"
      />
    </div>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

.content {
  padding: 2rem;
  width: 100%;
  background-color: #f4eddf;
}

.back-link {
  display: inline-block;
  margin-bottom: 1.5rem;
  color: #1c1f2b;
  text-decoration: none;
  font-weight: 500;
}

.header {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  background-color: #ffffff;
  border: 2px solid #ccc;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 3rem;
}

.header img {
  width: 250px;
  height: 250px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #333;
  flex-shrink: 0;
}

.avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #333;
  margin: 0 auto;
}

.info {
  flex: 1;
  min-width: 250px;
}

.info h1 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
}

.info p {
  margin: 0.4rem 0;
  color: #555;
  font-size: 1rem;
}

.rating-projects {
  margin: 0.8rem 0;
  font-size: 1rem;
  font-weight: 500;
}

.projects {
  margin-left: 1rem;
  text-decoration: underline;
  color: #333;
}

.portfolio-link {
  display: inline-block;
  margin: 0.5rem 0;
  color: #007BFF;
  font-weight: 500;
  text-decoration: underline;
}

ul {
  padding-left: 1rem;
  margin: 0.5rem 0;
}

li {
  margin: 0.2rem 0;
  font-size: 0.95rem;
}

.accept-btn {
  background-color: #fdd567;
  border: none;
  border-radius: 8px;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s ease;
  height: fit-content;
}

.accept-btn:hover {
  background-color: #f7c600;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .info {
    text-align: center;
  }

  .accept-btn {
    margin-top: 1rem;
  }
}
</style>

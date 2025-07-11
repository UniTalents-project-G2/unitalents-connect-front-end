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
      <router-link to="#" @click.prevent="$router.go(-1)" class="back-link">
        ← Volver a postulantes
      </router-link>

      <!-- Cabecera estudiante -->
      <div v-if="student && user" class="header">
        <img
            class="avatar"
            :src="student.logo || 'https://i.pravatar.cc/150'"
            alt="Foto"
        />

        <div class="info">
          <h1>{{ user?.name }}</h1>
          <p>{{ student?.field }}</p>

          <div class="rating-projects">
            ⭐ {{ student?.rating }}
            <span class="projects">
              {{ student?.endedProjects?.length || 0 }} proyectos completados
            </span>
          </div>

          <p v-if="student.city || student.country">
            📍 {{ student.city }}<span v-if="student.city && student.country">,</span>
            {{ student.country }}
          </p>
          <p v-if="student.birthdate">
            🎂 Nacimiento: {{ student.birthdate }}
          </p>
          <p v-if="student.phoneNumber">📞 {{ student.phoneNumber }}</p>
          <p v-if="student.aboutMe">🧠 {{ student.aboutMe }}</p>

          <a
              v-if="student.portfolioLink"
              :href="student.portfolioLink"
              target="_blank"
              class="portfolio-link"
          >
            🔗 Ver portafolio
          </a>

          <div v-if="student.specializations?.length">
            <strong>Especialidades:</strong>
            <ul>
              <li v-for="(spec, i) in student.specializations" :key="i">
                {{ spec }}
              </li>
            </ul>
          </div>
        </div>

        <button class="accept-btn" @click="aceptarPostulante">
          Aceptar
        </button>
      </div>

      <!-- Lista de reputaciones -->
      <h2>Reputación</h2>
      <ReputationCard
          v-for="rep in reputations"
          :key="rep.id"
          :reputation="rep"
      />
    </div>
  </div>
</template>

<script setup>
// (Tu lógica existente: props, imports, métodos…)
</script>

<style scoped>
/* ---- Layout base con scroll global ---- */
html,
body,
#app,
.layout {
  height: 100%;
}

.layout {
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1 1 auto;
  overflow-y: auto;       /* barra del navegador */
  padding: 2rem;
  background: #f4eddf;
}

/* ---- Elementos generales ---- */
.back-link {
  display: inline-block;
  margin-bottom: 1.5rem;
  color: #1c1f2b;
  font-weight: 500;
  text-decoration: none;
}
.back-link:hover { text-decoration: underline; }

/* ---- Cabecera ---- */
.header {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  align-items: center;
  padding: 1.5rem;
  background: #fff;
  border: 2px solid #ccc;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}

.avatar {
  width: 220px;
  height: 220px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #333;
  flex-shrink: 0;
}

.info {
  flex: 1 1 250px;
  min-width: 200px;
}

.info h1 { margin: 0; font-size: 1.8rem; font-weight: 700; }
.info p  { margin: .4rem 0; color: #555; }

.rating-projects {
  margin: .8rem 0;
  font-weight: 500;
}
.projects { margin-left: 1rem; text-decoration: underline; }

.portfolio-link {
  display: inline-block;
  margin: .5rem 0;
  color: #007bff;
  text-decoration: underline;
}

/* Lista especialidades */
ul { padding-left: 1rem; margin: .5rem 0; }
li { margin: .2rem 0; }

/* Botón aceptar */
.accept-btn {
  background: #fdd567;
  border: none;
  border-radius: 8px;
  padding: .8rem 1.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color .2s;
}
.accept-btn:hover { background: #f7c600; }

/* ---- Responsive ---- */
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    text-align: center;
  }

  .avatar {
    width: 150px;
    height: 150px;
  }

  .accept-btn {
    margin-top: 1rem;
    width: 100%;
  }
}
</style>


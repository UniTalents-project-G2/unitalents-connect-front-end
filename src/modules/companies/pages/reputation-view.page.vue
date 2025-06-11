<script>
import Sidebar from '@/shared/components/manager-sidebar.components.vue';
import ReputationCard from '@/modules/students/components/reputation-card.components.vue';

import { ProjectService } from '@/modules/projects/services/project.service.js';
import { ReputationService } from '@/modules/students/services/reputation.service.js';
import { StudentService } from '@/modules/students/services/student.service.js';
import { UserService } from '@/modules/users/services/user.service.js';

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
      projectService: new ProjectService()
    };
  },
  async created() {
    const studentId = parseInt(this.$route.params.studentId);
    this.projectId = parseInt(this.$route.query.projectId);

    const studentService = new StudentService();
    const userService = new UserService();
    const reputationService = new ReputationService();

    try {
      const [studentData, usersData, reputationsData] = await Promise.all([
        studentService.getById(studentId),
        userService.getAll(),
        reputationService.getByStudentId(studentId)
      ]);

      this.student = studentData;
      this.user = usersData.find(u => u.id === studentData.userId);
      this.reputations = reputationsData;
    } catch (error) {
      console.error('Error cargando reputación:', error);
    }
  },
  methods: {
    async aceptarPostulante() {
      if (!this.projectId || !this.student?.id) {
        alert("Faltan datos para aceptar al postulante.");
        return;
      }

      try {
        // Primero obtenemos el proyecto actual
        const project = await this.projectService.getById(this.projectId);

        // Actualizamos el campo studentSelected
        const updatedProject = {
          ...project,
          studentSelected: this.student.id
        };

        await this.projectService.update(this.projectId, updatedProject);

        alert('Estudiante aceptado ✅');
        this.$router.push('/manager/calls');
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
      <router-link to="#" @click.prevent="$router.go(-1)" class="back-link">← Volver a postulantes</router-link>

      <div class="header">
        <img class="avatar" :src="student.image || 'https://i.pravatar.cc/100?img=3'" alt="Foto" />
        <div class="info">
          <h1>{{ user?.name }}</h1>
          <p>{{ student?.field }}</p>
          <div class="rating-projects">
            <span>⭐ {{ student?.rating }}</span>
            <span class="projects">2 proyectos completados</span>
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
}
.content {
  padding: 2rem;
  width: 100%;
  background-color: #f4eddf;
}
.back-link {
  display: inline-block;
  margin-bottom: 1rem;
  color: #1c1f2b;
  text-decoration: none;
  font-weight: 500;
}
.header {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
}
.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}
.info {
  margin-left: 1.5rem;
  flex: 1;
}
.info h1 {
  margin: 0;
  font-size: 2rem;
}
.rating-projects {
  margin-top: 0.5rem;
  font-size: 1rem;
}
.projects {
  margin-left: 1rem;
  text-decoration: underline;
  color: #333;
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

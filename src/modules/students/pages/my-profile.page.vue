<script>
import { defineComponent } from 'vue'
import { StudentService } from "@/modules/students/services/student.service.js";
import { UserService } from "@/modules/auth/services/user.service.js";

export default defineComponent({
  name: "MyProfilePage",
  data() {
    return {
      profile: null,
      user: null,
      isLoaded: false
    }
  },
  async created() {
    try {
      const studentService = new StudentService();
      const userService = new UserService();
      const currentUserId = parseInt(localStorage.getItem("userId"));

      const student = await studentService.getByUserId(currentUserId);
      if (!student) throw new Error('Estudiante no encontrado');

      const userResource = await userService.getById(student.userId);

      this.profile = student;
      this.user = userResource.data;
      this.isLoaded = true;

    } catch (error) {
      console.error('Error cargando perfil:', error);
    }
  },
  methods: {
    goToEdit() {
      this.$router.push({ name: 'EditProfile' })
    }
  }
})
</script>

<template>
  <div class="opportunities-container" v-if="isLoaded">
    <h1>Mi Perfil</h1>
    <div class="student-card">
      <div class="left">
        <img
            class="logo"
            :src="profile.logo || 'https://via.placeholder.com/150'"
            alt="Logo Perfil"
        />
        <div class="rating">
          <span>⭐ {{ profile.rating }}</span>
        </div>
      </div>
      <div class="right">
        <p><strong>Nombre completo:</strong> {{ user.name }} </p>
        <p><strong>Fecha de Nacimiento:</strong> {{ profile.birthdate }}</p>
        <p><strong>Ciudad/País:</strong> {{ profile.city }} - {{ profile.country }}</p>
        <p><strong>Carrera:</strong> {{ profile.field }}</p>
        <p><strong>Correo electrónico:</strong> {{ user.email }}</p>
        <p><strong>Celular:</strong> {{ profile.phoneNumber }}</p>
        <p>
          <strong>Portafolio:</strong>
          <a
              v-if="profile.portfolioLink"
              :href="profile.portfolioLink"
              target="_blank"
              rel="noopener"
          >
            {{ profile.portfolioLink }}
          </a>
          <span v-else>No disponible</span>
        </p>
      </div>
    </div>

    <div class="about">
      <h3>Acerca de mí</h3>
      <p class="about_me">{{ profile.aboutMe || 'No se ha completado aún.' }}</p>
    </div>

    <div class="tags">
      <h3>Tecnologías y Especializaciones</h3>
      <span
          v-for="(tag, index) in profile.specializations"
          :key="index"
          class="tag"
      >{{ tag }}</span>
    </div>

    <button class="edit-btn" @click="goToEdit">Modificar perfil</button>
  </div>
</template>

<style scoped>
.opportunities-container {
  padding: 2rem;
  background-color: #f4eddf;
  box-sizing: border-box;
}

.student-card {
  display: flex;
  flex-wrap: wrap;
  background: white;
  border: 2px solid #222;
  border-radius: 10px;
  padding: 2rem;
  gap: 2rem;
  align-items: center;
  max-width: 100%;
}

.left {
  flex: 0 0 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo {
  width: 100%;
  max-width: 180px;
  height: auto;
  border-radius: 6px;
  object-fit: cover;
}

.right {
  flex: 1;
  min-width: 200px;
  word-break: break-word;
}

.rating {
  margin: 1rem 0;
  font-size: 1.5rem;
  text-align: center;
}

.about {
  margin-top: 2rem;
}

.about_me {
  font-size: 1rem;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 1rem;
  white-space: pre-wrap;
  overflow-wrap: break-word;
}

.tags {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.tag {
  background-color: #cfd8dc;
  padding: 0.15rem 0.75rem;
  font-size: 0.75rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  height: 22px;
}

.edit-btn {
  background-color: #fdd567;
  border: none;
  border-radius: 6px;
  padding: 0.7rem 1.5rem;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .student-card {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem;
  }

  .left, .right {
    width: 100%;
  }

  .logo {
    margin: 0 auto;
  }

  .edit-btn {
    display: block;
    margin: 2rem auto 0;
  }

  .right p {
    text-align: left;
    padding: 0 1rem;
  }
}
</style>

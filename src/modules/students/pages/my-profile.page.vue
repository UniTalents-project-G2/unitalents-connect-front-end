<script>
import {defineComponent} from 'vue'
import {StudentService} from "@/modules/students/services/student.service.js";
import {UserService} from "@/modules/auth/services/user.service.js";

export default defineComponent({
  name: "MyProfilePage",
  components: {},
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

      // 1. Obtener todos los estudiantes y filtrar
      const allStudents = await studentService.getAll();
      const student = allStudents.find(s => s.userId === currentUserId);
      if (!student) throw new Error('Estudiante no encontrado');

      // 2. Obtener datos del usuario asociado
      const userResource = await userService.getById(student.userId);

      // 3. Asignar a las propiedades reactivas (¡usa los nombres definidos en data()!)
      this.profile = student; // o this.student si lo cambias en data()
      this.user = userResource.data;
      this.isLoaded = true;

    } catch (error) {
      console.error('Error cargando perfil:', error);
      // Opcional: Mostrar un mensaje de error en la UI
    }
  },
  methods: {
    goToEdit() {
      
    }
  }
})
</script>

<template>
  <div class="layout">
    <div class="content" v-if="isLoaded">
      <h1>Mi Perfil</h1>
      <div class="student-card">
        <div class="left">
          <img class="logo" :src="profile.logo || 'https://via.placeholder.com/150'" alt="Logo Perfil" />
          <div class="rating"> <!-- Rating ahora está aquí -->
            <span>⭐ {{ profile.rating }}</span>
          </div>
        </div>
        <div class="right">
          <p><strong>Nombre completo:</strong> {{user.name}} </p>
          <p><strong>Fecha de Nacimiento:</strong> {{profile.birthdate}}</p>
          <p><strong>Ciudad/País:</strong> {{profile.city}} - {{profile.country}}</p>
          <p><strong>Carrera:</strong> {{profile.field}}</p>
          <p><strong>Correo electrónico:</strong> {{user.email}}</p>
          <p><strong>Celular:</strong> {{profile.phoneNumber}}</p>
        </div>
      </div>
      <p class="about_me">{{profile.aboutMe}}</p>
      <div class="tags">
        <span v-for="(tag,index) in profile.specializations" :key="index" class="tag">{{tag}}</span>
      </div>
      <button class="edit-btn" @click="">Modificar perfil</button>
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
.student-card {
  display: flex;
  background: white;
  border: 2px solid #222;
  border-radius: 10px;
  padding: 2rem;
  gap: 2rem;
  align-items: center;
}
.left {
  flex: 0 0 200px;
}
.right {
  flex: 1;
}
.rating {
  margin: 1rem 0;
  font-size: 1.5rem;
}
.tags {
  margin: 1rem 0;
}
.tag {
  background-color: #cfd8dc;
  padding: 0.4rem 1rem;
  margin: 0.3rem;
  border-radius: 20px;
  display: inline-block;
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
</style>
<script>
import { StudentService } from "@/modules/students/services/student.service.js";
import { UserService } from '@/modules/users/services/user.service.js'
import EditTagsModal from '@/shared/components/edit-tags-modal.component.vue'

export default {
  name: 'EditProfilePage',
  components: { EditTagsModal },
  data() {
    return {
      student: null,
      user: null,
      isLoaded: false,
      showTagModal: false
    }
  },
  async created() {
    try {
      const studentService = new StudentService()
      const userService = new UserService()

      const currentUserId = parseInt(localStorage.getItem('userId'))
      const allStudents = await studentService.getAll()
      const student = allStudents.find(s => s.userId === currentUserId)

      if (!student) throw new Error('No se encontró el perfil del estudiante.')
      const user = await userService.getById(student.userId)

      this.student = { ...student }
      this.user = { ...user }
      this.isLoaded = true
    } catch (error) {
      console.error('Error cargando perfil:', error)
    }
  },
  methods: {
    handleImageChange(event) {
      const file = event.target.files[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const maxWidth = 200
          const maxHeight = 200
          let width = img.width
          let height = img.height

          if (width > maxWidth || height > maxHeight) {
            const scale = Math.min(maxWidth / width, maxHeight / height)
            width *= scale
            height *= scale
          }

          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)

          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7)
          this.student.logo = compressedBase64
        }
        img.src = e.target.result
      }
      reader.readAsDataURL(file)
    },
    async saveChanges() {
      try {
        const studentService = new StudentService()
        const userService = new UserService()

        const originalUser = await userService.getById(this.user.id)
        const updatedUser = {
          ...originalUser,
          name: this.user.name,
          email: this.user.email
        }

        const studentUpdateRequest = {
          city: this.student.city,
          country: this.student.country,
          phoneNumber: this.student.phoneNumber,
          portfolioLink: this.student.portfolioLink,
          aboutMe: this.student.aboutMe,
          logo: this.student.logo,
          specializations: this.student.specializations
        }

        await userService.update(this.user.id, updatedUser)
        await studentService.update(this.student.id, studentUpdateRequest)

        alert('Cambios guardados exitosamente.')
        this.$router.push({ name: 'StudentProfile' })
      } catch (err) {
        console.error('Error guardando cambios:', err)
        alert('Ocurrió un error al guardar.')
      }
    },
    cancel() {
      this.$router.push({ name: 'StudentProfile' })
    }
  }
}
</script>

<template>
  <div class="edit-company" v-if="isLoaded">
    <h1>Mi Perfil</h1>

    <div class="edit-form">
      <div class="image-column">
        <img :src="student.logo || 'https://via.placeholder.com/150'" class="logo" />
        <input type="file" accept="image/*" @change="handleImageChange" />
      </div>

      <div class="fields">
        <label>Nombre completo</label>
        <input v-model="user.name" type="text" />

        <label>Fecha de Nacimiento</label>
        <input v-model="student.birthdate" type="date" />

        <label>Ciudad</label>
        <input v-model="student.city" type="text" />

        <label>País</label>
        <input v-model="student.country" type="text" />

        <label>Carrera</label>
        <input v-model="student.field" type="text" />

        <label>Correo Electrónico</label>
        <input v-model="user.email" type="email" />

        <label>Celular</label>
        <input v-model="student.phoneNumber" type="text" />

        <label>Acerca de mí</label>
        <textarea v-model="student.aboutMe" rows="4"></textarea>

        <label>Enlace a portafolio</label>
        <input v-model="student.portfolioLink" type="url" />
      </div>
    </div>

    <p class="subtitle">
      Tecnologías y Especializaciones
      <button class="change-btn" @click="showTagModal = true">Cambiar</button>
    </p>

    <div class="tags">
      <span class="tag" v-for="tag in student.specializations" :key="tag">{{ tag }}</span>
    </div>

    <div class="actions">
      <button class="cancel" @click="cancel">Cancelar</button>
      <button class="save" @click="saveChanges">Guardar Cambios</button>
    </div>

    <EditTagsModal
        v-if="showTagModal"
        v-model="student.specializations"
        @close="showTagModal = false"
    />
  </div>
</template>

<style scoped>
.edit-company {
  background: #f4f1ea;
  padding: 2rem;
  font-family: 'Nunito', sans-serif;
}

.edit-form {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin-bottom: 1.5rem;
}

.image-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1 1 300px;
}

.logo {
  width: 250px;
  height: 250px;
  object-fit: cover;
  border-radius: 50%;
  background: #eee;
  margin-bottom: 0.5rem;
}

.fields {
  flex: 2 1 400px;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.fields label {
  font-weight: bold;
  margin-top: 0.5rem;
}

.fields input,
.fields textarea {
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 0.95rem;
  width: 100%;
}

.subtitle {
  font-weight: 600;
  margin: 1rem 0 0.5rem;
}

input[type="file"] {
  margin-top: 0.5rem;
  font-size: 0.9rem;
}

.tags {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

.tag {
  background: #c9d8f0;
  color: #1c1f2b;
  font-size: 0.9rem;
  border-radius: 20px;
  padding: 0.4rem 0.8rem;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 1rem;
}

button {
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
}

.cancel {
  background: #1c1f2b;
  color: white;
}

.save {
  background: #FFD479;
  color: #1c1f2b;
}

.change-btn {
  margin-left: 1rem;
  background: #FFD479;
  font-size: 0.75rem;
  padding: 0.4rem 0.6rem;
}

/* ✅ Responsive Fix */
@media (max-width: 768px) {
  .edit-form {
    flex-direction: column;
    align-items: center;
  }

  .fields {
    width: 100%;
  }

  .image-column {
    width: 100%;
    align-items: center;
  }

  .actions {
    justify-content: center;
  }

  .logo {
    width: 200px;
    height: 200px;
  }
}

</style>

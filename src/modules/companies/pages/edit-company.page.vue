<script>
import { CompanyService } from '@/modules/companies/services/company.service.js'
import { UserService } from '@/modules/users/services/user.service.js'
import EditTagsModal from '@/shared/components/edit-tags-modal.component.vue'

export default {
  name: 'EditCompanyPage',
  components: { EditTagsModal },
  data() {
    return {
      company: null,
      user: null,
      isLoaded: false,
      showTagModal: false
    }
  },
  async created() {
    try {
      const companyService = new CompanyService()
      const userService = new UserService()

      const currentUserId = parseInt(localStorage.getItem('userId'))
      const allCompanies = await companyService.getAll()
      const company = allCompanies.find(c => c.userId === currentUserId)

      if (!company) throw new Error('No se encontró la empresa del usuario.')
      const user = await userService.getById(company.userId)

      this.company = { ...company }
      this.user = { ...user }
      this.isLoaded = true
    } catch (error) {
      console.error('Error cargando empresa:', error)
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
          this.company.logo = compressedBase64
        }
        img.src = e.target.result
      }
      reader.readAsDataURL(file)
    },
    async saveChanges() {
      try {
        const companyService = new CompanyService()
        const userService = new UserService()

        // Recuperar usuario completo y conservar campos no editables
        const originalUser = await userService.getById(this.user.id)
        const updatedUser = {
          ...originalUser,
          name: this.user.name
        }

        await userService.update(this.user.id, updatedUser)
        await companyService.update(this.company.id, this.company)

        alert('Cambios guardados exitosamente.')
        this.$router.push({ name: 'ManagerCompany' })
      } catch (err) {
        console.error('Error guardando cambios:', err)
        alert('Ocurrió un error al guardar.')
      }
    },
    cancel() {
      this.$router.push({ name: 'ManagerCompany' })
    }
  }
}
</script>

<template>
  <div class="edit-company" v-if="isLoaded">
    <h1>Mi Empresa</h1>

    <div class="edit-form">
      <div class="image-column">
        <img :src="company.logo || 'https://via.placeholder.com/150'" class="logo" />
        <input type="file" accept="image/*" @change="handleImageChange" />
      </div>

      <div class="fields">
        <label>Nombre</label>
        <input v-model="company.companyName" type="text" />

        <label>Creador</label>
        <input v-model="user.name" type="text" />

        <label>Ciudad/País</label>
        <input v-model="company.location" type="text" />

        <label>Enfoque</label>
        <input v-model="company.sector" type="text" />

        <label>Correo electrónico</label>
        <input v-model="company.email" type="email" />

        <label>Celular</label>
        <input v-model="company.phone" type="text" />
      </div>
    </div>

    <p class="subtitle">
      Tecnologías y Especializaciones dentro de la empresa
      <button class="change-btn" @click="showTagModal = true">Cambiar</button>
    </p>

    <div class="tags">
      <span class="tag" v-for="tag in company.specializations" :key="tag">{{ tag }}</span>
    </div>

    <div class="actions">
      <button class="cancel" @click="cancel">Cancelar</button>
      <button class="save" @click="saveChanges">Guardar Cambios</button>
    </div>

    <EditTagsModal
        v-if="showTagModal"
        v-model="company.specializations"
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

.fields input {
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 0.95rem;
  width: 100%;
}

input[type="file"] {
  margin-top: 0.5rem;
  font-size: 0.9rem;
}

.subtitle {
  font-weight: 600;
  margin: 1rem 0 0.5rem;
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
  justify-content: flex-end;
  flex-wrap: wrap;
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

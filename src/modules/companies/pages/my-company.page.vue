<script>
import { CompanyService } from '@/modules/companies/services/company.service.js'
import { UserService } from '@/modules/users/services/user.service.js'

export default {
  name: 'MyCompanyPage',
  components: {},
  data() {
    return {
      company: null,
      user: null,
      isLoaded: false
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

      this.company = company
      this.user = user
      this.isLoaded = true
    } catch (error) {
      console.error('Error cargando datos de la empresa:', error)
    }
  },
  methods: {
    goToEdit() {
      // Aquí está la corrección de la ruta
      this.$router.push({ name: 'EditCompany' })
    }
  }
}
</script>

<template>
  <div class="layout">
    <div class="content" v-if="isLoaded">
      <h1>Mi Empresa</h1>

      <div class="company-card">
        <div class="left">
          <img class="logo" :src="company.logo || 'https://via.placeholder.com/150'" alt="Logo Empresa" />
        </div>

        <div class="right">
          <p><strong>Nombre:</strong> {{ company.companyName }}</p>
          <p><strong>Creador:</strong> {{ user.name }}</p>
          <p><strong>Ciudad/País:</strong> {{ company.location }}</p>
          <p><strong>Enfoque:</strong> {{ company.sector }}</p>
          <p><strong>Correo electrónico:</strong> {{ company.email }}</p>
          <p><strong>Celular:</strong> {{ company.phone }}</p>

          <div class="rating">
            <span>⭐ {{ company.rating }}</span>
          </div>

          <p class="description">{{ company.description }}</p>

          <div class="tags">
            <span v-for="(tag, index) in company.specializations" :key="index" class="tag">{{ tag }}</span>
          </div>

          <button class="edit-btn" @click="goToEdit">Modificar perfil</button>
        </div>
      </div>
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

.company-card {
  display: flex;
  background: white;
  border: 2px solid #222;
  border-radius: 10px;
  padding: 2rem;
  gap: 2rem;
  align-items: center;
  flex-wrap: wrap;
}

.left {
  flex: 0 0 200px;
  text-align: center;
}

.logo {
  width: 200px;
  height: 200px;
  border-radius: 10px;
  object-fit: cover;
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
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background-color: #cfd8dc;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  display: inline-block;
  font-size: 0.9rem;
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

@media (max-width: 768px) {
  .company-card {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem;
  }

  .left, .right {
    flex: 1 1 100%;
  }

  .logo {
    width: 150px;
    height: 150px;
  }

  .edit-btn {
    width: 100%;
  }
}

</style>

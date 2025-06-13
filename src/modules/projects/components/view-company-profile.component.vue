<script>
import { CompanyService } from '@/modules/companies/services/company.service.js'
import { UserService } from '@/modules/users/services/user.service.js'

export default {
  name: 'CompanyProfilePage',
  data() {
    return {
      company: null,
      user: null,
      isLoaded: false,
      error: null
    }
  },
  async created() {
    try {
      const companyId = this.$route.params.id
      const companyService = new CompanyService()
      const userService = new UserService()

      const company = await companyService.getById(companyId)
      if (!company) throw new Error('Empresa no encontrada')

      const user = await userService.getById(company.userId)

      this.company = company
      this.user = user
      this.isLoaded = true
    } catch (error) {
      console.error('Error cargando datos de la empresa:', error)
      this.error = 'No se pudo cargar la información de la empresa'
    }
  }
}
</script>

<template>
  <div class="layout">
    <router-link
        :to="{ name: 'StudentProjectDetail', params: { id: $route.params.id } }"
        class="back-link"
    >
      ← Volver al proyecto
    </router-link>

    <div v-if="error" class="error">
      {{ error }}
    </div>

    <div class="content" v-if="isLoaded && !error">
      <h1>{{ company.companyName }}</h1>

      <div class="company-card">
        <div class="left">
          <img class="logo" :src="company.logo || 'https://via.placeholder.com/150'" alt="Logo Empresa" />
        </div>

        <div class="right">
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
        </div>
      </div>
    </div>

    <div v-else-if="!error" class="loading">
      Cargando información de la empresa...
    </div>
  </div>
</template>

<style scoped>
.layout {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.back-link {
  display: inline-block;
  margin-bottom: 20px;
  color: #4a89dc;
  text-decoration: none;
}

.company-card {
  display: flex;
  gap: 30px;
  margin-top: 20px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.left {
  flex: 0 0 150px;
}

.logo {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
}

.right {
  flex: 1;
}

.rating {
  margin: 10px 0;
  font-size: 1.1em;
}

.description {
  margin: 15px 0;
  line-height: 1.6;
}

.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 15px;
}

.tag {
  background: #f0f0f0;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.9em;
}

.loading, .error {
  text-align: center;
  padding: 40px;
  font-size: 1.2em;
}

.error {
  color: #e74c3c;
}
</style>
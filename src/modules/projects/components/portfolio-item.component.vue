<template>
  <div class="portfolio-card">
    <h3 class="card-title">{{ project.title }}</h3>
    <p class="description">{{ project.description }}</p>

    <div v-if="!hasRated" class="rating-form">
      <label>Califica tu experiencia con la empresa:</label>
      <select v-model="ratingValue">
        <option disabled value="">Selecciona</option>
        <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
      </select>
      <button @click="submitRating">Enviar Calificación</button>
    </div>

    <div v-else class="already-rated">
      Ya calificaste a esta empresa con: <strong>{{ ratingValue }}</strong>/5
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { CompanyService } from '@/modules/companies/services/company.service';

export default {
  name: 'PortfolioItem',
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const ratingValue = ref('');
    const hasRated = ref(false);

    const storageKey = `rated-company-${props.project.companyId}-project-${props.project.id}`;

    onMounted(() => {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        ratingValue.value = parseInt(saved);
        hasRated.value = true;
      }
    });

    const submitRating = async () => {
      if (!ratingValue.value) return;

      const companyService = new CompanyService();
      try {
        const company = await companyService.getById(props.project.companyId);

        if (!company || typeof company.rating !== 'number') {
          company.rating = ratingValue.value;
        } else {
          // Simple promedio entre rating actual y nueva calificación
          company.rating = ((company.rating + parseInt(ratingValue.value)) / 2).toFixed(1);
        }

        await companyService.update(company.id, company);

        // Marcar como calificado
        localStorage.setItem(storageKey, ratingValue.value);
        hasRated.value = true;

      } catch (error) {
        console.error('Error al calificar empresa:', error);
      }
    };

    return { ratingValue, hasRated, submitRating };
  }
};
</script>

<style scoped>
.portfolio-card {
  background: white;
  border-radius: 8px;
  padding: 1.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-title {
  margin: 0 0 0.5rem 0;
  font-weight: bold;
  font-size: 1.1rem;
  color: #1C1F2B;
}

.description {
  font-size: 0.9rem;
  color: #4B5563;
  margin-bottom: 1rem;
}

.rating-form select {
  margin: 0.5rem 0;
  padding: 0.4rem;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.rating-form button {
  background-color: #FFD479;
  color: #1c1f2b;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
}

.already-rated {
  color: #10b981;
  font-weight: bold;
}
</style>

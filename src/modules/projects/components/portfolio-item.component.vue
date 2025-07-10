<template>
  <div class="portfolio-card">
    <div class="left">
      <h3 class="card-title">{{ project.title }}</h3>
      <p class="description">{{ project.description }}</p>
    </div>

    <div class="right">
      <div v-if="!hasRated" class="rating-form">
        <label>Califica a la empresa:</label>
        <div class="input-group">
          <select v-model="ratingValue">
            <option disabled value="">Selecciona</option>
            <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
          </select>
          <button @click="submitRating">Enviar</button>
        </div>
      </div>

      <div v-else class="already-rated">
        Ya calificaste a esta empresa con: <strong>{{ ratingValue }}</strong>/5
      </div>
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

    // Verifica si ya calificó al montar
    onMounted(() => {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        ratingValue.value = parseInt(saved);
        hasRated.value = true;
      }
    });

    const submitRating = async () => {
      // Evita múltiples envíos
      if (hasRated.value || !ratingValue.value) return;

      const companyService = new CompanyService();

      try {
        const company = await companyService.getById(props.project.companyId);

        if (!company || typeof company.rating !== 'number') {
          company.rating = ratingValue.value;
        } else {
          company.rating = ((company.rating + parseInt(ratingValue.value)) / 2).toFixed(1);
        }

        await companyService.update(company.id, company);
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
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  background: white;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  border-left: 8px solid #fdd567;
  gap: 1rem;
  flex-wrap: wrap;
}

.left {
  flex: 1;
  min-width: 250px;
}

.right {
  min-width: 250px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.rating-form {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.rating-form label {
  font-weight: 500;
  font-size: 0.95rem;
  margin-bottom: 0.3rem;
  text-align: left;
}

.input-group {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.rating-form select {
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
  font-weight: bold;
}

.already-rated {
  color: #10b981;
  font-weight: bold;
  font-size: 0.95rem;
}

/* Responsive */
@media (max-width: 600px) {
  .portfolio-card {
    flex-direction: column;
    align-items: stretch;
  }

  .right {
    width: 100%;
    align-items: flex-start;
  }

  .input-group {
    flex-direction: column;
    width: 100%;
  }

  .rating-form select,
  .rating-form button {
    width: 100%;
  }
}
</style>



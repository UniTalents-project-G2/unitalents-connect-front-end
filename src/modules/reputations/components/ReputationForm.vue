<script>
export default {
  name: 'ReputationForm',
  props: {
    studentId: Number,
    projectId: Number
  },
  data() {
    return {
      comment: '',
      rating: 1,
      loading: false,
      error: null
    };
  },
  methods: {
    async submitReputation() {
      this.loading = true;
      try {
        await this.$emit('submit', {
          studentId: this.studentId,
          projectId: this.projectId,
          comment: this.comment,
          rating: this.rating
        });
        this.comment = '';
        this.rating = 1;
      } catch (err) {
        this.error = 'Ocurrió un error al guardar la reputación';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<template>
  <div class="reputation-form">
    <h3>Calificar desempeño del estudiante</h3>
    <textarea v-model="comment" placeholder="Deja un comentario..." rows="4"></textarea>
    <label>Calificación:</label>
    <select v-model="rating">
      <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
    </select>
    <button @click="submitReputation" :disabled="loading">
      {{ loading ? 'Guardando...' : 'Guardar reputación' }}
    </button>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<style scoped>
.reputation-form {
  margin-top: 2rem;
  background: #f9fafb;
  padding: 1rem;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
}
textarea, select {
  width: 100%;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
}
button {
  background-color: #ffd479;
  padding: 0.5rem 1rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
}
.error {
  color: red;
  margin-top: 0.5rem;
}
</style>

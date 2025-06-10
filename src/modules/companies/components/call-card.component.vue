<script>
export default {
  name: 'CallCard',
  props: {
    project: Object
  },
  computed: {
    postulantCount() {
      return this.project.postulants?.length || 0;
    }
  },
  methods: {
    goToDetails() {
      this.$router.push(`/projects/${this.project.id}`);
    }
  }
}
</script>

<template>
  <div class="card">
    <h3>{{ project.title }}</h3>
    <p><i class="icon">👤</i> {{ postulantCount }} personas pendientes</p>
    <p class="timestamp">hace 1 semana</p>
    <button @click="goToDetails">Ver más</button>
  </div>
</template>

<style scoped>
.card {
  background: white;
  border: 2px solid #333;
  border-radius: 8px;
  padding: 1rem;
  width: 260px;
  margin: 1rem;
  text-align: center;
}
.card h3 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}
.card .icon {
  margin-right: 5px;
}
.card .timestamp {
  font-size: 0.9rem;
  color: gray;
  margin: 0.5rem 0;
}
button {
  background-color: #fdd567;
  border: none;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  cursor: pointer;
}
</style>

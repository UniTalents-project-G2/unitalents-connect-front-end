<script>
export default {
  name: 'ProjectCard',
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  methods: {
    viewDetails() {
      this.$router.push({
        name: 'StudentProjectDetail',
        params: { id: this.project.id }
      });
    },
    formatRelativeDate(dateString) {
      const createdAt = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - createdAt);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return 'Hoy';
      if (diffDays === 1) return 'Hace 1 día';
      return `Hace ${diffDays} días`;
    }
  }
}
</script>

<template>
  <div class="card">
    <h3 class="title">{{ project.title }}</h3>
    <p class="company">{{ project.companyName }}</p>

    <div class="footer">
      <div class="price">
        $ {{ project.budget }}
      </div>

      <div class="date">{{ formatRelativeDate(project.createdAt) }}</div>
    </div>

    <button @click="viewDetails">Postularme</button>
  </div>
</template>

<style scoped>
.card {
  border: 1px solid #333;
  padding: 20px;
  border-radius: 10px;
  width: 280px;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
  box-shadow: 0px 2px 4px rgba(0,0,0,0.1);
}

.title {
  font-weight: bold;
  font-size: 1.2rem;
  color: #1C1F2B;
}

.company {
  color: #333;
  font-weight: 400;
  font-size: 1rem;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  font-weight: bold;
  font-size: 1.5rem;
  color: #000;
}

.date {
  font-size: 0.9rem;
  color: #666;
}

button {
  background-color: #FFD479;
  border: none;
  padding: 10px 25px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
  color: #1C1F2B;
  transition: 0.3s;
  align-self: center;
}

button:hover {
  background-color: #f3c13c;
}
</style>

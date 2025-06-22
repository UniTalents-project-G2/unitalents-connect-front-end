<template>
  <div class="postulation-card">
    <div class="card-content">
      <div class="text-content">
        <h3 class="project-title">{{ project.title }}</h3>
        <p class="company-name">{{ company?.companyName }}</p>
      </div>
      <div class="status-content">
        <span :class="['status-chip', statusClass]">
          {{ statusText }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "StudentPostulationItem",
  props: {
    postulation: Object,
    project: Object,
    company: Object
  },
  computed: {
    statusClass() {
      const statusMap = {
        enviado: 'pending',
        'en revisión': 'review',
        aceptado: 'accepted',
        rechazado: 'rejected',
        finalizado: 'finalized'
      };
      return statusMap[this.postulation.status] || '';
    },
    statusText() {
      const textMap = {
        enviado: 'Enviado',
        'en revisión': 'En Revisión',
        aceptado: 'Aceptado',
        rechazado: 'Rechazado',
        finalizado: 'Finalizado'
      };
      return textMap[this.postulation.status] || this.postulation.status;
    }
  }
};
</script>

<style scoped>
.postulation-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: transform 0.2s;
}

.postulation-card:hover {
  transform: translateY(-3px);
}

.card-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.text-content {
  display: flex;
  flex-direction: column;
}

.project-title {
  margin: 0 0 8px 0;
  font-size: 1.3rem;
  color: #222;
}

.company-name {
  margin: 0;
  font-size: 1rem;
  color: #666;
}

.status-content {
  margin-left: 20px;
}

.status-chip {
  padding: 6px 18px;
  border-radius: 16px;
  font-size: 0.9rem;
  font-weight: bold;
  text-transform: uppercase;
}

.status-chip.pending {
  background-color: #FFC107;
  color: #212121;
}

.status-chip.review {
  background-color: #2196F3;
  color: white;
}

.status-chip.accepted {
  background-color: #4CAF50;
  color: white;
}

.status-chip.rejected {
  background-color: #F44336;
  color: white;
}

.status-chip.finalized {
  background-color: #4CAF50;
  color: white;
}
</style>

<script>
export default {
  name: 'ReputationCard',
  props: {
    reputation: Object
  }
}
</script>

<template>
  <div class="reputation-card">
    <div class="left">
      <h3>{{ reputation.projectTitle }}</h3>
      <p class="company">{{ reputation.companyName }}</p>
      <p class="rating">⭐ {{ reputation.rating }}</p>
    </div>
    <div class="right">
      <p class="comment">"{{ reputation.comment }}"</p>
    </div>
  </div>
</template>

<style scoped>
.reputation-card {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border: 2px solid #222;
  border-radius: 10px;
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
  background: white;
}

.left {
  flex: 1;
}

.right {
  flex: 1;
  text-align: right;
}

.company {
  color: #555;
  margin: 0.3rem 0;
}

.rating {
  font-weight: 500;
  font-size: 1.1rem;
  margin-top: 0.5rem;
}

.comment {
  font-style: italic;
  color: #555;
  font-size: 1rem;
}
</style>

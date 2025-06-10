<script>
export default {
  name: 'ReputationCard',
  props: {
    reputation: Object
  }
}
</script>

<template>
  <div class="card">
    <h3>{{ reputation.projectTitle }}</h3>
    <p class="company">{{ reputation.companyName }}</p>
    <p class="rating">⭐ {{ reputation.rating }}</p>
    <p class="comment">“{{ reputation.comment }}”</p>
  </div>
</template>

<style scoped>
.card {
  border: 2px solid #333;
  border-radius: 10px;
  background-color: #fff;
  padding: 1rem;
  margin-bottom: 1rem;
}

.company {
  font-size: 0.9rem;
  color: #555;
  margin-top: -5px;
}

.rating {
  margin: 0.5rem 0;
}

.comment {
  font-style: italic;
  color: #222;
}
</style>

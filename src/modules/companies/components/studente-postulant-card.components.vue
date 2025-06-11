<script>
export default {
  name: 'StudentPostulantCard',
  props: {
    student: Object,
    projectId: Number
  }
}
</script>

<template>
  <div class="card">
    <div class="left">
      <img class="avatar" :src="student.image || 'https://i.pravatar.cc/100?img=3'" alt="Foto del estudiante" />
    </div>
    <div class="center">
      <h3>{{ student.name }}</h3>
      <p class="field">{{ student.field }}</p>
      <p class="rating">⭐ {{ student.rating }}</p>
      <a v-if="student.portfolioLink" :href="student.portfolioLink" class="portfolio" target="_blank">Ver portafolio</a>
      <div class="tags">
        <span class="tag" v-for="(skill, index) in student.skills" :key="index">{{ skill }}</span>
      </div>
    </div>
    <div class="right">
      <router-link
          class="reputation-btn"
          :to="{ name: 'ManagerStudentReputation', params: { studentId: student.id }, query: { projectId: projectId } }"
      >
        Ver reputación
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  border: 2px solid #222;
  border-radius: 10px;
  padding: 1rem;
  margin: 1rem 0;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}

.left {
  flex: 0 0 90px;
}

.center {
  flex: 1;
  padding: 0 1rem;
}

.center h3 {
  margin: 0;
}

.field {
  color: #555;
  margin-top: 4px;
}

.rating {
  font-size: 1rem;
  margin-top: 6px;
}

.portfolio {
  display: inline-block;
  margin-top: 6px;
  color: #007BFF;
  text-decoration: underline;
}

.tags {
  margin-top: 10px;
}

.tag {
  background-color: #e6eef6;
  border-radius: 12px;
  padding: 0.2rem 0.6rem;
  margin-right: 5px;
  font-size: 0.8rem;
  display: inline-block;
}

.right {
  flex: 0 0 150px;
  text-align: right;
}

.reputation-btn {
  background-color: #fdd567;
  border: none;
  border-radius: 6px;
  padding: 0.6rem 1rem;
  cursor: pointer;
  text-decoration: none;
  color: black;
  display: inline-block;
  text-align: center;
}
</style>

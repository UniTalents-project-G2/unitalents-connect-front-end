<!-- src/modules/projects/pages/student-postulations.page.vue -->
<template>
  <div class="postulations-page">
    <h1>Mis Postulaciones</h1>

    <div v-if="loading" class="loading">
      Cargando tus postulaciones...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else-if="postulations.length === 0" class="empty-state">
      <p>No has postulado a ninguna oportunidad todavía.</p>
      <router-link
          :to="{ name: 'StudentOpportunities', params: { studentId: studentId } }"
          class="explore-btn"
      >
        Explorar oportunidades
      </router-link>
    </div>

    <StudentPostulationList
        v-else
        :student-id="studentId"
    />
  </div>
</template>

<script>
import StudentPostulationList from "@/modules/student-postulations/components/student-postulation-list.vue";
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: 'StudentPostulationsPage',
  components: {
    StudentPostulationList
  },
  setup() {
    const route = useRoute();
    const studentId = ref(parseInt(route.params.studentId));
    const loading = ref(false);
    const error = ref(null);

    return {
      studentId,
      loading,
      error
    };
  }
};
</script>

<style scoped>
.postulations-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.loading, .error {
  text-align: center;
  padding: 40px;
}

.error {
  color: #F44336;
}

.empty-state {
  text-align: center;
  padding: 40px;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.explore-btn {
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #4a89dc;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}

.explore-btn:hover {
  background-color: #3a70c2;
}
</style>
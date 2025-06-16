<template>
  <div class="postulations-page">
    <h1>Mis Postulaciones</h1>

    <StudentPostulationList :student-id="studentId" />
  </div>
</template>

<script>
import StudentPostulationList from "@/modules/student-postulations/components/student-postulation-list.vue";
import { ref } from 'vue';

export default {
  name: 'StudentPostulationsPage',
  components: { StudentPostulationList },
  setup() {
    const studentId = ref(parseInt(localStorage.getItem('userId')));
    return { studentId };
  }
};
</script>

<style scoped>
.postulations-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}
</style>

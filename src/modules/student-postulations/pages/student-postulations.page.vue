<template>
  <div class="postulations-page">
    <h1>Mis Postulaciones</h1>
    <StudentPostulationList v-if="studentId !== null" :student-id="studentId" />
    <div v-else class="error">No se pudo obtener el ID del estudiante</div>
  </div>
</template>

<script>
import StudentPostulationList from "@/modules/student-postulations/components/student-postulation-list.vue";
import { ref, onMounted } from 'vue';
import { StudentService } from "@/modules/students/services/student.service.js";

export default {
  name: 'StudentPostulationsPage',
  components: { StudentPostulationList },
  setup() {
    const studentId = ref(null);
    const studentService = new StudentService();

    onMounted(async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) throw new Error("No userId in localStorage");
        const student = await studentService.getByUserId(userId);
        studentId.value = student.id;
      } catch (err) {
        console.error("No se pudo obtener el studentId:", err);
      }
    });

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
.error {
  color: red;
  text-align: center;
}
</style>

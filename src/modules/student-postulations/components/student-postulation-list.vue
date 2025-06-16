<template>
  <div class="postulation-list">
    <div v-if="loading" class="loading">
      Cargando postulaciones...
    </div>

    <div v-else-if="error" class="error">
      {{ error }}
    </div>

    <div v-else-if="postulations.length === 0" class="empty">
      No tienes postulaciones registradas.
    </div>

    <StudentPostulationItem
        v-for="postulation in postulations"
        :key="postulation.id"
        :postulation="postulation"
        :project="getProject(postulation.projectId)"
        :company="getCompany(postulation.projectId)"
    />
  </div>
</template>

<script>
import StudentPostulationItem from './student-postulation-item.vue';
import { postulationService } from "@/modules/student-postulations/services/postulation.service.js";
import { projectService } from '@/modules/projects/services/project.service';
import { CompanyService } from "@/modules/companies/services/company.service.js";
import { ref, onMounted } from 'vue';

export default {
  name: 'StudentPostulationList',
  components: { StudentPostulationItem },
  props: {
    studentId: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const postulations = ref([]);
    const projects = ref([]);
    const companies = ref([]);
    const loading = ref(true);
    const error = ref(null);

    const companyService = new CompanyService();

    const loadData = async () => {
      try {
        const [postulationsRes, projectsRes] = await Promise.all([
          postulationService.getByStudent(props.studentId),
          projectService.getAll()
        ]);

        postulations.value = postulationsRes;
        projects.value = projectsRes;

        const companyIds = [...new Set(projectsRes.map(p => p.companyId))];
        companies.value = await Promise.all(
            companyIds.map(id => companyService.getById(id))
        );
      } catch (err) {
        error.value = 'Error al cargar las postulaciones';
        console.error(err);
      } finally {
        loading.value = false;
      }
    };

    const getProject = (projectId) => {
      return projects.value.find(p => p.id === projectId) || {};
    };

    const getCompany = (projectId) => {
      const project = getProject(projectId);
      return companies.value.find(c => c.id === project?.companyId) || {};
    };

    onMounted(loadData);

    return {
      postulations,
      loading,
      error,
      getProject,
      getCompany
    };
  }
};
</script>

<style scoped>
.postulation-list {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.loading, .error, .empty {
  text-align: center;
  padding: 40px;
}

.error { color: #F44336; }
</style>

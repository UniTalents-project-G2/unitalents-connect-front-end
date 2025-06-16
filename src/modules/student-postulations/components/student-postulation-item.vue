<!-- src/modules/projects/components/student-postulation-item.vue -->
<!-- src/modules/projects/components/student-postulation-list.vue -->
<template>
  <div class="postulation-list">
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
import { postulationService} from "@/modules/student-postulations/services/postulation.service.js";
import { projectService } from '@/modules/projects/services/project.service';
import { CompanyService } from '@/modules/companies/services/company.service';
import { ref, onMounted } from 'vue';

export default {
  name: 'StudentPostulationList',
  components: {
    StudentPostulationItem
  },
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

        // Usando tu CompanyService directamente
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
      return companies.value.find(c => c.id === project?.companyId) || null;
    };

    onMounted(loadData);

    return {
      postulations,
      projects,
      loading,
      error,
      getProject,
      getCompany
    };
  }
};
</script>

<style scoped>
.postulation-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 16px;
  margin-bottom: 12px;
  cursor: pointer;
  transition: transform 0.2s;
}

.postulation-card:hover {
  transform: translateY(-2px);
}

.card-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text-content {
  flex: 1;
}

.project-title {
  margin: 0 0 4px 0;
  font-size: 1.1rem;
  color: #333;
}

.company-name {
  margin: 0;
  font-size: 0.9rem;
  color: #666;
}

.status-chip {
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 500;
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
</style>
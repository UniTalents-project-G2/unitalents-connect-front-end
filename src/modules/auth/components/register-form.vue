<script>
import { UserService} from "@/modules/auth/services/user.service.js";
import { FieldService } from '@/shared/services/field.service';
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";
import { CompanyService } from "@/modules/companies/services/company.service.js";
import {StudentService} from "@/modules/students/services/student.service.js";

export default {
  name: 'RegisterForm',
  setup() {
    const toast = useToast();
    const router = useRouter();
    return { toast, router };
  },
  data() {
    return {
      form: {
        name: '',
        email: '',
        password: '',
        fieldId: '',
        role: 'student'
      },
      fields: [],
      userService: new UserService(),
      fieldService: new FieldService(),
      studentService: new StudentService(),
      companyService: new CompanyService()
    };
  },
  methods: {
    async loadFields() {
      try {
        const response = await this.fieldService.getAll();
        this.fields = response.data;
      } catch (error) {
        this.toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load fields',
          life: 3000
        });
      }
    },
    redirectToLogin() {
      this.router.push('/login');
    },
    async handleSubmit() {
      try {
        // 1. Crear usuario
        const res = await this.userService.create(this.form);
        const user = res.data;

        // 2. Crear perfil según el rol
        if (user.role === 'student') {
          const field = this.fields.find(f => f.id === this.form.fieldId);
          await this.studentService.create({
            userId: user.id,
            field: field?.name || '',
            portfolioLink: '',
            aboutMe: ''
          });
        } else if (user.role === 'manager') {
          await this.companyService.create({
            userId: user.id,
            name: '',  // Podés pedirlo en otro paso
            focus: '',
            phone: '',
            email: user.email,
            location: ''
          });
        }

        // 3. Feedback y redirección
        this.toast.add({
          severity: 'success',
          summary: 'Registro exitoso',
          detail: 'Redirigiendo al login...',
          life: 2500
        });

        setTimeout(() => {
          this.router.push('/login');
        }, 2500);

      } catch (error) {
        this.toast.add({
          severity: 'error',
          summary: 'Fallo en el registro',
          detail: error.message || 'Ocurrió un error',
          life: 3000
        });
      }
    }
  },
  mounted() {
    this.loadFields();
  }
};
</script>

<template>
  <div class="auth-form-container">
    <form @submit.prevent="handleSubmit" class="auth-form">
      <h1 class="form-title">Register</h1>

      <div class="form-group">
        <label for="name">Full Name</label>
        <input
            id="name"
            v-model="form.name"
            type="text"
            class="form-input"
            required
        />
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input
            id="email"
            v-model="form.email"
            type="email"
            class="form-input"
            required
        />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input
            id="password"
            v-model="form.password"
            type="password"
            class="form-input"
            required
        />
      </div>

      <div class="form-group">
        <label for="field">Field</label>
        <select
            id="field"
            v-model="form.fieldId"
            class="form-input"
            required
        >
          <option disabled value="">Select a field</option>
          <option v-for="field in fields" :key="field.id" :value="field.id">
            {{ field.name }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label>Role</label>
        <div class="role-options">
          <label>
            <input
                type="radio"
                v-model="form.role"
                value="student"
                class="role-radio"
            /> Student
          </label>
          <label>
            <input
                type="radio"
                v-model="form.role"
                value="manager"
                class="role-radio"
            /> Manager
          </label>
        </div>
      </div>

      <button type="submit" class="submit-button">
        Register
      </button>

      <div class="form-footer">
        <span>Already have an account?</span>
        <a @click="redirectToLogin" class="auth-link">Sign In</a>
      </div>
    </form>
  </div>
</template>

<style scoped>
.auth-form-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background-color: #F5F0E6;
}

.auth-form {
  width: 100%;
  max-width: 400px;
}

.form-title {
  color: #1C1F2B;
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #1C1F2B;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  background-color: #FFFFFF;
}

select.form-input {
  height: 42px;
}

.role-options {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.role-options label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.role-radio {
  margin: 0;
}

.submit-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #FFD479;
  color: #1C1F2B;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #2E3440;
  color: #FFFFFF;
}

.form-footer {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.875rem;
  color: #6B7280;
}

.auth-link {
  color: #1C1F2B;
  text-decoration: none;
  font-weight: 500;
  margin-left: 0.5rem;
  cursor: pointer;
}


</style>
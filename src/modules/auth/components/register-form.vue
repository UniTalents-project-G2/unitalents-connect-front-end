<script>
import { UserService } from "@/modules/auth/services/user.service.js";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";
import { CompanyService } from "@/modules/companies/services/company.service.js";
import { StudentService } from "@/modules/students/services/student.service.js";

export default {
  name: 'RegisterForm',
  setup() {
    const toast = useToast();
    const router = useRouter();
    return { toast, router };
  },
  data() {
    return {
      role: 'student',
      userService: new UserService(),
      studentService: new StudentService(),
      companyService: new CompanyService(),
      form: {
        name: '',
        email: '',
        password: '',
        field: '', // texto libre
        birthdate: '',
        city: '',
        country: '',
        phoneNumber: '',
        portfolioLink: '',
        companyName: '',
        sector: '',
        location: '',
        phone: ''
      }
    };
  },
  methods: {
    redirectToLogin() {
      this.$router.push('/login');
    },
    async handleSubmit() {
      try {
        const res = await this.userService.create({
          name: this.form.name,
          email: this.form.email,
          password: this.form.password,
          role: this.role
        });
        const user = res.data;

        if (this.role === 'student') {
          await this.studentService.create({
            userId: user.id,
            birthdate: this.form.birthdate,
            city: this.form.city,
            country: this.form.country,
            field: this.form.field, // ahora texto
            phoneNumber: this.form.phoneNumber,
            portfolioLink: this.form.portfolioLink,
            rating: 5,
            specializations: [],
            logo: '',
            aboutMe: '',
            endedProjects: []
          });
        } else if (this.role === 'company') {
          await this.companyService.create({
            userId: user.id,
            companyName: this.form.companyName,
            sector: this.form.sector,
            location: this.form.location,
            phone: this.form.phone,
            email: this.form.email,
            rating: 5,
            specializations: [],
            logo: '',
            description: null
          });
        }

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
  }
};
</script>


<template>
  <div class="auth-form-container">
    <form @submit.prevent="handleSubmit" class="auth-form">
      <h1 class="form-title">Register</h1>

      <!-- Toggle Role -->
      <div class="form-group">
        <label>Register as:</label>
        <div class="role-options">
          <label><input type="radio" v-model="role" value="student" /> Student</label>
          <label><input type="radio" v-model="role" value="company" /> Company</label>
        </div>
      </div>

      <!-- Common fields -->
      <div class="form-group">
        <label for="name">Full Name</label>
        <input id="name" v-model="form.name" type="text" class="form-input" required />
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input id="email" v-model="form.email" type="email" class="form-input" required />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input id="password" v-model="form.password" type="password" class="form-input" required />
      </div>

      <!-- Student fields -->
      <template v-if="role === 'student'">
        <div class="form-grid">
          <div class="form-group">
            <label for="birthdate">Birthdate</label>
            <input id="birthdate" v-model="form.birthdate" type="date" class="form-input" />
          </div>
          <div class="form-group">
            <label for="city">City</label>
            <input id="city" v-model="form.city" type="text" class="form-input" />
          </div>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label for="country">Country</label>
            <input id="country" v-model="form.country" type="text" class="form-input" />
          </div>
          <div class="form-group">
            <label for="phoneNumber">Phone</label>
            <input id="phoneNumber" v-model="form.phoneNumber" type="text" class="form-input" />
          </div>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label for="portfolioLink">Portfolio Link</label>
            <input id="portfolioLink" v-model="form.portfolioLink" type="url" class="form-input"  />
          </div>
          <div class="form-group">
            <label for="field">Field</label>
            <input id="field" v-model="form.field" type="text" class="form-input" />
          </div>

        </div>

      </template>

      <!-- Company fields -->
      <template v-if="role === 'company'">
        <div class="form-group">
          <label for="companyName">Company Name</label>
          <input id="companyName" v-model="form.companyName" type="text" class="form-input" />
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label for="sector">Sector</label>
            <input id="sector" v-model="form.sector" type="text" class="form-input" />
          </div>
          <div class="form-group">
            <label for="location">Location</label>
            <input id="location" v-model="form.location" type="text" class="form-input" />
          </div>
        </div>

        <div class="form-group">
          <label for="phone">Phone</label>
          <input id="phone" v-model="form.phone" type="text" class="form-input" />
        </div>
      </template>

      <button type="submit" class="submit-button">Register</button>

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
  align-items: start;
  padding: 2rem;
  background-color: #F5F0E6;
  overflow-y: auto;
}

.auth-form {
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 1rem;
  background-color: #F5F0E6;
  border-radius: 12px;
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

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

@media (max-width: 600px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}

</style>
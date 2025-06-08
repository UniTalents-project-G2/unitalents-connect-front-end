<template>
  <form @submit.prevent="handleSubmit" class="auth-form">
    <h1 class="form-title">Sign In</h1>

    <div class="form-group">
      <label for="email">Correo Electrónico</label>
      <input
          id="email"
          v-model="form.email"
          type="email"
          class="form-input"
          placeholder="tu@email.com"
          required
      />
    </div>

    <div class="form-group">
      <label for="password">Contraseña</label>
      <input
          id="password"
          v-model="form.password"
          type="password"
          class="form-input"
          placeholder="••••••••"
          required
      />
    </div>

    <button type="submit" class="submit-button">
      Ingresar
    </button>

    <div class="form-footer">
      <p>¿No tienes cuenta? <router-link to="/register">Regístrate</router-link></p>
      <router-link to="/recover-password" class="forgot-password">
        ¿Olvidaste tu contraseña?
      </router-link>
    </div>
  </form>
</template>

<script>
import { UserService } from "@/modules/auth/services/user.service.js";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";

export default {
  emits: ['success', 'error'],
  setup() {
    const toast = useToast();
    const router = useRouter();
    const userService = new UserService();
    return { toast, router, userService };
  },
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
    };
  },
  methods: {
    async handleSubmit() {
      try {
        const response = await this.userService.getByEmail(this.form.email);
        const users = response.data;

        if (users.length === 0) {
          throw new Error("Correo no registrado");
        }

        const user = users[0];

        if (user.password !== this.form.password) {
          throw new Error("Contraseña incorrecta");
        }

        // Aquí podrías guardar el user en localStorage/sessionStorage si necesitás mantener sesión
        // localStorage.setItem('user', JSON.stringify(user));

        this.toast.add({
          severity: "success",
          summary: "Bienvenido",
          detail: `Redirigiendo como ${user.role}`,
          life: 2000,
        });

        this.$emit('success');

        const roleRoutes = {
          manager: (id) => `/manager/${id}/projects`,
          student: (id) => `/student/${id}/opportunities`,
        };

        const targetRoute = roleRoutes[user.role]?.(user.id) || "/";


        setTimeout(() => {
          this.router.push(targetRoute);
        }, 2000);

      } catch (error) {
        this.$emit("error", error);
        this.toast.add({
          severity: "error",
          summary: "Error de autenticación",
          detail: error.message || "Ocurrió un error",
          life: 3000,
        });
      }
    },
  },
};
</script>


<style scoped>
.auth-form {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
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
  background-color: #F9FAFB;
  transition: border-color 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #1C1F2B;
  box-shadow: 0 0 0 2px rgba(28, 31, 43, 0.1);
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
  transition: background-color 0.3s;
  margin-top: 1rem;
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

.form-footer a {
  color: #1C1F2B;
  text-decoration: none;
  font-weight: 500;
}

.form-footer a:hover {

  text-decoration: underline;
}

.forgot-password {
  display: block;
  margin-top: 0.5rem;
  color: #6B7280;
}
</style>
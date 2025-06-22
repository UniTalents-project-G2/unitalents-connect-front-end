<script>
import { UserService } from "@/modules/auth/services/user.service.js";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";

export default {
  name: "RecoverPassword",
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
        confirmPassword: ""
      },
      isSubmitting: false
    };
  },
  computed: {
    passwordMismatch() {
      return (
          this.form.password &&
          this.form.confirmPassword &&
          this.form.password !== this.form.confirmPassword
      );
    }
  },
  methods: {
    async handleSubmit() {
      if (this.passwordMismatch) return;

      this.isSubmitting = true;

      try {
        const response = await this.userService.getByEmail(this.form.email);
        const users = response.data;

        if (!users.length) {
          throw new Error("Correo no registrado");
        }

        const user = users[0];

        await this.userService.update(user.id, {
          ...user,
          password: this.form.password
        });

        this.toast.add({
          severity: "success",
          summary: "Contraseña actualizada",
          detail: "Redirigiendo al inicio de sesión...",
          life: 3000
        });

        setTimeout(() => {
          this.router.push("/login");
        }, 1500);

      } catch (error) {
        this.toast.add({
          severity: "error",
          summary: "Error",
          detail: error.message || "No se pudo actualizar la contraseña",
          life: 3000
        });
      } finally {
        this.isSubmitting = false;
      }
    }
  }
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="auth-form">
    <h2 class="form-title">Establece tu nueva contraseña</h2>

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
      <label for="password">Nueva Contraseña</label>
      <input
          id="password"
          v-model="form.password"
          type="password"
          class="form-input"
          placeholder="••••••••"
          required
      />
    </div>

    <div class="form-group">
      <label for="confirmPassword">Confirmar Contraseña</label>
      <input
          id="confirmPassword"
          v-model="form.confirmPassword"
          type="password"
          class="form-input"
          placeholder="••••••••"
          required
      />
      <p v-if="passwordMismatch" class="error-message">
        Las contraseñas no coinciden
      </p>
    </div>

    <button
        type="submit"
        class="submit-button"
        :disabled="passwordMismatch || isSubmitting"
    >
      {{ isSubmitting ? 'Actualizando...' : 'Actualizar Contraseña' }}
    </button>

    <div class="form-footer">
      <router-link to="/login" class="auth-link">
        ← Volver al inicio de sesión
      </router-link>
    </div>
  </form>
</template>
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

.form-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #D1D5DB;
  border-radius: 6px;
  background-color: #F9FAFB;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
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
}

.submit-button:disabled {
  background-color: #9CA3AF;
  cursor: not-allowed;
}

.back-link {
  display: inline-block;
  margin-top: 1.5rem;
  color: #6B7280;
  text-decoration: none;
}

.back-link:hover {
  color: #1C1F2B;
  text-decoration: underline;
}
</style>
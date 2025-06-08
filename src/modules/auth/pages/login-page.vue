<template>
  <div class="login-page">
    <Toast />

    <div class="login-container">
      <div class="login-side">
        <LoginForm @success="onLoginSuccess" @error="onLoginError" />
      </div>
      <div class="auth-text-side">
        <auth-text></auth-text>
      </div>
    </div>
  </div>
</template>

<script>
import { useToast } from 'primevue/usetoast';
import LoginForm from "@/modules/auth/components/login-form.vue";
import Toast from 'primevue/toast';
import AuthText from "@/modules/auth/components/auth-text.vue";

export default {
  components: {
    AuthText,
    LoginForm,
    Toast
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  methods: {
    onLoginSuccess() {
      this.toast.add({
        severity: 'success',
        summary: 'Login Successful',
        detail: 'Redirecting to dashboard...',
        life: 2500,
        styleClass: 'custom-toast',
        contentStyleClass: 'custom-toast-content',
        style: {
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        },
      });
    },
    onLoginError(error) {
      this.toast.add({
        severity: 'error',
        summary: 'Login Failed',
        detail: error.message || 'Invalid credentials',
        life: 3000
      });
    }
  }
};
</script>

<style scoped>
/* Estilo base */
.login-container,
.register-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  max-width: 900px;
  width: 100%;
  min-height: 75vh;
  border: 2px solid #1C1F2B;
  border-radius: 10px;
  overflow: hidden;
}

.login-page,
.register-page {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  min-height: 100vh;
  width: 100%;
  box-sizing: border-box;
}

/* Lado izquierdo (formulario) */
.login-side,
.register-side {
  background-color: #F5F0E6;
  flex: 1;
  min-width: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Lado derecho (texto) */
.auth-text-side {
  background-color: #1C1F2B;
  flex: 1;
  min-width: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Responsive para pantallas pequeñas */
@media (max-width: 768px) {
  .login-container,
  .register-container {
    flex-direction: column;
    height: auto;
  }

  .login-side,
  .register-side,
  .auth-text-side {
    width: 100%;
    min-height: 300px;
  }
}
</style>
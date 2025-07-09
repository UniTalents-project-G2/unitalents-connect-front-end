<template>
  <div class="register-page">
    <Toast />

    <div class ="register-container">

      <div class ="register-side">
        <RegisterForm @success="onRegisterSuccess" @error="onRegisterError" />
      </div>
      <div class="auth-text-side">
        <auth-text></auth-text>
      </div >
    </div>
  </div>
</template>

<script>
import { useToast } from 'primevue/usetoast';
import RegisterForm from "@/modules/auth/components/register-form.vue";
import Toast from 'primevue/toast';
import AuthText from "@/modules/auth/components/auth-text.vue";
export default {
  components: {
    AuthText,
    RegisterForm,
    Toast
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  methods: {
    onRegisterSuccess() {
      this.toast.add({
        severity: 'success',
        summary: 'Registration Successful',
        detail: 'Redirecting to login...',
        life: 2500,
        styleClass: 'custom-toast',
        contentStyleClass: 'custom-toast-content',

        style: {
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        },

      });
    },
    onRegisterError(error) {
      this.toast.add({
        severity: 'error',
        summary: 'Registration Failed',
        detail: error.message || 'An error occurred',
        life: 3000
      });
    }
  }
};
</script>

<style>
/* Estilo base */
.login-container,
.register-container {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  max-width: 1200px;
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
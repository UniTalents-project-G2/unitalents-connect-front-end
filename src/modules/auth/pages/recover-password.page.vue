<template>
  <div class="recover-password-page">
    <Toast />

    <div class="auth-container">
      <div class="form-side">
        <RecoverPassword @success="onSuccess" @error="onError" />
      </div>
      <div class="auth-text-side">
        <AuthText />
      </div>
    </div>
  </div>
</template>

<script>
import { useToast } from 'primevue/usetoast';
import RecoverPassword from "@/modules/auth/components/recover-password.vue";
import Toast from 'primevue/toast';
import AuthText from "@/modules/auth/components/auth-text.vue";

export default {
  components: {
    AuthText,
    RecoverPassword,
    Toast
  },
  setup() {
    const toast = useToast();
    return { toast };
  },
  methods: {
    onSuccess() {
      this.toast.add({
        severity: 'success',
        summary: 'Contraseña actualizada',
        detail: 'Tu contraseña ha sido cambiada exitosamente',
        life: 3000,
        styleClass: 'custom-toast',
        style: {
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        }
      });
    },
    onError(error) {
      this.toast.add({
        severity: 'error',
        summary: 'Error',
        detail: error.message || 'No se pudo actualizar la contraseña',
        life: 3000
      });
    }
  }
};
</script>

<style scoped>
.recover-password-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
}

.auth-container {
  display: flex;
  width: 60vw;
  height: 75vh;
  border: 2px solid #1C1F2B;
  border-radius: 10px;
  overflow: hidden;
}

.form-side {
  width: 50%;
  background-color: #F5F0E6;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.auth-text-side {
  width: 50%;
  background-color: #1C1F2B;
}

/* Estilos consistentes con las otras páginas */
.custom-toast {
  background: linear-gradient(to right, #4CAF50, #2E7D32) !important;
  color: white !important;
}

@media (max-width: 768px) {
  .auth-container {
    flex-direction: column;
    width: 90vw;
    height: auto;
  }

  .form-side,
  .auth-text-side {
    width: 100%;
    height: 50vh;
  }
}
</style>
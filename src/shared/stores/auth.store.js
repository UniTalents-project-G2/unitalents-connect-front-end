import { reactive } from 'vue';

export const authStore = reactive({
    user: null,  // Aquí vamos a guardar el usuario logueado completo

    setUser(userData) {
        this.user = userData;
    },

    clear() {
        this.user = null;
    }
});

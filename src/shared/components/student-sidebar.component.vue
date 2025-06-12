<script>
import { useRouter, useRoute } from 'vue-router';

export default {
  name: 'StudentSidebar',
  setup() {
    const router = useRouter();
    const route = useRoute();

    const goTo = (path) => {
      router.push(path);
    };

    const logout = () => {
      localStorage.clear();
      router.push('/login');
    };

    return {
      route,
      goTo,
      logout
    };
  }
};
</script>

<template>
  <div class="sidebar">
    <div class="logo">
      <img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgvCsufMnEbJGV3lUDDIVJzrt_0h1LGoGcW26SsmrCMYUPOxVrSBrtAWYePDBixX3g5mOd0W_9y6Gb4NfTtCRYxKssHvlzuKRm2siI6k3oT1UeSGwNcw7nIYroOFQZ8rXjgVkMFNorTd-65rgFev0NW6Xitt3gTTuMMSWx6NF9yPejDrCvTLdX5AnBQ_UE/s832/LogoUniTalents%20Connect.png" alt="UniTalents Connect" />
    </div>

    <nav class="nav">
      <div class="nav-item" @click="goTo('/student/opportunities')" :class="{ active: route.path === '/student/opportunities' }">
        Oportunidades
      </div>
      <div class="nav-item" @click="goTo('/student/portfolio')" :class="{ active: route.path === '/student/portfolio' }">
        Portafolio
      </div>
      <div class="nav-item" @click="goTo('/student/postulations')" :class="{ active: route.path === '/student/postulations' }">
        Mis Postulaciones
      </div>
      <div class="nav-item" @click="goTo('/student/profile')" :class="{ active: route.path === '/student/profile' }">
        Perfil
      </div>
    </nav>

    <div class="logout">
      <button @click="logout">Cerrar sesión</button>
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  width: 250px;
  background: #1e1e2f;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1.5rem 1rem;
  height: 100vh;
}

.logo {
  text-align: center;
  margin-bottom: 2rem;
}

.logo img {
  width: 200px;
  margin-bottom: 0.5rem;
}

.nav {
  display: flex;
  flex-direction: column;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  transition: background-color 0.2s ease;
  cursor: pointer;
}

.nav-item:hover {
  background-color: #fdd567;
  color: black;
}

.nav-item.active {
  background-color: #fdd567;
  color: black;
}

.logout {
  margin-top: auto;
  padding-top: 2rem;
}

.logout button {
  background: transparent;
  border: none;
  color: #fdd567;
  font-weight: bold;
  cursor: pointer;
  padding: 0.5rem 1rem;
}

.logout button:hover {
  text-decoration: underline;
}
</style>

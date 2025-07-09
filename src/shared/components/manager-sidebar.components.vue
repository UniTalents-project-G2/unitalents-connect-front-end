<script>
import { useRouter, useRoute } from 'vue-router';

export default {
  name: 'ManagerSidebar',
  data() {
    return {
      isOpen: false
    };
  },
  setup() {
    const router = useRouter();
    const route = useRoute();

    const logout = () => {
      localStorage.clear();
      router.push('/login');
    };

    return {
      route,
      logout,
      router
    };
  },
  methods: {
    toggleSidebar() {
      this.isOpen = !this.isOpen;
    },
    closeSidebar() {
      this.isOpen = false;
    }
  }
};
</script>

<template>
  <div>
    <!-- Botón hamburguesa solo visible en móviles -->
    <button class="hamburger-btn" @click="toggleSidebar">
      ☰
    </button>

    <!-- Sidebar -->
    <div class="sidebar" :class="{ open: isOpen }">
      <div class="logo">
        <img
            src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgvCsufMnEbJGV3lUDDIVJzrt_0h1LGoGcW26SsmrCMYUPOxVrSBrtAWYePDBixX3g5mOd0W_9y6Gb4NfTtCRYxKssHvlzuKRm2siI6k3oT1UeSGwNcw7nIYroOFQZ8rXjgVkMFNorTd-65rgFev0NW6Xitt3gTTuMMSWx6NF9yPejDrCvTLdX5AnBQ_UE/s832/LogoUniTalents%20Connect.png"
            alt="UniTalents Connect"
        />
      </div>

      <nav class="nav">
        <router-link
            to="/manager/projects"
            class="nav-item"
            :class="{ active: route.name === 'ManagerProjects' }"
            @click="closeSidebar"
        >Proyectos</router-link>

        <router-link
            to="/manager/calls"
            class="nav-item"
            :class="{ active: route.name === 'ManagerCalls' }"
            @click="closeSidebar"
        >Convocatorias</router-link>

        <router-link
            to="/manager/company"
            class="nav-item"
            :class="{ active: route.name === 'ManagerCompanyView' }"
            @click="closeSidebar"
        >Mi empresa</router-link>
      </nav>

      <div class="logout">
        <button @click="logout">Cerrar sesión</button>
      </div>
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
  transition: transform 0.3s ease;
}

.hamburger-btn {
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 999;
  background: #fdd567;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  display: none;
}

@media (max-width: 945px) {
  .hamburger-btn {
    display: block;
  }

  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    transform: translateX(-100%);
    z-index: 998;
    width: 220px;
  }

  .sidebar.open {
    transform: translateX(0);
  }
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

<script>
import StudentSidebar from '@/shared/components/student-sidebar.component.vue';

export default {
  components: { StudentSidebar }
};
</script>

<template>
  <div class="layout">
    <StudentSidebar />
    <main class="main">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
  overflow: hidden; /* ✅ Esto evita que se genere doble scrollbar */
}

.main {
  flex: 1;
  overflow-y: auto; /* ✅ Solo el contenido scrollable */
  background-color: #f4eddf;
  padding: 2rem;
}
</style>

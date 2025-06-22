<script>
export default {
  name: "AuthSideText",
};
</script>

<template>
  <div class="auth-text-container">
    <div class="header">
      <h1>Conecta talento joven con ideas ambiciosas</h1>
    </div>

    <div class="body">
      <h3>Publica proyectos o postula a oportunidades reales desde hoy</h3>
    </div>

    <div class="logo">
      <img
          src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgvCsufMnEbJGV3lUDDIVJzrt_0h1LGoGcW26SsmrCMYUPOxVrSBrtAWYePDBixX3g5mOd0W_9y6Gb4NfTtCRYxKssHvlzuKRm2siI6k3oT1UeSGwNcw7nIYroOFQZ8rXjgVkMFNorTd-65rgFev0NW6Xitt3gTTuMMSWx6NF9yPejDrCvTLdX5AnBQ_UE/s832/LogoUniTalents%20Connect.png"
          alt="UniTalents Connect"
      />
    </div>
  </div>
</template>

<style scoped>
.auth-text-container {
  background-color: #1c1f2b;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 3rem 2rem;
  gap: 2rem;
  text-align: center;
  height: 100%;
  width: 100%;
}

.header h1 {
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0;
}

.body h3 {
  font-size: 1.1rem;
  max-width: 500px;
  line-height: 1.5;
  margin: 0;
}

.logo img {
  width: 200px;
  height: auto;
}

/* Responsive layout */
@media (min-width: 768px) {
  .auth-text-container {
    align-items: flex-start;
    text-align: left;
    gap: 3rem;
    padding: 4rem;
  }

  .header h1 {
    font-size: 2.5rem;
  }

  .body h3 {
    font-size: 1.5rem;
  }

  .logo img {
    width: 250px;
  }
}
</style>

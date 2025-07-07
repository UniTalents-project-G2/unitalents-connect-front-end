<script >

import PortfolioListComponent from "@/modules/projects/components/portfolio-list.component.vue";


export default {
  name: 'portfolio-page',
  components: { PortfolioListComponent},



}


</script>

<template>
  <h1>Portafolio</h1>
  <portfolio-list-component>
  </portfolio-list-component>
</template>

<style scoped>
h1 {
  padding: 20px;
  margin: 0;
}

@media (max-width: 768px) {
  h1 {
    padding: 15px;
    font-size: 1.5rem;
  }
}
</style>
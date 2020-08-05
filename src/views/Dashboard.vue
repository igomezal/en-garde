<template>
  <div class="home">
    <HomeView/>
  </div>
</template>

<script>
// @ is an alias to /src
import HomeView from '@/components/HomeView.vue'

export default {
  name: 'Dashboard',
  components: {
    HomeView,
  },
}
</script>

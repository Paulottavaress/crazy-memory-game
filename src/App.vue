<template>
  <div id="main-container">
    <TheGameboard />
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import TheGameboard from './components/match/TheGameboard.vue';

  export default defineComponent ({
    components: {
      TheGameboard
    }
  });
</script>

<style lang="scss">
  // 320 x 568 -> iphone 5
  :root {
    --dark-color: rgba(0, 0, 0, 1);
    --white-color: rgb(206, 202, 202);
    --game-table-color: rgb(12, 90, 26);
    --overlay-color: rgba(0, 0, 0, 0.75);
    --app-external-padding: 8px;
    --container-max-width: 1440px;
  }

  * {
    box-sizing: border-box;
    margin: 0px;
    padding: 0px;
  }

  li {
    list-style: none;
  }

  body {
    margin: 0px;

    #main-container {
      height: 100vh;
      width: 100vw;
    }
  }
</style>
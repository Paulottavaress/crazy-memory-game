<template>
  <div id='match-details'>
    <ul></ul>
    <p>Current Player: {{ currentPlayer.name }}</p>
    <p>Pairs: {{ currentPlayer.pairsCount }}</p>
    <p>Score: {{ currentPlayer.score }}</p>
  </div>
</template>

<script>
  export default {
    props: {
      currentPlayer: {
        type: Object,
        required: true
      }
    }
  };
</script>

<style scoped>
  #match-details {
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: var(--overlay-color);
    padding: 4px;
    color: var(--white-color);
  }
</style>
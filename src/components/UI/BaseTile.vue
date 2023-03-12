<template>
  <div :style="{width: tileSize.width + 'px', height: tileSize.height + 'px'}">
    <slot></slot>
  </div>
</template>

<script lang="ts">
  export default {
    props: {
      tileSize: {
        type: Object,
        required: true
      }
    }
  }
</script>

<style scoped lang="scss">
  div {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .tile-visible {
    border: 1px solid var(--dark-color);
    background-color: var(--white-color);
  }

  .tile-hidden {
    background-color: var(--game-table-color);
  }
</style>
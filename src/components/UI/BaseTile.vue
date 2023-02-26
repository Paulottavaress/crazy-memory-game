<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
  export default {}
</script>

<style scoped>
  div {
    border: 1px solid var(--dark-color);
    width: 36px;
    height: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--white-color);
  }
</style>
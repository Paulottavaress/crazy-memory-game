<template>
  <section id='match-details-section'>
    <div v-if="isOpen" id="match-details-open">
      <ul>
        <li><p>Current Player: {{ currentPlayer.name }}</p></li>
        <li><p>Pairs: {{ currentPlayer.pairsCount }}</p></li>
        <li><p>Score: {{ currentPlayer.score }}</p></li>
      </ul>
      <div class="icon-container">
        <i @click="toggleTab(false)" class="fa-solid fa-arrow-down"></i>
      </div>
    </div>
    <div v-else id="match-details-closed">
      <p>{{ currentPlayer.name }} / {{ currentPlayer.pairsCount }} / {{ currentPlayer.score }}</p>
      <div class="icon-container">
        <i @click="toggleTab(true)" class="fa-solid fa-arrow-up"></i>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import Player from '@/types/Player';
  import type { PropType } from 'vue';
  import { mapActions } from 'vuex';

  export default defineComponent({
    data() {
      return {
        isOpen: false
      }
    },
    methods: {
      ...mapActions([
        'checkIfTilesAreOverflowing',
        'resetTileSizeCorrection'
      ]),
      toggleTab(tabStatus: boolean) {
        this.isOpen = tabStatus;
        if (!tabStatus) this.resetTileSizeCorrection();
      }
    },
    props: {
      currentPlayer: {
        type: Object as PropType<Player>,
        required: true
      }
    },
    name: 'MatchDetails',
    updated() {
      this.checkIfTilesAreOverflowing();
    }
  });
</script>

<style scoped lang="scss">
  #match-details-section {
    padding: var(--app-external-padding);
    width: 100%;
    background-color: var(--overlay-color);
    display: flex;
    color: var(--white-color);

    i {
      font-size: 24px;
      cursor: pointer;
    }

    #match-details-open {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 4px;
      width: 100%;
    }
    .icon-container {
      width: 50px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    #match-details-closed {
      display: flex;
      width: 100%;
      justify-content: space-between;
      padding: 4px;
    }
  }
</style>
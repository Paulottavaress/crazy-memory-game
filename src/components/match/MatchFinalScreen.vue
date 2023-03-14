<template>
  <div id="match-final-screen">
    <section v-if="isATie">
      <p>It was a tie!</p>
      <p>The winners are {{ winnersNames }}!</p>
    </section>
    <section v-else>
      <p>{{ matchFinalResult[0].name }} won this match!</p>
    </section>
    <p>Score: {{ matchFinalResult[0].score }}</p>
    <button @click="$emit('play-again')">Play again!</button>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import type { PropType } from 'vue';
  import Player from '@/types/Player';

  export default defineComponent({
    computed: {
      isATie(): boolean {
        return this.matchFinalResult.length > 1;
      },
      matchFinalResult(): Player[] {
        let highestScorerPlayer: Player[] = [];

        this.players.forEach(player => {
          if (highestScorerPlayer.length === 0 || player.score > highestScorerPlayer[0].score) highestScorerPlayer = [player];
          else if (player.score === highestScorerPlayer[0].score) highestScorerPlayer.push(player);
        });

        return highestScorerPlayer;
      },
      winnersNames(): string {
        const winnersArr: string[] = [];
        this.matchFinalResult.forEach(winner => winnersArr.push(winner.name));
        let winnersStr = winnersArr.join(', ');
        const lastIndex = winnersStr.lastIndexOf(',');
        winnersStr = winnersStr.slice(0, lastIndex) + ' and' + winnersStr.slice(lastIndex + 1);
        return winnersStr;
      }
    },
    props: {
      players: {
        type: Array as PropType<Player[]>,
        required: true
      }
    }
  });
</script>

<style>
  #match-final-screen {
    padding: var(--app-external-padding);
  }
</style>
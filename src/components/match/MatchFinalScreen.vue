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

<script>
  export default {
    computed: {
      isATie() {
        console.log('isATie', this.matchFinalResult)
        return this.matchFinalResult.length > 0;
      },
      matchFinalResult() {
        let highestScorerPlayer = [{score: 0}];

        this.players.forEach(player => {
          if (player.score > highestScorerPlayer[0].score) highestScorerPlayer = [player];
          else if (player.score === highestScorerPlayer[0].score) highestScorerPlayer.push(player);
        });

        return highestScorerPlayer;
      },
      winnersNames() {
        let winners = [];
        this.matchFinalResult.forEach(winner => winners.push(winner.name));
        winners = winners.join(', ');
        const lastIndex = winners.lastIndexOf(',');
        winners = winners.slice(0, lastIndex) + ' and' + winners.slice(lastIndex + 1);
        return winners;
      }
    },
    props: {
      players: {
        type: Array,
        required: true,
        default: [{score: 0}]
      }
    }
  }
</script>

<style></style>
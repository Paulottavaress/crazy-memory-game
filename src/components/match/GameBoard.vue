<template>
  <main>
    <section
      v-if="isGameRunning"
      id="game-board"
    >
      <div
        v-for="tile in tiles"
        :key="tile.id"
        @click="turnTileOver(tile)"
      >
        <BaseTile v-if="!tile.isPaired">
          <p v-if="tile.isFaceUp">{{ tile.value }}</p>
        </BaseTile>
      </div>
      <MatchDetails :currentPlayer="currentPlayer" />
    </section>
    <section
      v-else-if="tiles.length > 0"
      :players="players"
      @play-again="playAgain"
    >
      <MatchFinalScreen />
    </section>
    <section
      v-else
      id="game-settings"
    >
      <p>Começar o jogo?</p>
      <button @click="startGame">Start Game</button>
    </section>
  </main>
</template>

<script lang="ts">
  import BaseTile from '../UI/BaseTile.vue';
  import MatchDetails from './MatchDetails.vue';
  import MatchFinalScreen from './MatchFinalScreen.vue';

  export default {
    components: {
      BaseTile,
      MatchDetails,
      MatchFinalScreen
    },
    computed: {
      currentPlayer(): any {
        return this.players.find(player => player.isTurn);
      },
      isGameRunning(): boolean {
        return !(this.tiles.filter(tile => !tile.isPaired).length === 0);
      }
    },
    data() {
      return {
        gameConfig: {
          pairCount: 6, //24 //36 //48(probably won't work in small devices)
          matchBasePoints: 50
        },
        players: [
          {
            arrPos: null as null|number,
            id: 0,
            isTurn: false,
            hasTurnedFirstTile: false,
            hasTurnedSecondTile: false,
            name: 'Paulo',
            pairsCount: 0,
            score: 0,
            streak: 0
          },
          {
            arrPos: null as null|number,
            id: 1,
            isTurn: false,
            hasTurnedFirstTile: false,
            hasTurnedSecondTile: false,
            name: 'Rafael',
            pairsCount: 0,
            score: 0,
            streak: 0
          }
        ],
        playerTurnTimeLimitMs: 30000,
        selectedTiles: [] as any,
        tiles: [] as any[],
        tileFaceUpMs: 1000
      }
    },
    methods: {
      checkIfIsMatch() {
        return this.selectedTiles[0].value === this.selectedTiles[1].value;
      },
      handleMatch() {
        this.selectedTiles.forEach((selectedTile: any) => {
          this.tiles.find(tile => (tile.id === selectedTile.id)).isPaired = true;
        });
        this.currentPlayer.pairsCount = this.currentPlayer.pairsCount + 1;
        this.currentPlayer.streak = this.currentPlayer.streak + 1;
        this.currentPlayer.score = this.currentPlayer.score + this.gameConfig.matchBasePoints;
        this.currentPlayer.hasTurnedFirstTile = false;
        this.currentPlayer.hasTurnedSecondTile = false;
        this.selectedTiles = [];
      },
      nextTurn() {
        const currentPlayer =  this.currentPlayer;
        currentPlayer.hasTurnedFirstTile = false;
        currentPlayer.hasTurnedSecondTile = false;
        (this.players.length === (currentPlayer.arrPos + 1))
          ? this.players[0].isTurn = true
          : this.players[currentPlayer.arrPos + 1].isTurn = true;
        currentPlayer.isTurn = false;
        this.selectedTiles = [];
      },
      playAgain() {
        this.players.forEach(player => {
          player.isTurn = false;
          player.hasTurnedFirstTile = false;
          player.hasTurnedSecondTile = false;
          player.name = 'Paulo';
          player.pairsCount = 0;
          player.score = 0;
          player.streak = 0;
        });
        this.selectedTiles = [];
        this.tiles = [];
        this.startGame();
      },
      shuffleArray(arr: any[]) {
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          const temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;
        }
        return arr;
      },
      startGame() {
        for (let i = 0; i < this.gameConfig.pairCount; i++) {
          this.tiles.push({
            id: this.tiles.length + 1,
            value: i + 1,
            isFaceUp: false,
            isPaired: false
          });
          this.tiles.push({
            id: this.tiles.length + 1,
            value: i + 1,
            isFaceUp: false,
            isPaired: false
          });
        }
        this.tiles = this.shuffleArray(this.tiles);
        this.players = this.shuffleArray(this.players);
        this.players.forEach(player => {
          player.arrPos = this.players.indexOf(player);
        });
        this.players[0].isTurn = true;
      },
      turnAllTilesFaceDown() {
        this.tiles.forEach(tile => tile.isFaceUp = false);
      },
      turnTileOver(selectedTile: any) {
        // add animation: https://www.w3schools.com/howto/howto_css_flip_card.asp
        if (this.selectedTiles.find((tile: any) => selectedTile.id === tile.id)) return;
        if (!this.currentPlayer.hasTurnedSecondTile) {
          this.selectedTiles.push(selectedTile);
          selectedTile.isFaceUp = true;
          if (this.currentPlayer.hasTurnedFirstTile) {
            this.currentPlayer.hasTurnedSecondTile = true;
            setTimeout(() => {
              this.turnAllTilesFaceDown();
              if (!this.checkIfIsMatch()) this.nextTurn();
              else this.handleMatch();
            }, this.tileFaceUpMs);
          }
        }
        this.currentPlayer.hasTurnedFirstTile = true;
      },
    },
    name: 'GameBoard'
  };
</script>

<style scoped lang="scss">
  main {
    background-color: var(--game-table-color);
    height: 100%;
    width: 100%;
    padding: 8px;

    #game-board {
      width: 100%;
      height: 100%;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      justify-content: center;
      align-items: center;
    }
  }
</style>

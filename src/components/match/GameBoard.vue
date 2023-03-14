<template>
  <main ref="main">
    <section
      v-if="isGameRunning"
      id="gameboard"
    >
      <div id="tiles-area">
        <div id="tiles-wrapper">
          <div
            v-for="tile in tiles"
            :key="tile.id"
            @click="selectTile(tile)"
          >
            <BaseTile
              :class="tile.isPaired ? 'tile-hidden' : 'tile-visible'"
              :tileSize="calculateTileSize"
            >
              <p v-if="tile.isSelected">{{ tile.value }}</p>
            </BaseTile>
          </div>
        </div>
      </div>
      <MatchDetails :currentPlayer="currentPlayer" />
    </section>
    <section
      v-else-if="tiles.length > 0"
      :players="players"
    >
      <MatchFinalScreen 
        :players="players"
        @play-again="playAgain"
      />
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
  import { defineComponent } from 'vue';
  import BaseTile from '../UI/BaseTile.vue';
  import GameConfig from '@/types/GameConfig';
  import MatchDetails from './MatchDetails.vue';
  import MatchFinalScreen from './MatchFinalScreen.vue';
  import Player from '@/types/Player';
  import Tile from '@/types/Tile';

  export default defineComponent({
    components: {
      BaseTile,
      MatchDetails,
      MatchFinalScreen
    },
    computed: {
      calculateTileSize(): {width: number, height: number} {
        const gb = this.$refs.main as HTMLElement;
        const gbPaddingRight = parseInt(window.getComputedStyle(gb).paddingRight);
        const gbPaddingLeft = parseInt(window.getComputedStyle(gb).paddingLeft);
        const gbWidth = gb.clientWidth - gbPaddingLeft - gbPaddingRight;
        const gbPaddingTop = parseInt(window.getComputedStyle(gb).paddingTop);
        const gbPaddingBottom = parseInt(window.getComputedStyle(gb).paddingBottom);
        const gbHeight = gb.clientHeight - gbPaddingTop - gbPaddingBottom;
        const gbPixels = gbWidth * gbHeight;
        const tilesTotalCount = this.gameConfig.pairCount * 2;
        const gbPixelsPerTile = gbPixels / tilesTotalCount;
        let tileArea = 100;
        let tileHeight = 10;

        while (tileArea < gbPixelsPerTile) {
          tileArea = tileHeight ** 2;
          if (tileArea < gbPixelsPerTile) tileHeight++;
        }

        return {
          width: tileHeight - this.deviceSettings.tileSizeCorrection, 
          height: tileHeight - this.deviceSettings.tileSizeCorrection
        };
      },
      checkIfIsMatch(): boolean {
        return this.selectedTiles[0] && this.selectedTiles[1] && this.selectedTiles[0].value === this.selectedTiles[1].value;
      },
      currentPlayer(): Player {
        return this.players.filter(player => player.isTurn)[0];
      },
      isGameRunning(): boolean {
        return !(this.tiles.filter(tile => !tile.isPaired).length === 0);
      },
      selectedTiles(): Tile[] {
        return this.tiles.filter(tile => tile.isSelected);
      }
    },
    data() {
      return {
        deviceSettings: {
          tileSizeCorrection: 2,
          tileGap: 1
        },
        gameConfig: {
          pairCount: 24, //24 //36 //48(probably won't work in small devices)
          matchBasePoints: 50,
          playerTurnTimeLimitMs: 30000,
          tileFaceUpMs: 1000
        } as GameConfig,
        players: [
          {
            arrPos: 0,
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
            arrPos: 0,
            id: 1,
            isTurn: false,
            hasTurnedFirstTile: false,
            hasTurnedSecondTile: false,
            name: 'Rafael',
            pairsCount: 0,
            score: 0,
            streak: 0
          }
        ] as Player[],
        tiles: [] as Tile[]
      }
    },
    methods: {
      addPair(val: number): void {
        this.tiles.push({
          id: this.tiles.length + 1,
          value: val + 1,
          isSelected: false,
          isPaired: false
        });
      },
      checkIfTilesAreOverflowing() {
        const gb = this.$refs.main as HTMLElement;

        if (gb) {
          const isOverflowing = 
          gb.clientWidth < gb.scrollWidth 
          || gb.clientHeight < gb.scrollHeight;

          if (isOverflowing) this.deviceSettings.tileSizeCorrection++;
        }
      },
      handleMatch(): void {
        this.selectedTiles.forEach((selectedTile: Tile) => {
          const tile = this.tiles.find(tile => (tile.id === selectedTile.id));
          if (tile) tile.isPaired = true;
        });
        this.currentPlayer.pairsCount = this.currentPlayer.pairsCount + 1;
        this.currentPlayer.streak = this.currentPlayer.streak + 1;
        this.currentPlayer.score = this.currentPlayer.score + this.gameConfig.matchBasePoints;
        this.currentPlayer.hasTurnedFirstTile = false;
        this.currentPlayer.hasTurnedSecondTile = false;
      },
      nextTurn(): void {
        const currentPlayer = this.currentPlayer;
        currentPlayer.hasTurnedFirstTile = false;
        currentPlayer.hasTurnedSecondTile = false;
        (this.players.length === (currentPlayer.arrPos + 1))
          ? this.players[0].isTurn = true
          : this.players[currentPlayer.arrPos + 1].isTurn = true;
        currentPlayer.isTurn = false;
      },
      playAgain(): void {
        this.players.forEach(player => {
          player.isTurn = false;
          player.hasTurnedFirstTile = false;
          player.hasTurnedSecondTile = false;
          player.pairsCount = 0;
          player.score = 0;
          player.streak = 0;
        });
        this.tiles = [];
        this.startGame();
      },
      selectTile(selectedTile: Tile): void {
        // add animation: https://www.w3schools.com/howto/howto_css_flip_card.asp
        if (
          this.selectedTiles.find(tile => selectedTile.id === tile.id)
          || selectedTile.isPaired
        ) return;
        if (!this.currentPlayer.hasTurnedSecondTile) {
          selectedTile.isSelected = true;
          if (this.currentPlayer.hasTurnedFirstTile) {
            this.currentPlayer.hasTurnedSecondTile = true;
            setTimeout(() => {
              if (!this.checkIfIsMatch) this.nextTurn();
              else this.handleMatch();
              this.unselectAllTiles();
            }, this.gameConfig.tileFaceUpMs);
          }
        }
        this.currentPlayer.hasTurnedFirstTile = true;
      },
      shuffleArray(arr: any[]): any[] {
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          const temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;
        }
        return arr;
      },
      startGame(): void {
        for (let ia = 0; ia < this.gameConfig.pairCount; ia++) {
          for (let ib = 0; ib < 2; ib++) this.addPair(ia);
        }
        this.tiles = this.shuffleArray(this.tiles);
        this.players = this.shuffleArray(this.players);
        this.players.forEach(player => player.arrPos = this.players.indexOf(player));
        this.players[0].isTurn = true;
      },
      unselectAllTiles(): void {
        this.tiles.forEach(tile => tile.isSelected = false);
      }
    },
    name: 'GameBoard',
    updated() {
      this.checkIfTilesAreOverflowing();
    }
  });
</script>

<style scoped lang="scss">
  main {
    background-color: var(--game-table-color);
    height: 100%;
    width: 100%;

    #gameboard {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;

      #tiles-area {
        flex-grow: 1;
        display: flex;

        #tiles-wrapper {
          margin: auto;
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          gap: 1px;
          padding: var(--app-external-padding);
        }
      }
    }

    #game-settings {
      padding: var(--app-external-padding);
    }

    @media (min-width: 425px) {
      #tiles-area {
        gap: 2px;
      }
    }

    @media (min-width: 768px) {
      #tiles-area {
        gap: 4px;
      }
    }

    @media (min-width: 1024px) {
      #tiles-area {
        gap: 8px;
      }
    }
  }
</style>

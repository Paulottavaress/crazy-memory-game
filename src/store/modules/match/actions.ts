import { Commit } from "vuex";

export default {
  checkIfTilesAreOverflowing({ commit, getters }: { commit: Commit, getters: any}) {
    const gb = document.querySelector('main') as HTMLElement;

    if (gb) {
      const isOverflowing = 
      gb.clientWidth < gb.scrollWidth 
      || gb.clientHeight < gb.scrollHeight;

      if (isOverflowing) {
        commit('incrementTileSize');
        if (getters.idealTileSizeCorrection === 0) commit('setIdealTileSizeCorrection');
      }
    }
  },
  resetTileSizeCorrection({ commit }: { commit: Commit }) {
    commit('resetTileSizeCorrection');
  }
}
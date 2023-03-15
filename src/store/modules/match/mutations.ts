import StateMatchModule from "@/types/StateMatchModule";

export default {
  incrementTileSize(state: StateMatchModule) {
    state.deviceSettings.tileSizeCorrection++;
  },
  setIdealTileSizeCorrection(state: StateMatchModule) {
    state.deviceSettings.idealTileSizeCorrection = state.deviceSettings.tileSizeCorrection;
  },
  resetTileSizeCorrection(state: StateMatchModule) {
    state.deviceSettings.tileSizeCorrection = state.deviceSettings.idealTileSizeCorrection;
  }
}
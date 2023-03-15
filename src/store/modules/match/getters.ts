import StateMatchModule from "@/types/StateMatchModule";

export default {
  tileSizeCorrection(state: StateMatchModule): number {
    return state.deviceSettings.tileSizeCorrection;
  },
  idealTileSizeCorrection(state: StateMatchModule): null | number {
    return state.deviceSettings.idealTileSizeCorrection
  }
}
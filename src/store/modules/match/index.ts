import matchGetters from "./getters";
import matchMutations from "./mutations";
import matchActions from "./actions";
import matchState from "./state";

const matchModule = {
  state: matchState,
  getters: matchGetters,
  mutations: matchMutations,
  actions: matchActions,
};

export default matchModule;
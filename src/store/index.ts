import { createStore } from 'vuex';
import matchModule from './modules/match';

export default createStore({
  modules: {
    matchModule
  }
})
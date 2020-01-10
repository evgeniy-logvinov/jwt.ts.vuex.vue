import Vue from 'vue';
import Vuex from 'vuex';
import { SecurityModule, UserModule } from '@/store/modules';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    version: '',
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    security: SecurityModule,
    user: UserModule,
  },
});

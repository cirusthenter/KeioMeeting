//ログイン情報、ログイン状態の２つを保持する場所
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

// .envファイルから環境変数(トークン・URLを読み込ませる)

export default new Vuex.Store({
  state: {
    user: {},
    status: false,
  },
  mutations: {
    onAuthStateChanged(state, user) {
      state.user = user; //firebaseが返したユーザー情報
    },
    onUserStatusChanged(state, status) {
      state.status = status; //ログインしてるかどうか true or false
    },
  },
  getters: {
    user(state) {
      return state.user;
    },
    isSignedIn(state) {
      return state.status;
    },
  },
  actions: {
  },
});

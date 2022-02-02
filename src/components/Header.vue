<template>
  <div class="header">
    <a class="logo">
      <div href="." class="logo--text">リアル窮理図解</div>
    </a>
    <div class="header-right">
      <!-- 未ログイン時にはログインボタンを表示 -->
      <div v-if="!isLoggedIn" key="logout" class="log-button">
        <button class="sign-in--button" @click="login()">
          サインイン
        </button>
      </div>
      <!-- ログイン時にはフォームとログアウトボタンを表示 -->
      <div v-if="isLoggedIn" key="login" class="log-button">
        <button class="sign-out--button" @click="logout">
          サインアウト
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Firebase from "./../firebase";
export default {
  name: "navigation",
  created() {
    Firebase.onAuth();
  },
  data() {
    return {
      menuPosition: false,
    };
  },
  methods: {
    // ログイン処理
    login() {
      Firebase.login();
    },
    // ログアウト処理
    logout() {
      Firebase.logout();
    },
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
    isLoggedIn() {
      // ログインするとtrue
      return this.$store.getters.isSignedIn;
    },
  },
};
</script>

<style scoped>
.header {
  margin: 5px;
  padding: 5px;
  height: 50px;
}
.logo {
  float: left;
}
.logo--text {
  display: inline-block;
  margin-left: 4px;
  color: #000;
  font-family: ten-mincho-text, serif;
  font-weight: 900;
  font-style: normal;
  font-size: 30px;
  line-height: 50px;
}
.header-right {
  height: 50px;
}
.log-button {
  float: right;
}
.sign-in--button {
  color: white;
  background-color: black;
  border: solid 1px;
  margin-top: 11px;
  margin-right: 4px;
  padding: 7px;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  border-radius: 2px;
}

.sign-out--button {
  color: black;
  background-color: white;
  border: solid 1px;
  margin-top: 11px;
  margin-right: 4px;
  padding: 7px;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  border-radius: 2px;
}
.display-name {
  margin: 3px;
  margin-right: 10px;
  float: left;
}
body {
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
}
button:hover {
  opacity: 0.7;
}
</style>

<template>
  <body>
    <div class="sign-in--wrapper">
      <button class="msg" @click="login()">keio.jp でサインインする</button>
    </div>
  </body>
</template>
<script>
import Firebase from "./../firebase";
export default {
  created() {
    Firebase.onAuth();
  },
  methods: {
    // ログイン処理
    login() {
      Firebase.login();
    },
  },
};
</script>
<style>
.sign-in--wrapper {
  background-color: white;
  text-align: center;
  width: 100%;
  display: flex;
}
.msg {
  color: #000;
  font-family: ten-mincho-text, serif;
  font-weight: 400;
  font-style: normal;
  margin: 150px auto;
  background-color: white; /* Green */
  border: solid 1px;
  color: black;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  font-size: 16px;
  border-radius: 2px;
}
</style>
<template>
  <div id="app">
    <Header />
    <body>
      <main>
        <Home v-if="isSignedIn" />
        <Login v-else />
      </main>
    </body>
    <Footer />
  </div>
</template>

<script>
import Firebase from "./firebase";
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import Login from "@/views/Login.vue";
import Home from "@/views/Home.vue";

export default {
  name: "App",
  components: {
    Header: Header,
    Login: Login,
    Home: Home,
    Footer: Footer,
  },
  created: function() {
    Firebase.onAuth();
  },
  computed: {
    isSignedIn() {
      return this.$store.getters.isSignedIn;
    },
  },
};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
}
</style>

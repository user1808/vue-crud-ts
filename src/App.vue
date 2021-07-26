<template>
  <v-app>
    <NavigationBar />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import NavigationBar from "./components/NavigationBar.vue";

@Component({
  name: "App",
  components: {
    NavigationBar,
  }
})
export default class App extends Vue {}
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@700&display=swap");

.h1 {
  font-family: "Roboto Condensed", sans-serif;
  font-weight: 700;
  font-size: 28px;
  line-height: 38px;
  font-style: normal;
  color: black;
}

.h2 {
  font-family: "Roboto Condensed", sans-serif;
  font-weight: 700;
  font-size: 24px;
  line-height: 28px;
  font-style: normal;
  color: black;
}

.body {
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  font-style: normal;
  color: black;
}

.label {
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  font-style: normal;
  color: black;
}
</style>

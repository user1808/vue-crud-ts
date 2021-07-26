<template>
  <nav>
    <v-app-bar app flat color="primary">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title class="pl-1">
        <span>Simple </span>
        <span class="font-weight-bold">CRUD</span>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <LoginPopup v-if="!logged" />
      <v-btn
        depressed
        v-if="logged"
        color="primary black--text"
        @click="showLogoutPopup = true"
      >
        <span>Logout</span>
        <v-icon right>mdi-logout-variant</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer temporary app class="primary" v-model="drawer">
      <v-list>
        <v-list-item
          v-for="(link, index) in links"
          :key="index"
          router
          :to="link.route"
        >
          <v-list-item-icon>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ link.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <Modal
      :isOpen="showLogoutPopup"
      :title="'Log Out'"
      :message="'Are you sure you want to log out?'"
      @handleNo="closeModal"
      @handleYes="logout"
    />
  </nav>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Modal from "./Modal.vue";
import LoginPopup from "./LoginPopup.vue";
import { mapState, mapActions } from "vuex";
import { dataService } from "../shared/data.service";

interface Link {
  icon: string,
  text: string,
  route: string,
}

@Component({
  name: "NavigationBar",
  components: { LoginPopup, Modal },
  methods: {
    ...mapActions(["setLoggedAction", "removePeopleAction"]),
  },
  computed: {
    ...mapState(["logged"]),
  }
})
export default class NavigationBar extends Vue {
  removePeopleAction!: () => void;
  setLoggedAction!: (logged: boolean) => void;
  
  drawer: boolean = false;
  showLogoutPopup: boolean = false;
  links: Array<Link> = [
    { icon: "mdi-account", text: "CRUD", route: "/" },
    { icon: "mdi-view-list", text: "List of people", route: "/people" }
  ];
  closeModal() {
      this.showLogoutPopup = false;
  }
  async logout() {
    const token: string | null = this.$cookies.get("token") as string | null;
    let invalidateTokenStatus = true;
    if (token) {
      invalidateTokenStatus = await dataService.invalidateToken(token);
    }
    if (invalidateTokenStatus) {
      this.$cookies.remove("token");
      this.$cookies.remove("username");
      this.$cookies.remove("password");
      this.removePeopleAction();
      this.setLoggedAction(false);
    }
    this.closeModal();
  }
}
</script>
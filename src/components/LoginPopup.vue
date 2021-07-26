<template>
  <div>
    <v-dialog width="500" v-model="showDialog">
      <template v-slot:activator="{ on }">
        <v-btn depressed v-on="on" color="primary black--text">
          <span>Login</span>
          <v-icon right>mdi-login-variant</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="headline justify-center"> Log in </v-card-title>
        <v-card-text>
          <v-form class="px-3">
            <v-text-field
              label="Username"
              v-model="username"
              prepend-icon="mdi-account"
              color="black"
              :error-messages="errorMessages"
            ></v-text-field>
            <v-text-field
              label="Password"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              prepend-icon="mdi-account"
              color="black"
              @click:append="showPassword = !showPassword"
              :error-messages="errorMessages"
            ></v-text-field>

            <v-btn depressed class="mx-0 mt-3" @click="login()"> Login </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { mapActions } from "vuex";
import { dataService } from "../shared/data.service";

@Component({
  name: "LoginPopup",
  methods: {
    ...mapActions(["setLoggedAction"]),
  },
})
export default class LoginPopup extends Vue {
  setLoggedAction!: (logged: boolean) => void;

  username: string = "";
  password: string = "";
  errorMessages: string = "";
  showPassword: boolean = false;
  showDialog: boolean = false;

  async login() {
    const token: string | null = await dataService.getToken(this.username, this.password);
    if (token) {
      this.$cookies.set("token", token, { expires: "300s" });
      this.$cookies.set("username", this.username);
      this.$cookies.set("password", this.password);
      this.setLoggedAction(true);
    } else {
      this.errorMessages = "Invalid username or password";
    }
  }
  @Watch("showDialog")
  onShowDialogChange(newValue: boolean, oldValue: boolean) {
    if (!newValue && oldValue) {
      this.username = "";
      this.password = "";
      this.errorMessages = "";
    }
  }
}
</script>
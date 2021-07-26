<template>
  <div>
    <h1 class="text-center">{{ message }}</h1>

    <div id="people-list" v-if="logged" :class="$vuetify.breakpoint">
      <v-card class="py-8" flat v-for="(person, index) in people" :key="index">
        <v-avatar size="80" color="primary" class="h2">
          {{ person.initials }}
        </v-avatar>
        <div id="person-info" :class="$vuetify.breakpoint">
          <v-row class="ma-0 pt-4">
            <span class="h1">{{ person.fullName }}</span>
          </v-row>
          <div class="pt-4 pt-sm-6">
            <v-row class="ma-0">
              <v-icon color="black" class="mail-icon">mdi-email</v-icon>
              <v-col class="pa-0">
                <div class="label">E-mail</div>
                <div class="body">{{ person.email }}</div>
              </v-col>
            </v-row>
            <v-row class="ma-0 pt-4">
              <v-icon color="black" class="other-icon">mdi-phone</v-icon>
              <v-col class="pa-0">
                <div class="label">Phone</div>
                <div class="body">
                  {{ formatPhoneNumber(person.phone) }}
                </div>
              </v-col>
            </v-row>
            <v-row class="ma-0 pt-4">
              <v-icon color="black" class="other-icon">mdi-cake-variant</v-icon>
              <v-col class="pa-0">
                <div class="label">Birthday</div>
                <div class="body">{{ formatDate(person.birthDate) }}</div>
              </v-col>
            </v-row>
          </div>
        </div>
      </v-card>
    </div>
  </div>
</template>

<script lang="ts">
import { Component } from "vue-property-decorator";
import { mixins } from "vue-class-component";
import mixinForViews from "../shared/mixinForViews";

@Component({
  name: "PeopleList",
})
export default class PeopleList extends mixins(mixinForViews) {
  setUpView = async (token: string | null, logged: boolean) => {
    if (logged && token) {
      this.messageSetter("Getting the people, please be patient");
      await this.getPeopleAction(token);
      this.messageSetter("List Of People");
    } else {
      this.messageSetter("You are not logged in!");
    }
  }
}
</script>

<style scoped>
#people-list {
  margin-left: 71px;
}
#people-list.xsOnly {
  margin-left: 16px;
}
#people-list.lgAndUp {
  margin-left: 360px;
}
#person-info.smAndUp {
  padding-left: 30px;
}
.mail-icon {
  padding-right: 6px;
}
.other-icon {
  padding-right: 7px;
}
</style>